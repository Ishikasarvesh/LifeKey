"use client";

import { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Hash,
  RotateCcw,
  Sparkles,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function TamperDemo() {
  const [year, setYear] = useState<string>("2026");
  const isTampered = year !== "2026";

  const originalHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const tamperedHash = "a14f923b72c918a240899fcde11598f8a846171891b92019842bf92801481b92";

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0EEFF] border border-[#DCD9FF] text-[11px] font-bold text-[#5B5BEF] uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Interactive Defense Demo</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#10142F] tracking-tight">
            Tamper Detection in Real Time
          </h2>

          <p className="text-xs sm:text-sm text-[#69708A]">
            Experience why local client-side modifications (like editing a PDF or inspected HTML) fail against canonical hashing and digital signatures.
          </p>
        </div>

        {/* Interactive Tamper Simulator Container */}
        <div className={`p-8 sm:p-10 rounded-[32px] border transition-all duration-300 ${
          isTampered
            ? "bg-[#FEF2F2] border-[#FECACA] shadow-[0_20px_45px_-12px_rgba(239,68,68,0.18)]"
            : "bg-[#F7F8FC] border-[#DCD9FF] shadow-sm"
        }`}>
          
          {/* Top Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/[0.06] gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#69708A] block">
                CREDENTIAL TEST PAYLOAD
              </span>
              <h3 className="text-lg font-bold text-[#10142F]">
                Bachelor of Technology in Information Technology
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {isTampered ? (
                <span className="px-3.5 py-1.5 rounded-full bg-[#EF4444] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-500/25">
                  <XCircle className="w-4 h-4" />
                  <span>HASH DIVERGED • VERIFICATION FAILED</span>
                </span>
              ) : (
                <span className="px-3.5 py-1.5 rounded-full bg-[#10B981] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/25">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PAYLOAD INTACT • VERIFIED</span>
                </span>
              )}

              {isTampered && (
                <button
                  onClick={() => setYear("2026")}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#DCD9FF] text-xs font-bold text-[#10142F] hover:bg-[#F7F6FF] flex items-center gap-1 transition-all"
                  title="Reset to 2026"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Payload Attributes with Modifiable Year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-[#DCD9FF]">
              <span className="text-[#69708A] font-semibold text-[10px] uppercase block">HOLDER</span>
              <span className="font-bold text-[#10142F] text-sm mt-0.5 block">Parth Patil</span>
              <span className="text-[10px] text-[#9499B0]">Reg: DJS-2022-IT-084</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#DCD9FF]">
              <span className="text-[#69708A] font-semibold text-[10px] uppercase block">ISSUER</span>
              <span className="font-bold text-[#10142F] text-sm mt-0.5 block">D. J. Sanghvi College</span>
              <span className="text-[10px] text-[#9499B0]">RSA-2048 Public Key</span>
            </div>

            {/* Editable Field (Graduation Year) */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isTampered
                ? "bg-[#FEE2E2] border-[#EF4444]"
                : "bg-white border-[#5B5BEF]"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[#69708A] font-semibold text-[10px] uppercase">
                  GRADUATION YEAR
                </span>
                <span className="text-[10px] font-bold text-[#5B5BEF]">Click to toggle</span>
              </div>

              <div className="flex items-center gap-2 mt-1.5">
                <button
                  onClick={() => setYear("2026")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    year === "2026"
                      ? "bg-[#5B5BEF] text-white"
                      : "bg-[#F7F6FF] text-[#69708A]"
                  }`}
                >
                  2026 (Original)
                </button>

                <button
                  onClick={() => setYear("2025")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    year === "2025"
                      ? "bg-[#EF4444] text-white"
                      : "bg-[#F7F6FF] text-[#69708A]"
                  }`}
                >
                  2025 (Tampered)
                </button>
              </div>
            </div>
          </div>

          {/* Cryptographic Hash Comparison Row */}
          <div className="p-5 rounded-2xl bg-white border border-[#DCD9FF] space-y-3 font-mono text-xs">
            <div>
              <div className="flex items-center justify-between text-[#69708A] text-[10px] font-bold uppercase mb-1">
                <span>Issuer-Signed SHA-256 Digest (Canonical)</span>
                <span className="text-[#10B981]">EXPECTED</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F6FF] text-[#10142F] truncate">
                {originalHash}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[#69708A] text-[10px] font-bold uppercase mb-1">
                <span>Re-computed Payload Hash (At Verification Time)</span>
                <span className={isTampered ? "text-[#EF4444] font-bold" : "text-[#10B981]"}>
                  {isTampered ? "MISMATCH" : "MATCHED ✓"}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl truncate transition-all ${
                isTampered
                  ? "bg-[#FEE2E2] text-[#DC2626] font-bold border border-[#FECACA]"
                  : "bg-[#F7F6FF] text-[#10142F]"
              }`}>
                {isTampered ? tamperedHash : originalHash}
              </div>
            </div>
          </div>

          {/* Explanatory Takeaway Footer */}
          <div className="mt-5 text-xs text-[#69708A] leading-relaxed">
            <strong className="text-[#10142F]">Core Takeaway:</strong> Changing protected credential data causes integrity verification to fail. Because the RSA digital signature was calculated over the original canonical digest, any modification immediately invalidates the cryptographic proof.
          </div>

        </div>

      </div>
    </section>
  );
}
