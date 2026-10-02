"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Brain,
  AlertTriangle,
  Scale,
  Sparkles,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  Info,
  ShieldAlert,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function CredentialIntelligenceSection({
  onOpenCompareModal,
}: {
  onOpenCompareModal?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"sideBySide" | "signals">("sideBySide");

  return (
    <section id="intelligence" className="py-24 bg-[#10142F] text-white relative overflow-hidden">
      {/* Ambient glowing lavender and violet background backdrops */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#5B5BEF]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#7167F6]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-mesh-grid opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.15] text-xs font-bold text-[#DCD9FF] uppercase tracking-wider backdrop-blur-md">
            <Brain className="w-4 h-4 text-[#7167F6]" />
            <span>Cross-Record Credential Intelligence</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Beyond basic verification.
          </h2>

          <p className="text-base sm:text-lg text-[#DCD9FF]/80 font-normal leading-relaxed">
            LifeKey doesn&apos;t just check cryptographic validity — it analyzes relationships between records, flags potential issues and helps reviewers understand what needs attention.
          </p>
        </div>

        {/* Intelligence Architecture: Side-by-Side Comparison Container */}
        <div className="glass-panel-navy p-6 sm:p-10 lg:p-12 border border-white/[0.15] shadow-2xl relative">
          
          {/* Top Interface Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-white/[0.1] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#5B5BEF]/25 border border-[#5B5BEF]/40 flex items-center justify-center text-[#DCD9FF]">
                <Scale className="w-5 h-5 text-[#DCD9FF]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Record Conflict &amp; Similarity Engine</h3>
                <p className="text-xs text-[#DCD9FF]/70">Deterministic token matching + fuzzy similarity comparison</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7]/15 border border-[#F59E0B]/40 text-[#FBBF24] text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>REVIEW SIGNAL DETECTED</span>
            </div>
          </div>

          {/* Comparison Cards Row (Record A vs Record B) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-10 items-stretch">
            
            {/* RECORD A (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl bg-[#171B40]/80 border border-white/[0.12] p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/[0.08] text-[#DCD9FF]">
                    RECORD A (Registered)
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">Active in Wallet</span>
                </div>

                <h4 className="text-xl font-bold text-white">
                  B.Tech – IT
                </h4>
                <p className="text-xs font-medium text-[#DCD9FF]/80 mt-1">
                  D. J. Sanghvi College of Engineering
                </p>

                {/* Field breakdown */}
                <div className="mt-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                    <span className="text-[#69708A] text-[11px]">Holder:</span>
                    <span className="text-white font-medium">Parth Patil</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                    <span className="text-[#69708A] text-[11px]">Degree:</span>
                    <span className="text-white font-medium">Bachelor of Technology</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-emerald-500/20">
                    <span className="text-[#69708A] text-[11px]">Graduation:</span>
                    <span className="text-emerald-300 font-bold">2026</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                    <span className="text-[#69708A] text-[11px]">Registration ID:</span>
                    <span className="text-white font-medium">DJS-2022-IT-084</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#69708A]">
                <span>Issuer: Accredited Institutional Key</span>
                <span className="text-emerald-400 font-bold">✓ Signed</span>
              </div>
            </div>

            {/* Central Analysis Divider (2 cols) */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
              <div className="w-12 h-12 rounded-full bg-[#5B5BEF] text-white flex items-center justify-center shadow-lg shadow-[#5B5BEF]/40 animate-pulse">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-[#DCD9FF] font-semibold mt-3 text-center">
                92% Similarity
              </span>
              <span className="text-[9.5px] font-mono text-[#F59E0B] text-center mt-1">
                Field Mismatch: Graduation Year
              </span>
            </div>

            {/* RECORD B (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl bg-[#171B40]/80 border border-amber-500/30 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#F59E0B]/20 text-[#FBBF24]">
                    RECORD B (Candidate Upload)
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-semibold">Flagged for Review</span>
                </div>

                <h4 className="text-xl font-bold text-white">
                  B.Tech – IT
                </h4>
                <p className="text-xs font-medium text-[#DCD9FF]/80 mt-1">
                  D. J. Sanghvi College of Engineering
                </p>

                {/* Field breakdown with highlighted conflict */}
                <div className="mt-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                    <span className="text-[#69708A] text-[11px]">Holder:</span>
                    <span className="text-white font-medium">Parth Patil</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                    <span className="text-[#69708A] text-[11px]">Degree:</span>
                    <span className="text-white font-medium">Bachelor of Technology</span>
                  </div>
                  {/* Highlighted Conflict Field */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/50">
                    <span className="text-amber-300 font-bold text-[11px]">Graduation:</span>
                    <span className="text-[#FBBF24] font-bold">2025 (Conflict)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                    <span className="text-[#69708A] text-[11px]">Registration ID:</span>
                    <span className="text-white font-medium">DJS-2022-IT-084</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#69708A]">
                <span>Status: Unresolved Review Signal</span>
                <span className="text-amber-400 font-bold">Review Needed</span>
              </div>
            </div>

          </div>

          {/* Review Signals Banner (Strictly Human Review Approach) */}
          <div className="p-6 rounded-2xl bg-[#111633] border border-[#5B5BEF]/30 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DCD9FF] tracking-wider uppercase font-mono">
              <Info className="w-4 h-4 text-[#7167F6]" />
              <span>Review Signals Identified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#5B5BEF]" />
                  <span>Similar record detected</span>
                </div>
                <p className="text-xs text-[#DCD9FF]/70 mt-1 leading-relaxed">
                  Possible duplicate-style record with 92% token overlap across academic attributes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Graduation year conflict</span>
                </div>
                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                  Year mismatch across records: 2026 registered vs 2025 reported in candidate record.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <div className="text-xs font-bold text-[#DCD9FF] flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#7167F6]" />
                  <span>Human review required</span>
                </div>
                <p className="text-xs text-[#DCD9FF]/70 mt-1 leading-relaxed">
                  Institutional review recommended. LifeKey flags review signals — it does not automatically declare fraud.
                </p>
              </div>
            </div>

            {/* Note & Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-[#DCD9FF]/70 gap-4">
              <span>
                <strong>Documented Principle:</strong> The system identifies review signals; it does not automatically declare a credential fraudulent.
              </span>

              {onOpenCompareModal && (
                <button
                  onClick={onOpenCompareModal}
                  className="px-5 py-2.5 rounded-xl bg-[#5B5BEF] hover:bg-[#6964F2] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#5B5BEF]/30"
                >
                  <span>Launch Side-by-Side Review Modal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
