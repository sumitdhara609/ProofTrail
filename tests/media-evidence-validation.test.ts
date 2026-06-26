import { describe, expect, it } from "vitest";
import {
  getSafeEvidenceFileName,
  hasMediaEvidenceFile,
  validateMediaEvidenceFile,
} from "@/lib/validation/media-evidence";

describe("media evidence validation", () => {
  it("rejects a missing media file", () => {
    const result = validateMediaEvidenceFile(null);

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.error).toBe("No media file was selected.");
    }
  });

  it("rejects an empty media file", () => {
    const file = new File([], "empty.png", {
      type: "image/png",
    });

    const result = validateMediaEvidenceFile(file);

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.error).toBe("No media file was selected.");
    }
  });

  it("accepts supported image files under the size limit", () => {
    const file = new File(["certificate-image"], "certificate.png", {
      type: "image/png",
    });

    const result = validateMediaEvidenceFile(file);

    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.file).toBe(file);
    }
  });

  it("accepts supported PDF files under the size limit", () => {
    const file = new File(["certificate-pdf"], "certificate.pdf", {
      type: "application/pdf",
    });

    const result = validateMediaEvidenceFile(file);

    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.file).toBe(file);
    }
  });

  it("rejects files larger than 5 MB", () => {
    const oversizedBytes = new Uint8Array(5 * 1024 * 1024 + 1);
    const file = new File([oversizedBytes], "large-certificate.png", {
      type: "image/png",
    });

    const result = validateMediaEvidenceFile(file);

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.error).toBe("Media evidence must be 5 MB or smaller.");
    }
  });

  it("rejects unsupported file types", () => {
    const file = new File(["unsafe-file"], "script.svg", {
      type: "image/svg+xml",
    });

    const result = validateMediaEvidenceFile(file);

    expect(result.valid).toBe(false);

    if (!result.valid) {
      expect(result.error).toBe(
        "Media evidence must be a PNG, JPG, WEBP, GIF, or PDF file."
      );
    }
  });

  it("detects whether a FormData media file is present", () => {
    const file = new File(["proof"], "proof.webp", {
      type: "image/webp",
    });

    const emptyFile = new File([], "empty.webp", {
      type: "image/webp",
    });

    expect(hasMediaEvidenceFile(file)).toBe(true);
    expect(hasMediaEvidenceFile(emptyFile)).toBe(false);
    expect(hasMediaEvidenceFile(null)).toBe(false);
    expect(hasMediaEvidenceFile("not-a-file")).toBe(false);
  });

  it("generates a safe evidence filename while preserving the extension", () => {
    const file = new File(["proof"], "My Certificate @ KIIT 2026.PNG", {
      type: "image/png",
    });

    const safeName = getSafeEvidenceFileName(file);

    expect(safeName).toMatch(/^[a-f0-9-]+-my-certificate-kiit-2026\.png$/);
    expect(safeName).not.toContain("@");
    expect(safeName).not.toContain(" ");
  });
});