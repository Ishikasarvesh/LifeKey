import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LIFEKEY — Citizen-Controlled Verifiable Identity & Transition Layer",
  description: "One trusted identity. Every life-stage transition. W3C Verifiable Credentials interoperability layer connecting Education → Employment → Finance → Healthcare.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#06050f] text-[#e2e0f0] selection:bg-violet-700 selection:text-white">
        {children}
      </body>
    </html>
  );
}
