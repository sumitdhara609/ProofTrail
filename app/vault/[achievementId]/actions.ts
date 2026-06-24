"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createEvidenceSchema } from "@/lib/validation/evidence";
import { createAchievementSchema } from "@/lib/validation/achievement";
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

export async function updateAchievement(
  achievementId: string,
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const rawInput = {
    title: String(formData.get("title") || ""),
    category: String(formData.get("category") || "other"),
    issuer: String(formData.get("issuer") || ""),
    achievementDate: String(formData.get("achievementDate") || ""),
    description: String(formData.get("description") || ""),
    impactSummary: String(formData.get("impactSummary") || ""),
    visibility: String(formData.get("visibility") || "private"),
  };

  const parsed = createAchievementSchema.safeParse(rawInput);

  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message || "Invalid achievement data.";

    redirect(`/vault/${achievementId}/edit?error=${encodeURIComponent(message)}`);
  }

  const input = parsed.data;

  const { data: existingRecord, error: existingRecordError } = await supabase
    .from("achievements")
    .select(
      "id, user_id, title, category, issuer, achievement_date, description, impact_summary, visibility"
    )
    .eq("id", achievementId)
    .eq("user_id", user.id)
    .single();

  if (existingRecordError || !existingRecord) {
    redirect(`/vault/${achievementId}/edit?error=record-not-found`);
  }

  const updatedRecord = {
    title: input.title,
    category: input.category,
    issuer: input.issuer || null,
    achievement_date: input.achievementDate || null,
    description: input.description || null,
    impact_summary: input.impactSummary || null,
    visibility: input.visibility,
    updated_at: new Date().toISOString(),
  };

  const { error: updateError } = await supabase
    .from("achievements")
    .update(updatedRecord)
    .eq("id", achievementId)
    .eq("user_id", user.id);

  if (updateError) {
    redirect(
      `/vault/${achievementId}/edit?error=${encodeURIComponent(
        updateError.message
      )}`
    );
  }

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    achievement_id: achievementId,
    action: "achievement.updated",
    entity_type: "achievement",
    entity_id: achievementId,
    metadata: {
      previous: {
        title: existingRecord.title,
        category: existingRecord.category,
        issuer: existingRecord.issuer,
        achievement_date: existingRecord.achievement_date,
        description: existingRecord.description,
        impact_summary: existingRecord.impact_summary,
        visibility: existingRecord.visibility,
      },
      updated: {
        title: input.title,
        category: input.category,
        issuer: input.issuer || null,
        achievement_date: input.achievementDate || null,
        description: input.description || null,
        impact_summary: input.impactSummary || null,
        visibility: input.visibility,
      },
    },
  });

  revalidatePath(`/vault/${achievementId}`);
  revalidatePath(`/vault/${achievementId}/edit`);
  revalidatePath("/vault");
  revalidatePath("/dashboard");

  redirect(`/vault/${achievementId}`);
}

export async function deleteEvidenceItem(
  achievementId: string,
  evidenceItemId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: evidenceItem, error: evidenceLookupError } = await supabase
    .from("evidence_items")
    .select(
      "id, achievement_id, user_id, title, evidence_type, source_url, is_public"
    )
    .eq("id", evidenceItemId)
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .single();

  if (evidenceLookupError || !evidenceItem) {
    redirect(`/vault/${achievementId}?error=evidence-not-found`);
  }

  const { error: deleteError } = await supabase
    .from("evidence_items")
    .delete()
    .eq("id", evidenceItemId)
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id);

  if (deleteError) {
    redirect(
      `/vault/${achievementId}?error=${encodeURIComponent(
        deleteError.message
      )}`
    );
  }

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    achievement_id: achievementId,
    action: "evidence.deleted",
    entity_type: "evidence_item",
    entity_id: evidenceItemId,
    metadata: {
      title: evidenceItem.title,
      evidence_type: evidenceItem.evidence_type,
      source_url: evidenceItem.source_url,
      was_public: evidenceItem.is_public,
    },
  });

  const { data: remainingEvidence } = await supabase
    .from("evidence_items")
    .select("id, source_url")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id);

  const remainingItems = remainingEvidence || [];

  if (remainingItems.length === 0) {
    await supabase
      .from("achievements")
      .update({
        verification_status: "claimed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", achievementId)
      .eq("user_id", user.id);
  } else {
    const hasSourceLinkedEvidence = remainingItems.some((item) =>
      Boolean(item.source_url)
    );

    await supabase
      .from("achievements")
      .update({
        verification_status: hasSourceLinkedEvidence
          ? "source_linked"
          : "evidence_attached",
        updated_at: new Date().toISOString(),
      })
      .eq("id", achievementId)
      .eq("user_id", user.id);
  }

  revalidatePath(`/vault/${achievementId}`);
  revalidatePath("/vault");
  revalidatePath("/dashboard");

  redirect(`/vault/${achievementId}`);
}

export async function deleteAchievement(achievementId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: achievement, error: achievementError } = await supabase
    .from("achievements")
    .select("id, user_id, title, category, visibility, verification_status")
    .eq("id", achievementId)
    .eq("user_id", user.id)
    .single();

  if (achievementError || !achievement) {
    redirect(`/vault/${achievementId}/delete?error=record-not-found`);
  }

  const { count: evidenceCount } = await supabase
    .from("evidence_items")
    .select("*", { count: "exact", head: true })
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id);

  const { data: proofLink } = await supabase
    .from("public_proof_links")
    .select("id, proof_code, public_slug")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    achievement_id: achievementId,
    action: "achievement.deleted",
    entity_type: "achievement",
    entity_id: achievementId,
    metadata: {
      title: achievement.title,
      category: achievement.category,
      visibility: achievement.visibility,
      verification_status: achievement.verification_status,
      evidence_count: evidenceCount || 0,
      proof_link: proofLink
        ? {
            id: proofLink.id,
            proof_code: proofLink.proof_code,
            public_slug: proofLink.public_slug,
          }
        : null,
    },
  });

  const { error: deleteError } = await supabase
    .from("achievements")
    .delete()
    .eq("id", achievementId)
    .eq("user_id", user.id);

  if (deleteError) {
    redirect(
      `/vault/${achievementId}/delete?error=${encodeURIComponent(
        deleteError.message
      )}`
    );
  }

  revalidatePath("/vault");
  revalidatePath("/dashboard");

  redirect("/vault");
}
export async function deactivatePublicProofLink(achievementId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: proofLink, error: proofLinkError } = await supabase
    .from("public_proof_links")
    .select("id, achievement_id, user_id, proof_code, public_slug, qr_target_url")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (proofLinkError || !proofLink) {
    redirect(`/vault/${achievementId}?error=active-proof-link-not-found`);
  }

  const { error: updateError } = await supabase
    .from("public_proof_links")
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
    })
    .eq("id", proofLink.id)
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id);

  if (updateError) {
    redirect(
      `/vault/${achievementId}?error=${encodeURIComponent(
        updateError.message
      )}`
    );
  }

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    achievement_id: achievementId,
    action: "proof_link.deactivated",
    entity_type: "public_proof_link",
    entity_id: proofLink.id,
    metadata: {
      proof_code: proofLink.proof_code,
      public_slug: proofLink.public_slug,
      qr_target_url: proofLink.qr_target_url,
    },
  });

  revalidatePath(`/vault/${achievementId}`);
  revalidatePath("/vault");
  revalidatePath("/dashboard");
  revalidatePath(`/proof/${proofLink.public_slug}`);

  redirect(`/vault/${achievementId}`);
}