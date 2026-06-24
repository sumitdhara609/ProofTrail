"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createEvidenceSchema } from "@/lib/validation/evidence";
import { createPublicSlug, generateProofCode } from "@/lib/proof/codes";

type AddEvidenceState = {
  error?: string;
};

export async function addEvidence(
  achievementId: string,
  _previousState: AddEvidenceState,
  formData: FormData
): Promise<AddEvidenceState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const rawInput = {
    achievementId,
    evidenceType: String(formData.get("evidenceType") || "other"),
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    sourceUrl: String(formData.get("sourceUrl") || ""),
    isPublic: formData.get("isPublic") === "on",
  };

  const parsed = createEvidenceSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Invalid evidence information.",
    };
  }

  const input = parsed.data;

  const { data: achievement, error: achievementError } = await supabase
    .from("achievements")
    .select("id, user_id, verification_status")
    .eq("id", achievementId)
    .eq("user_id", user.id)
    .single();

  if (achievementError || !achievement) {
    return {
      error: "Achievement record not found.",
    };
  }

  const { data: evidence, error: evidenceError } = await supabase
    .from("evidence_items")
    .insert({
      achievement_id: achievementId,
      user_id: user.id,
      evidence_type: input.evidenceType,
      title: input.title,
      description: input.description || null,
      source_url: input.sourceUrl || null,
      is_public: input.isPublic,
    })
    .select("id")
    .single();

  if (evidenceError || !evidence) {
    return {
      error: evidenceError?.message || "Could not add evidence.",
    };
  }

  if (achievement.verification_status === "claimed") {
    await supabase
      .from("achievements")
      .update({
        verification_status: input.sourceUrl
          ? "source_linked"
          : "evidence_attached",
        updated_at: new Date().toISOString(),
      })
      .eq("id", achievementId)
      .eq("user_id", user.id);
  }

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    achievement_id: achievementId,
    action: "evidence.added",
    entity_type: "evidence_item",
    entity_id: evidence.id,
    metadata: {
      evidence_type: input.evidenceType,
      title: input.title,
      is_public: input.isPublic,
      has_source_url: Boolean(input.sourceUrl),
    },
  });

  revalidatePath(`/vault/${achievementId}`);
  revalidatePath("/vault");
  revalidatePath("/dashboard");

  return {};
}

export async function generatePublicProofLink(achievementId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: achievement, error: achievementError } = await supabase
    .from("achievements")
    .select("id, user_id, visibility, title")
    .eq("id", achievementId)
    .eq("user_id", user.id)
    .single();

  if (achievementError || !achievement) {
    redirect(`/vault/${achievementId}?error=record-not-found`);
  }

  const { data: existingProofLink } = await supabase
    .from("public_proof_links")
    .select("id")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (existingProofLink) {
    redirect(`/vault/${achievementId}`);
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";

  const proofCode = generateProofCode();
  const publicSlug = createPublicSlug(proofCode);
  const qrTargetUrl = `${protocol}://${host}/proof/${publicSlug}`;

  const { data: proofLink, error: proofError } = await supabase
    .from("public_proof_links")
    .insert({
      achievement_id: achievementId,
      user_id: user.id,
      proof_code: proofCode,
      public_slug: publicSlug,
      qr_target_url: qrTargetUrl,
      is_active: true,
    })
    .select("id")
    .single();

  if (proofError || !proofLink) {
    redirect(
      `/vault/${achievementId}?error=${encodeURIComponent(
        proofError?.message || "Could not generate proof link."
      )}`
    );
  }

  if (achievement.visibility === "private") {
    await supabase
      .from("achievements")
      .update({
        visibility: "unlisted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", achievementId)
      .eq("user_id", user.id);
  }

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    achievement_id: achievementId,
    action: "proof_link.generated",
    entity_type: "public_proof_link",
    entity_id: proofLink.id,
    metadata: {
      proof_code: proofCode,
      public_slug: publicSlug,
      qr_target_url: qrTargetUrl,
    },
  });

  revalidatePath(`/vault/${achievementId}`);
  revalidatePath("/vault");
  revalidatePath("/dashboard");
  revalidatePath(`/proof/${publicSlug}`);

  redirect(`/vault/${achievementId}`);
}