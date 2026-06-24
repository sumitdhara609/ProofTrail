"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAchievementSchema } from "@/lib/validation/achievement";

export async function createAchievement(formData: FormData) {
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
    const message = parsed.error.issues[0]?.message || "Invalid achievement data.";
    redirect(`/vault/new?error=${encodeURIComponent(message)}`);
  }

  const input = parsed.data;

  const { data: achievement, error } = await supabase
    .from("achievements")
    .insert({
      user_id: user.id,
      title: input.title,
      category: input.category,
      issuer: input.issuer || null,
      achievement_date: input.achievementDate || null,
      description: input.description || null,
      impact_summary: input.impactSummary || null,
      visibility: input.visibility,
      verification_status: "claimed",
    })
    .select("id")
    .single();

  if (error || !achievement) {
    redirect(`/vault/new?error=${encodeURIComponent(error?.message || "Could not create achievement.")}`);
  }

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    achievement_id: achievement.id,
    action: "achievement.created",
    entity_type: "achievement",
    entity_id: achievement.id,
    metadata: {
      title: input.title,
      visibility: input.visibility,
      category: input.category,
    },
  });

  revalidatePath("/vault");
  revalidatePath("/dashboard");

  redirect(`/vault/${achievement.id}`);
}