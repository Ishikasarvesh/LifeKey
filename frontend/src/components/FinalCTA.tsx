"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, QrCode, Sparkles, ShieldCheck } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-[#10142F] text-white relative overflow-hidden">
      {/* Background ambient glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#5B5BEF]/25 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 right-10 w-80 h-80 bg-[#7167F6]/20 blur-[100px] pointer-events-none rounded-full" />

      {/* Floating 3D Key visual on left background */}
      <div className="hidden lg:block absolute left-12 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none animate-float">
        <Image
          src="/assets/3d/key.svg"
          alt="LifeKey 3D Key"
          width={180}
          height={180}
        />
      </div>

      {/* Floating 3D Shield visual on right background */}
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none animate-float" style={{ animationDelay: "1.5s" }}>
        <Image
          src="/assets/3d/shield.svg"
          alt="LifeKey 3D Shield"
          width={180}
          height={180}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Top Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.15] text-xs font-bold text-[#DCD9FF] tracking-wider uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#5B5BEF]" />
          <span>Unified Life-Stage Transition Network</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Carry your verified story forward.
        </h2>

        {/* Supporting Copy */}
        <p className="text-base sm:text-xl text-[#DCD9FF]/80 max-w-2xl mx-auto font-normal leading-relaxed">
          Own your credentials. Share with confidence. <br className="hidden sm:block" />
          Build your future with LifeKey.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="btn-primary px-8 py-4 text-sm font-bold shadow-xl shadow-[#5B5BEF]/40"
          >
            <span>Create your LifeKey</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <a
            href="#verify"
            className="px-8 py-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.15] text-sm font-bold transition-all flex items-center gap-2"
          >
            <QrCode className="w-4 h-4 text-[#DCD9FF]" />
            <span>Explore verification</span>
          </a>
        </div>

        {/* Subtle trust badge */}
        <div className="pt-6 text-xs text-[#DCD9FF]/60 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Sovereign Identity • Zero Central Point of Failure • Open Standards</span>
        </div>

      </div>
    </section>
  );
}
