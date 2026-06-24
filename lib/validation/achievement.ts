import { z } from "zod";

export const achievementCategorySchema = z.enum([
  "certificate",
  "competition",
  "project",
  "publication",
  "leadership",
  "volunteering",
  "award",
  "course",
  "other",
]);

export const achievementVisibilitySchema = z.enum([
  "private",
  "public",
  "unlisted",
]);

export const createAchievementSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title must be under 120 characters."),

  category: achievementCategorySchema,

  issuer: z
    .string()
    .max(120, "Issuer must be under 120 characters.")
    .optional()
    .or(z.literal("")),

  achievementDate: z.string().optional().or(z.literal("")),

  description: z
    .string()
    .max(1200, "Description must be under 1200 characters.")
    .optional()
    .or(z.literal("")),

  impactSummary: z
    .string()
    .max(600, "Impact summary must be under 600 characters.")
    .optional()
    .or(z.literal("")),

  visibility: achievementVisibilitySchema.default("private"),
});

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;