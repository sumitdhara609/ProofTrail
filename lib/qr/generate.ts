import * as QRCode from "qrcode";

export async function generateQrDataUrl(value: string) {
  if (!value.trim()) {
    throw new Error("QR value cannot be empty.");
  }

  return QRCode.toDataURL(value, {
    margin: 2,
    width: 320,
    errorCorrectionLevel: "M",
  });
}