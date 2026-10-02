"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LifecycleFlow() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      num: "01",
      title: "ISSUE",
      icon: "/assets/icons/issue.svg",
      desc: "Institutions and organizations issue verifiable credentials signed with cryptographic keys.",
      tag: "Tamper-Proof Issuance",
    },
    {
      num: "02",
      title: "OWN",
      icon: "/assets/icons/own.svg",
      desc: "Users keep all records inside one secure, sovereign wallet with absolute data custody.",
      tag: "Citizen Custody",
    },
    {
      num: "03",
      title: "SHARE",
      icon: "/assets/icons/share.svg",
      desc: "Users share only what is needed with smart purpose-bound consent and expiring tokens.",
      tag: "Selective Disclosure",
    },
    {
      num: "04",
      title: "VERIFY",
      icon: "/assets/icons/verify.svg",
      desc: "Verifiers check authenticity, cryptographic integrity, revocation, and intelligence signals instantly.",
      tag: "Sub-Second Trust",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F7F8FC] border-y border-[#E8E6FF] relative overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#F0EEFF] rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#DCD9FF] text-[11px] font-bold text-[#5B5BEF] uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Core Lifecycle</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10142F] tracking-tight">
            How LifeKey Powers Trust
          </h2>

          <p className="text-base sm:text-lg text-[#69708A] font-normal">
            A continuous, controlled lifecycle designed around life transitions — from issuance to sovereign verification.
          </p>
        </div>

        {/* 4 Steps Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => {
            const isHovered = hoveredStep === index;

            return (
              <div
                key={step.num}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`relative rounded-[28px] p-7 transition-all duration-300 ${
                  isHovered
                    ? "bg-white shadow-[0_20px_45px_-12px_rgba(91,91,239,0.18)] border-[#5B5BEF]/40 -translate-y-1.5"
                    : "bg-white/80 border-[#DCD9FF]/90 shadow-[0_10px_25px_-10px_rgba(16,20,47,0.04)]"
                } border flex flex-col justify-between`}
              >
                {/* Step Number & Tag */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black text-[#5B5BEF] font-mono tracking-tighter">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F0EEFF] text-[#5B5BEF]">
                      {step.tag}
                    </span>
                  </div>

                  {/* Icon with hover bounce */}
                  <div className={`w-14 h-14 rounded-2xl bg-[#F0EEFF] flex items-center justify-center p-3 mb-6 transition-transform duration-300 ${
                    isHovered ? "scale-110 shadow-md shadow-[#5B5BEF]/20" : ""
                  }`}>
                    <Image
                      src={step.icon}
                      alt={step.title}
                      width={32}
                      height={32}
                    />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-extrabold text-[#10142F] tracking-tight mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-[#69708A] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Subtle Arrow Indicator to next step (for desktop) */}
                {index < 3 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div className="w-7 h-7 rounded-full bg-white border border-[#DCD9FF] shadow-sm flex items-center justify-center text-[#5B5BEF]">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
