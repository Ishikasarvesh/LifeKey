import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LifeKey — Unified Life-Stage Digital Identity & Record Network",
  description: "User-controlled digital credential and record network designed around life-stage transitions. Issue, Own, Share, and Verify degrees, certificates, and employment records with cryptographic integrity and cross-record intelligence.",
  keywords: [
    "LifeKey",
    "Digital Identity",
    "Verifiable Credentials",
    "Credential Intelligence",
    "Life-Stage Network",
    "Selective Disclosure",
    "QR Verification",
    "RSA-PSS",
    "SHA-256",
  ],
  icons: {
    icon: "/assets/brand/lifekey-mark.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#11152E] selection:bg-[#5B5BEF] selection:text-white">
        {children}
      </body>
    </html>
  );
}
