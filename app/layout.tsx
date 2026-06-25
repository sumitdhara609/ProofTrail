import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeScript } from "@/components/theme/ThemeScript";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ProofTrail — Personal Achievement Verification Vault",
    template: "%s | ProofTrail",
  },
  description:
    "ProofTrail is a private evidence vault for preserving achievements with context, evidence, audit history, and controlled public proof identities.",
  applicationName: "ProofTrail",
  creator: "Sumit Dhara",
  authors: [{ name: "Sumit Dhara" }],
  keywords: [
    "ProofTrail",
    "achievement verification",
    "evidence vault",
    "proof archive",
    "digital proof identity",
    "QR proof",
    "personal records",
  ],
  openGraph: {
    title: "ProofTrail — Personal Achievement Verification Vault",
    description:
      "Preserve achievements with evidence, context, audit history, and controlled public proof identities.",
    siteName: "ProofTrail",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProofTrail — Personal Achievement Verification Vault",
    description:
      "A private evidence vault for structured achievement records and controlled public proof access.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}