export type AchievementVisibility = "private" | "public" | "unlisted";

export type VerificationStatus =
  | "claimed"
  | "evidence_attached"
  | "source_linked"
  | "reviewed"
  | "flagged";

export type EvidenceType =
  | "certificate"
  | "document"
  | "image"
  | "project_link"
  | "publication_link"
  | "social_post"
  | "letter"
  | "other";

export type AchievementRecord = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  issuer: string | null;
  achievement_date: string | null;
  description: string | null;
  impact_summary: string | null;
  visibility: AchievementVisibility;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
};

export type EvidenceItem = {
  id: string;
  achievement_id: string;
  user_id: string;
  evidence_type: EvidenceType;
  title: string;
  description: string | null;
  source_url: string | null;
  file_path: string | null;
  file_name: string | null;
  file_mime_type: string | null;
  file_size_bytes: number | null;
  storage_bucket: string | null;
  is_public: boolean;
  created_at: string;
};

export type PublicProofLink = {
  id: string;
  achievement_id: string;
  user_id: string;
  proof_code: string;
  public_slug: string;
  qr_target_url: string;
  is_active: boolean;
  created_at: string;
  revoked_at: string | null;
};

export type AuditLog = {
  id: string;
  user_id: string | null;
  achievement_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};