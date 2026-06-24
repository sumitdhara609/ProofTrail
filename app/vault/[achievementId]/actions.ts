"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createEvidenceSchema } from "@/lib/validation/evidence";

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
      error:
        parsed.error.issues[0]?.message || "Invalid evidence information.",
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