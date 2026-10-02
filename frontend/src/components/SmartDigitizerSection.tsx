"use client";

import { useState } from "react";
import {
  Camera,
  ScanLine,
  FileText,
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function SmartDigitizerSection() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      title: "Capture Physical Certificate",
      desc: "High-resolution camera framing with automatic edge detection and glare compensation.",
    },
    {
      num: 2,
      title: "Standardize Document",
      desc: "Perspective de-skewing, contrast normalization, and W3C digital schema mapping.",
    },
    {
      num: 3,
      title: "Extract Credential Fields",
      desc: "OCR parsing with institutional entity resolution for holder names, GPA, and dates.",
    },
    {
      num: 4,
      title: "Create Digital Credential",
      desc: "Generates canonical hash draft ready for institutional attestation and signing.",
    },
  ];

  return (
    <section className="py-24 bg-[#F7F8FC] border-y border-[#E8E6FF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#DCD9FF] text-[11px] font-bold text-[#5B5BEF] uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>In Development • Coming Next</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#10142F] tracking-tight leading-tight">
            Smart Camera &amp; Document Digitizer
          </h2>

          <p className="text-base sm:text-lg text-[#69708A] font-normal">
            Bridging legacy paper transcripts to sovereign digital credentials through automated document scanning, field extraction, and institutional validation drafts.
          </p>
        </div>

        {/* 4-Step Pipeline Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`cursor-pointer rounded-[28px] p-7 transition-all duration-300 flex flex-col justify-between ${
                activeStep === st.num
                  ? "bg-white border-[#5B5BEF] shadow-lg -translate-y-1"
                  : "bg-white/80 border-[#DCD9FF] hover:border-[#5B5BEF]/40"
              } border`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#F0EEFF] text-[#5B5BEF] flex items-center justify-center font-bold text-sm">
                    {st.num}
                  </div>
                  <span className="text-[10px] font-mono text-[#69708A] uppercase">
                    Stage 0{st.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#10142F] tracking-tight mb-2">
                  {st.title}
                </h3>

                <p className="text-xs text-[#69708A] leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#F0EEFF] flex items-center text-xs font-semibold text-[#5B5BEF]">
                <span>Preview Workflow</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Development Transparency Banner */}
        <div className="mt-12 p-4 rounded-2xl bg-white border border-[#DCD9FF] max-w-2xl mx-auto text-center text-xs text-[#69708A]">
          <span className="font-bold text-[#10142F]">Transparency Note:</span> OCR models and edge detection camera pipelines are currently in staging testing. Production deployment follows PostgreSQL migration and document storage hardening.
        </div>

      </div>
    </section>
  );
}
