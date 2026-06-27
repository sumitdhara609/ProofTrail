"use server";

import type { ZodError } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createEvidenceSchema } from "@/lib/validation/evidence";
import { createAchievementSchema } from "@/lib/validation/achievement";
import { createPublicSlug, generateProofCode } from "@/lib/proof/codes";
import {
  getSafeEvidenceFileName,
  hasMediaEvidenceFile,
  validateMediaEvidenceFile,
} from "@/lib/validation/media-evidence";

type AddEvidenceState = {
  error?: string;
};

function getFirstValidationMessage(
  error: ZodError,
  fallback = "Invalid form data."
) {
  return error.issues[0]?.message || fallback;
}

function redirectToRecord(achievementId: string): never {
  redirect(`/vault/${achievementId}`);
}

function redirectToRecordError(achievementId: string, message: string): never {
  redirect(`/vault/${achievementId}?error=${encodeURIComponent(message)}`);
}

function redirectToEditError(achievementId: string, message: string): never {
  redirect(
    `/vault/${achievementId}/edit?error=${encodeURIComponent(message)}`
  );
}

function redirectToDeleteError(achievementId: string, message: string): never {
  redirect(
    `/vault/${achievementId}/delete?error=${encodeURIComponent(message)}`
  );
}

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

  const mediaFileEntry = formData.get("mediaFile");
  const hasMediaFile = hasMediaEvidenceFile(mediaFileEntry);

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
      error: getFirstValidationMessage(
        parsed.error,
        "Invalid evidence information."
      ),
    };
  }

  const input = parsed.data;

  if (hasMediaFile && input.isPublic) {
    return {
      error:
        "Upload certificate or media evidence privately first. After reviewing the file preview and public proof card, you can edit the evidence and make it public deliberately.",
    };
  }

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

  let uploadedMedia:
    | {
        storageBucket: string;
        filePath: string;
        fileName: string;
        mimeType: string;
        fileSizeBytes: number;
      }
    | null = null;

  if (hasMediaFile) {
    const validation = validateMediaEvidenceFile(
      mediaFileEntry instanceof File ? mediaFileEntry : null
    );

    if (!validation.valid) {
      return {
        error: validation.error,
      };
    }

    const file = validation.file;
    const storageBucket = "proof-evidence";
    const safeFileName = getSafeEvidenceFileName(file);
    const filePath = `${user.id}/${achievementId}/${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return {
        error: uploadError.message || "Could not upload media evidence.",
      };
    }

    uploadedMedia = {
      storageBucket,
      filePath,
      fileName: file.name,
      mimeType: file.type,
      fileSizeBytes: file.size,
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
      file_path: uploadedMedia?.filePath || null,
      file_name: uploadedMedia?.fileName || null,
      file_mime_type: uploadedMedia?.mimeType || null,
      file_size_bytes: uploadedMedia?.fileSizeBytes || null,
      storage_bucket: uploadedMedia?.storageBucket || null,
      is_public: input.isPublic,
    })
    .select("id")
    .single();

  if (evidenceError || !evidence) {
    if (uploadedMedia) {
      await supabase.storage
        .from(uploadedMedia.storageBucket)
        .remove([uploadedMedia.filePath]);
    }

    return {
      error: evidenceError?.message || "Could not add evidence.",
    };
  }

  if (achievement.verification_status === "claimed") {
    await supabase
      .from("achievements")
      .update({
        verification_status:
          input.sourceUrl || uploadedMedia
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
      has_media_file: Boolean(uploadedMedia),
      media_file_name: uploadedMedia?.fileName || null,
      media_mime_type: uploadedMedia?.mimeType || null,
      media_file_size_bytes: uploadedMedia?.fileSizeBytes || null,
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
    redirectToRecordError(achievementId, "record-not-found");
  }

  const { data: existingProofLink } = await supabase
    .from("public_proof_links")
    .select("id")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (existingProofLink) {
    redirectToRecord(achievementId);
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
    redirectToRecordError(
      achievementId,
      proofError?.message || "Could not generate proof link."
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

  redirectToRecord(achievementId);
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
    redirectToEditError(
      achievementId,
      getFirstValidationMessage(parsed.error, "Invalid achievement data.")
    );
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
    redirectToEditError(achievementId, "record-not-found");
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
    redirectToEditError(achievementId, updateError.message);
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

  redirectToRecord(achievementId);
}

export async function updateEvidenceItem(
  achievementId: string,
  evidenceItemId: string,
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
    achievementId,
    evidenceType: String(formData.get("evidenceType") || "other"),
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    sourceUrl: String(formData.get("sourceUrl") || ""),
    isPublic: formData.get("isPublic") === "on",
  };

  const parsed = createEvidenceSchema.safeParse(rawInput);

  if (!parsed.success) {
    redirectToRecordError(
      achievementId,
      getFirstValidationMessage(
        parsed.error,
        "Invalid evidence information."
      )
    );
  }

  const input = parsed.data;

  const { data: existingEvidence, error: existingEvidenceError } =
    await supabase
      .from("evidence_items")
      .select(
        "id, achievement_id, user_id, evidence_type, title, description, source_url, file_path, file_name, file_mime_type, file_size_bytes, storage_bucket, is_public"
      )
      .eq("id", evidenceItemId)
      .eq("achievement_id", achievementId)
      .eq("user_id", user.id)
      .single();

  if (existingEvidenceError || !existingEvidence) {
    redirectToRecordError(achievementId, "evidence-not-found");
  }

  const publicMediaReviewed =
    formData.get("publicMediaReviewed") === "on";

  if (
    existingEvidence.file_path &&
    !existingEvidence.is_public &&
    input.isPublic &&
    !publicMediaReviewed
  ) {
    redirectToRecordError(achievementId, "media-public-review-required");
  }

  const { error: updateError } = await supabase
    .from("evidence_items")
    .update({
      evidence_type: input.evidenceType,
      title: input.title,
      description: input.description || null,
      source_url: input.sourceUrl || null,
      is_public: input.isPublic,
    })
    .eq("id", evidenceItemId)
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id);

  if (updateError) {
    redirectToRecordError(achievementId, updateError.message);
  }

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    achievement_id: achievementId,
    action: "evidence.updated",
    entity_type: "evidence_item",
    entity_id: evidenceItemId,
    metadata: {
      previous: {
        evidence_type: existingEvidence.evidence_type,
        title: existingEvidence.title,
        description: existingEvidence.description,
        source_url: existingEvidence.source_url,
        is_public: existingEvidence.is_public,
      },
      updated: {
        evidence_type: input.evidenceType,
        title: input.title,
        description: input.description || null,
        source_url: input.sourceUrl || null,
        is_public: input.isPublic,
      },
      has_media_file: Boolean(existingEvidence.file_path),
      media_file_name: existingEvidence.file_name,
      media_mime_type: existingEvidence.file_mime_type,
      media_file_size_bytes: existingEvidence.file_size_bytes,
      public_visibility_changed: existingEvidence.is_public !== input.isPublic,
      became_public: existingEvidence.is_public === false && input.isPublic,
      became_private: existingEvidence.is_public === true && !input.isPublic,
      public_media_review_confirmed:
        existingEvidence.file_path &&
        !existingEvidence.is_public &&
        input.isPublic
          ? publicMediaReviewed
          : false,
    },
  });

  const { data: remainingEvidence } = await supabase
    .from("evidence_items")
    .select("id, source_url, file_path")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id);

  const remainingItems = remainingEvidence || [];
  const hasStrongEvidence = remainingItems.some(
    (item) => Boolean(item.source_url) || Boolean(item.file_path)
  );

  await supabase
    .from("achievements")
    .update({
      verification_status: hasStrongEvidence
        ? "source_linked"
        : remainingItems.length > 0
          ? "evidence_attached"
          : "claimed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", achievementId)
    .eq("user_id", user.id);

  const { data: activeProofLink } = await supabase
    .from("public_proof_links")
    .select("public_slug")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  revalidatePath(`/vault/${achievementId}`);
  revalidatePath("/vault");
  revalidatePath("/dashboard");

  if (activeProofLink?.public_slug) {
    revalidatePath(`/proof/${activeProofLink.public_slug}`);
  }

  redirectToRecord(achievementId);
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
      "id, achievement_id, user_id, title, evidence_type, source_url, file_path, file_name, file_mime_type, file_size_bytes, storage_bucket, is_public"
    )
    .eq("id", evidenceItemId)
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .single();

  if (evidenceLookupError || !evidenceItem) {
    redirectToRecordError(achievementId, "evidence-not-found");
  }

  const { data: activeProofLink } = await supabase
    .from("public_proof_links")
    .select("public_slug")
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  const { error: deleteError } = await supabase
    .from("evidence_items")
    .delete()
    .eq("id", evidenceItemId)
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id);

  if (deleteError) {
    redirectToRecordError(achievementId, deleteError.message);
  }

  if (evidenceItem.file_path && evidenceItem.storage_bucket) {
    await supabase.storage
      .from(evidenceItem.storage_bucket)
      .remove([evidenceItem.file_path]);
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
      file_path: evidenceItem.file_path,
      file_name: evidenceItem.file_name,
      file_mime_type: evidenceItem.file_mime_type,
      file_size_bytes: evidenceItem.file_size_bytes,
      storage_bucket: evidenceItem.storage_bucket,
      had_media_file: Boolean(evidenceItem.file_path),
      was_public: evidenceItem.is_public,
    },
  });

  const { data: remainingEvidence } = await supabase
    .from("evidence_items")
    .select("id, source_url, file_path")
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
    const hasStrongEvidence = remainingItems.some(
      (item) => Boolean(item.source_url) || Boolean(item.file_path)
    );

    await supabase
      .from("achievements")
      .update({
        verification_status: hasStrongEvidence
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

  if (activeProofLink?.public_slug) {
    revalidatePath(`/proof/${activeProofLink.public_slug}`);
  }

  redirectToRecord(achievementId);
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
    redirectToDeleteError(achievementId, "record-not-found");
  }

  const { data: evidenceMedia } = await supabase
    .from("evidence_items")
    .select(
      "id, title, evidence_type, file_path, file_name, file_mime_type, file_size_bytes, storage_bucket, is_public"
    )
    .eq("achievement_id", achievementId)
    .eq("user_id", user.id)
    .not("file_path", "is", null);

  const mediaItems = evidenceMedia || [];

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
      media_file_count: mediaItems.length,
      deleted_media_files: mediaItems.map((item) => ({
        id: item.id,
        title: item.title,
        evidence_type: item.evidence_type,
        file_path: item.file_path,
        file_name: item.file_name,
        file_mime_type: item.file_mime_type,
        file_size_bytes: item.file_size_bytes,
        storage_bucket: item.storage_bucket,
        was_public: item.is_public,
      })),
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
    redirectToDeleteError(achievementId, deleteError.message);
  }

  const mediaByBucket = mediaItems.reduce<Record<string, string[]>>(
    (groups, item) => {
      if (!item.storage_bucket || !item.file_path) {
        return groups;
      }

      if (!groups[item.storage_bucket]) {
        groups[item.storage_bucket] = [];
      }

      groups[item.storage_bucket].push(item.file_path);
      return groups;
    },
    {}
  );

  await Promise.all(
    Object.entries(mediaByBucket).map(([bucket, filePaths]) =>
      supabase.storage.from(bucket).remove(filePaths)
    )
  );

  if (proofLink?.public_slug) {
    revalidatePath(`/proof/${proofLink.public_slug}`);
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
    redirectToRecordError(achievementId, "active-proof-link-not-found");
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
    redirectToRecordError(achievementId, updateError.message);
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

  redirectToRecord(achievementId);
}