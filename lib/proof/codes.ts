import crypto from "crypto";

export function generateProofCode() {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `PT-${year}-${randomPart}`;
}

export function createPublicSlug(proofCode: string) {
  return proofCode.toLowerCase();
}