const MAX_MEDIA_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MEDIA_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

export type MediaEvidenceValidationResult =
  | {
      valid: true;
      file: File;
    }
  | {
      valid: false;
      error: string;
    };

export function validateMediaEvidenceFile(
  file: File | null
): MediaEvidenceValidationResult {
  if (!file || file.size === 0) {
    return {
      valid: false,
      error: "No media file was selected.",
    };
  }

  if (file.size > MAX_MEDIA_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Media evidence must be 5 MB or smaller.",
    };
  }

  if (!ALLOWED_MEDIA_MIME_TYPES.has(file.type)) {
    return {
      valid: false,
      error: "Media evidence must be a PNG, JPG, WEBP, GIF, or PDF file.",
    };
  }

  return {
    valid: true,
    file,
  };
}

export function hasMediaEvidenceFile(file: FormDataEntryValue | null) {
  return file instanceof File && file.size > 0;
}

export function getSafeEvidenceFileName(file: File) {
  const extension = getFileExtension(file.name);
  const baseName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);

  const safeBaseName = baseName || "evidence-file";
  const uniquePart = crypto.randomUUID();

  return `${uniquePart}-${safeBaseName}${extension}`;
}

function getFileExtension(fileName: string) {
  const extension = fileName.match(/\.[a-zA-Z0-9]+$/)?.[0]?.toLowerCase();

  if (!extension) {
    return "";
  }

  return extension;
}