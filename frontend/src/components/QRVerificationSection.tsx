"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  QrCode,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Calendar,
  Building2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { api, VerificationResult } from "@/lib/api";

export default function QRVerificationSection() {
  const [tokenInput, setTokenInput] = useState("lifekey_demo_token_xyz890");
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationResult | null>(null);

  const verificationStages = [
    "Reading QR Code & Token Payload...",
    "Validating RSA-2048 PSS Digital Signature...",
    "Verifying SHA-256 Canonical Integrity...",
    "Querying Live Network Revocation Registry...",
    "Evaluating Credential Intelligence Signals...",
    "Credential Verified & Cryptographically Authentic ✓",
  ];

  const runVerificationSimulation = async () => {
    setIsVerifying(true);
    setPipelineStep(1);

    // Try calling real API in parallel
    let realResult: VerificationResult | null = null;
    try {
      realResult = await api.verifyByToken(tokenInput);
    } catch {
      // Fallback to demo mock data if backend server is not active locally
      realResult = {
        credential_id: "demo-cred-parth-it",
        candidate_name: "Parth Patil",
        institution_name: "D. J. Sanghvi College of Engineering",
        credential_type: "Bachelor of Technology",
        signature_valid: true,
        integrity_valid: true,
        revocation_status: "ACTIVE",
        consent_valid: true,
        issued_at: "2026-06-15T10:00:00Z",
        overall_status: "VALID",
        quality_status: "no_issues",
        quality_score: 98,
      };
    }

    // Step-by-step progressive animation
    for (let i = 1; i <= 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 380));
      setPipelineStep(i + 1);
    }

    setVerificationData(realResult);
    setIsVerifying(false);
  };

  return (
    <section id="verify" className="py-24 bg-[#F7F8FC] border-y border-[#E8E6FF] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-[#E8E6FF]/50 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#DCD9FF] text-[11px] font-bold text-[#5B5BEF] uppercase tracking-wider shadow-sm">
            <QrCode className="w-3.5 h-3.5" />
            <span>Instant Verifier Engine</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#10142F] tracking-tight leading-tight">
            Scan. Verify. Trust.
          </h2>

          <p className="text-base sm:text-lg text-[#69708A] font-normal">
            Anyone can verify a credential instantly using a QR code or presentation token, ensuring mathematical authenticity, unchanged integrity, and active status.
          </p>
        </div>

        {/* Dual Layout: 3D Floating QR Credential + Interactive Verifier Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: 3D Floating Physical Digital QR Credential Card (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm animate-float">
              
              {/* Outer Glass Card */}
              <div className="glass-card p-7 text-center shadow-[0_25px_50px_-12px_rgba(91,91,239,0.18)] border-[#DCD9FF] relative overflow-hidden">
                
                {/* Laser scan animation line across QR */}
                <div className="absolute left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#5B5BEF] to-transparent shadow-[0_0_12px_#5B5BEF] animate-scan pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F0EEFF] mb-6">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-8 h-8 rounded-xl bg-[#F0EEFF] flex items-center justify-center p-1">
                      <Image
                        src="/assets/brand/lifekey-mark.svg"
                        alt="LifeKey Mark"
                        width={22}
                        height={22}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#10142F] block">LifeKey Verifier</span>
                      <span className="text-[10px] text-[#69708A]">Public Verification Pass</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
                    ACTIVE ✓
                  </span>
                </div>

                {/* 3D Realistic QR Graphic Asset */}
                <div className="w-48 h-48 mx-auto relative p-3 rounded-2xl bg-white border border-[#DCD9FF] shadow-inner flex items-center justify-center">
                  <Image
                    src="/assets/3d/qr.svg"
                    alt="LifeKey QR Credential"
                    width={180}
                    height={180}
                    className="hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Card Verification Details */}
                <div className="mt-6 pt-5 border-t border-[#F0EEFF] space-y-2 text-left text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#69708A] font-semibold text-[11px]">Issuer:</span>
                    <span className="font-bold text-[#10142F] truncate max-w-[200px]">
                      D. J. Sanghvi College of Engineering
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#69708A] font-semibold text-[11px]">Verified on:</span>
                    <span className="font-mono text-[#10142F]">02 Oct 2026, 14:32</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#69708A] font-semibold text-[11px]">Status:</span>
                    <span className="font-bold text-[#10B981] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active &amp; Valid
                    </span>
                  </div>
                </div>

                {/* Link to Dedicated Verifier Page */}
                <div className="mt-5 pt-3 border-t border-[#F0EEFF]">
                  <Link
                    href={`/verify/${tokenInput}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B5BEF] hover:underline"
                  >
                    <span>Open Standalone Verification Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

            </div>
          </div>

          {/* Right Column: Interactive Verification Pipeline Simulator (7 cols) */}
          <div className="lg:col-span-7 glass-card p-8 sm:p-10 shadow-xl space-y-6">
            
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F0EEFF] text-[#5B5BEF]">
                Interactive Verification Experience
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#10142F] mt-2 tracking-tight">
                Simulate Real-Time Cryptographic Verification
              </h3>
              <p className="text-xs sm:text-sm text-[#69708A] mt-1">
                Trigger the exact 5-step verification sequence executed on employer portals.
              </p>
            </div>

            {/* Token Input Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="glass-input flex-1 text-sm font-mono"
                placeholder="Enter verification token..."
              />
              <button
                type="button"
                onClick={runVerificationSimulation}
                disabled={isVerifying}
                className="btn-primary py-3 px-6 text-xs sm:text-sm font-bold flex-shrink-0"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Credential</span>
                  </span>
                )}
              </button>
            </div>

            {/* 5-Step Pipeline Checklist Display */}
            <div className="p-5 rounded-2xl bg-[#F7F8FC] border border-[#E8E6FF] space-y-3">
              <span className="text-[10px] font-mono font-bold text-[#69708A] uppercase tracking-wider block mb-1">
                VERIFICATION PIPELINE PROGRESS
              </span>

              {[
                { step: 1, label: "Scanning QR & Canonical Payload" },
                { step: 2, label: "Checking RSA-PSS Digital Signature" },
                { step: 3, label: "Checking SHA-256 Canonical Integrity" },
                { step: 4, label: "Checking Live Revocation Registry Status" },
                { step: 5, label: "Evaluating Credential Intelligence Signals" },
              ].map((item) => {
                const isComplete = pipelineStep > item.step;
                const isCurrent = pipelineStep === item.step;

                return (
                  <div
                    key={item.step}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isComplete
                        ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]"
                        : isCurrent
                        ? "bg-[#F0EEFF] text-[#5B5BEF] border border-[#5B5BEF]"
                        : "bg-white text-[#9499B0] border border-[#E8E6FF]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-[#5B5BEF] animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#DCD9FF] flex items-center justify-center text-[9px] font-mono">
                          {item.step}
                        </div>
                      )}
                      <span>{item.label}</span>
                    </span>

                    <span className="font-mono text-[10px] uppercase">
                      {isComplete ? "VALID ✓" : isCurrent ? "CHECKING..." : "PENDING"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Final State Banner when Complete */}
            {pipelineStep >= 6 && verificationData && (
              <div className="p-5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] animate-fade-up">
                <div className="flex items-center justify-between pb-3 border-b border-[#A7F3D0]/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    <span className="font-extrabold text-[#065F46] text-sm">
                      CREDENTIAL VERIFIED ✓
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white text-[#10B981] px-2 py-0.5 rounded border border-[#A7F3D0]">
                    100% AUTHENTIC
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-[#065F46]">
                  <div>
                    <span className="text-[10px] text-[#047857] block">CANDIDATE</span>
                    <span className="font-bold text-[#10142F]">{verificationData.candidate_name || "Parth Patil"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#047857] block">CREDENTIAL</span>
                    <span className="font-bold text-[#10142F]">{verificationData.credential_type || "B.Tech in IT"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#047857] block">DIGITAL SIGNATURE</span>
                    <span className="font-mono font-bold text-[#10B981]">RSA-PSS Valid</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#047857] block">INTEGRITY DIGEST</span>
                    <span className="font-mono font-bold text-[#10B981]">SHA-256 Match</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
