import { z } from "zod";

export const evidenceTypeSchema = z.enum([
  "certificate",
  "document",
  "image",
  "project_link",
  "publication_link",
  "social_post",
  "letter",
  "other",
]);

export const createEvidenceSchema = z.object({
  achievementId: z.string().uuid("Invalid achievement ID."),

  evidenceType: evidenceTypeSchema,

  title: z
    .string()
    .min(3, "Evidence title must be at least 3 characters.")
    .max(120, "Evidence title must be under 120 characters."),

  description: z
    .string()
    .max(600, "Description must be under 600 characters.")
    .optional()
    .or(z.literal("")),

  sourceUrl: z
    .string()
    .url("Source must be a valid URL.")
    .optional()
    .or(z.literal("")),

  isPublic: z.boolean().default(false),
});

export type CreateEvidenceInput = z.infer<typeof createEvidenceSchema>;