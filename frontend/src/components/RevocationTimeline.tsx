"use client";

import { useState } from "react";
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Building2,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export default function RevocationTimeline() {
  const [currentStatus, setCurrentStatus] = useState<"ACTIVE" | "REVOKED" | "REINSTATED">("ACTIVE");

  return (
    <section className="py-20 bg-[#F7F8FC] border-y border-[#E8E6FF] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#DCD9FF] text-[11px] font-bold text-[#5B5BEF] uppercase tracking-wider shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>Dynamic Lifecycle Control</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#10142F] tracking-tight">
            Real-Time Revocation &amp; Reinstatement
          </h2>

          <p className="text-xs sm:text-sm text-[#69708A]">
            Unlike immutable blockchains or printed paper certificates, accredited institutions can retract, suspend, or reinstate credentials when academic records require official lifecycle updates.
          </p>
        </div>

        {/* Status Demonstration Container */}
        <div className="glass-card p-8 sm:p-10 shadow-lg border-[#DCD9FF]">
          
          {/* Header & Status Switcher Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F0EEFF] gap-4">
            <div>
              <span className="text-[10px] font-mono text-[#69708A] uppercase font-bold block">
                CREDENTIAL STATUS REGISTRY
              </span>
              <h3 className="text-lg font-bold text-[#10142F]">
                Diploma in AI &amp; Machine Learning • ABC Polytechnic
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStatus("ACTIVE")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentStatus === "ACTIVE"
                    ? "bg-[#10B981] text-white shadow-sm"
                    : "bg-[#F7F6FF] text-[#69708A] hover:text-[#10142F]"
                }`}
              >
                1. Active
              </button>

              <button
                onClick={() => setCurrentStatus("REVOKED")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentStatus === "REVOKED"
                    ? "bg-[#EF4444] text-white shadow-sm"
                    : "bg-[#F7F6FF] text-[#69708A] hover:text-[#10142F]"
                }`}
              >
                2. Revoked
              </button>

              <button
                onClick={() => setCurrentStatus("REINSTATED")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  currentStatus === "REINSTATED"
                    ? "bg-[#5B5BEF] text-white shadow-sm"
                    : "bg-[#F7F6FF] text-[#69708A] hover:text-[#10142F]"
                }`}
              >
                3. Reinstated
              </button>
            </div>
          </div>

          {/* Current Status Showcase Card */}
          <div className={`my-8 p-6 rounded-2xl border transition-all duration-300 ${
            currentStatus === "ACTIVE"
              ? "bg-[#ECFDF5] border-[#A7F3D0]"
              : currentStatus === "REVOKED"
              ? "bg-[#FEF2F2] border-[#FECACA]"
              : "bg-[#F0EEFF] border-[#DCD9FF]"
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {currentStatus === "ACTIVE" && (
                  <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] text-[#10B981] flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
                {currentStatus === "REVOKED" && (
                  <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}
                {currentStatus === "REINSTATED" && (
                  <div className="w-12 h-12 rounded-2xl bg-[#E8E6FF] text-[#5B5BEF] flex items-center justify-center">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-[#10142F]">
                      Status: {currentStatus === "REINSTATED" ? "ACTIVE (REINSTATED)" : currentStatus}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      currentStatus === "ACTIVE"
                        ? "bg-[#10B981] text-white"
                        : currentStatus === "REVOKED"
                        ? "bg-[#EF4444] text-white"
                        : "bg-[#5B5BEF] text-white"
                    }`}>
                      {currentStatus === "ACTIVE" ? "VERIFIED ✓" : currentStatus === "REVOKED" ? "INACTIVE" : "RESTORED ✓"}
                    </span>
                  </div>

                  <p className="text-xs text-[#69708A] mt-1">
                    {currentStatus === "ACTIVE" && "Credential is valid, cryptographically intact, and recognized across verifiers."}
                    {currentStatus === "REVOKED" && "Reason: Academic record superseded / administrative audit by ABC Polytechnic Institute."}
                    {currentStatus === "REINSTATED" && "Credential has been officially restored to active standing by authorized institution admin."}
                  </p>
                </div>
              </div>

              <span className="font-mono text-xs font-bold text-[#69708A] hidden sm:block">
                Query latency: 18ms
              </span>
            </div>
          </div>

          {/* Timeline Milestones Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#F7F8FC] border border-[#E8E6FF]">
              <span className="text-[10px] text-[#69708A] block">24 SEP 2026</span>
              <span className="font-bold text-[#10142F] block mt-0.5">Credential Issued</span>
              <span className="text-[11px] text-[#10B981]">By ABC Polytechnic</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8FC] border border-[#E8E6FF]">
              <span className="text-[10px] text-[#69708A] block">28 SEP 2026</span>
              <span className="font-bold text-[#10142F] block mt-0.5">Revocation Triggered</span>
              <span className="text-[11px] text-[#EF4444]">Instant Status Update</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8FC] border border-[#E8E6FF]">
              <span className="text-[10px] text-[#69708A] block">02 OCT 2026</span>
              <span className="font-bold text-[#10142F] block mt-0.5">Audit &amp; Reinstated</span>
              <span className="text-[11px] text-[#5B5BEF]">Fully Restored</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
