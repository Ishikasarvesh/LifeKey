"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Sparkles,
  QrCode,
  GraduationCap,
  Briefcase,
  Building2,
  Award,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function HeroSection() {
  const [activeNode, setActiveNode] = useState<"edu" | "skills" | "work" | "awards">("edu");

  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-white">
      {/* Ambient Soft Lavender Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-[#E8E6FF]/80 via-[#F0EEFF]/50 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-40 right-[-100px] w-96 h-96 bg-[#DCD9FF]/40 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-[-80px] w-80 h-80 bg-[#5B5BEF]/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text & CTAs (7 cols) */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0EEFF] border border-[#DCD9FF] text-xs font-bold text-[#5B5BEF] tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#5B5BEF]" />
              <span>DIGITAL IDENTITY. REIMAGINED.</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[#10142F] leading-[1.08]">
              Your credentials. <br />
              Your identity. <br />
              Your{" "}
              <span className="gradient-text-indigo relative">
                LifeKey.
                <span className="absolute bottom-2 left-0 w-full h-[6px] bg-[#DCD9FF]/60 -z-10 rounded-full" />
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-[#69708A] max-w-2xl font-normal leading-relaxed">
              LifeKey brings all your life-stage credentials — degrees, certificates, skills, employment records and achievements — into one secure, user-controlled digital network.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="btn-primary px-7 py-4 text-sm font-bold shadow-lg shadow-[#5B5BEF]/30"
              >
                <span>Explore LifeKey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#verify"
                className="btn-secondary px-6 py-4 text-sm font-bold"
              >
                <QrCode className="w-4 h-4 text-[#5B5BEF]" />
                <span>See how verification works</span>
              </a>
            </div>

            {/* Quick Demo Launchers / Roles Jump */}
            <div className="pt-6 border-t border-[#E8E6FF] max-w-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-[#69708A] mb-3">
                Experience LifeKey by Role
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                <Link
                  href="/login"
                  className="p-3 rounded-2xl bg-[#F7F6FF] hover:bg-[#F0EEFF] border border-[#DCD9FF] transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#5B5BEF]/10 flex items-center justify-center text-[#5B5BEF]">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#10142F] group-hover:text-[#5B5BEF]">Student</span>
                  </div>
                  <span className="text-[10px] text-[#69708A] block mt-1">Parth Patil</span>
                </Link>

                <Link
                  href="/login"
                  className="p-3 rounded-2xl bg-[#F7F6FF] hover:bg-[#F0EEFF] border border-[#DCD9FF] transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#5B5BEF]/10 flex items-center justify-center text-[#5B5BEF]">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#10142F] group-hover:text-[#5B5BEF]">Issuer</span>
                  </div>
                  <span className="text-[10px] text-[#69708A] block mt-1">D. J. Sanghvi</span>
                </Link>

                <Link
                  href="/login"
                  className="p-3 rounded-2xl bg-[#F7F6FF] hover:bg-[#F0EEFF] border border-[#DCD9FF] transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#5B5BEF]/10 flex items-center justify-center text-[#5B5BEF]">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#10142F] group-hover:text-[#5B5BEF]">Verifier</span>
                  </div>
                  <span className="text-[10px] text-[#69708A] block mt-1">TechNova HR</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Immersive 3D LifeKey Credential Orbit (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            {/* Background Orbit Ring */}
            <div className="absolute w-[440px] h-[440px] rounded-full border border-[#DCD9FF] pointer-events-none" />
            <div className="absolute w-[540px] h-[540px] rounded-full border border-[#E8E6FF]/70 border-dashed pointer-events-none" />

            {/* Floating Central LifeKey Credential Card */}
            <div className="relative z-20 w-full max-w-sm sm:max-w-md animate-float">
              <div className="glass-card p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(91,91,239,0.2)] border-[#DCD9FF]">
                
                {/* Card Top Row */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F0EEFF]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#5B5BEF]/10 flex items-center justify-center p-1">
                      <Image
                        src="/assets/brand/lifekey-mark.svg"
                        alt="LifeKey Mark"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#10142F] tracking-tight">LifeKey Credential</div>
                      <div className="text-[9.5px] font-mono text-[#69708A]">ID: LK-2026-9940</div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] text-[10.5px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </div>

                {/* Card Body */}
                <div className="my-5">
                  <span className="text-[10px] font-bold text-[#5B5BEF] uppercase tracking-wider">
                    Official Degree Record
                  </span>
                  <h3 className="text-xl font-extrabold text-[#10142F] mt-0.5">
                    B.Tech in Information Technology
                  </h3>
                  <p className="text-xs text-[#69708A] mt-1 font-medium">
                    D. J. Sanghvi College of Engineering • Class of 2026
                  </p>
                </div>

                {/* Holder & Crypto Proof Specs */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F7F6FF] border border-[#E8E6FF] text-left">
                  <div>
                    <span className="text-[9.5px] font-semibold text-[#69708A] block">HOLDER</span>
                    <span className="text-xs font-bold text-[#10142F]">Parth Patil</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-semibold text-[#69708A] block">INTEGRITY</span>
                    <span className="text-xs font-mono font-bold text-[#10B981]">SHA-256 Valid</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-semibold text-[#69708A] block">SIGNATURE</span>
                    <span className="text-xs font-mono font-bold text-[#5B5BEF]">RSA-PSS Verified</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-semibold text-[#69708A] block">STATUS</span>
                    <span className="text-xs font-bold text-[#10142F]">Active &amp; Revocable</span>
                  </div>
                </div>

                {/* Floating Micro Status Badges on Card */}
                <div className="mt-4 pt-3 border-t border-[#F0EEFF] flex items-center justify-between text-[11px] font-semibold text-[#69708A]">
                  <span className="flex items-center gap-1 text-[#10B981]">
                    <CheckCircle2 className="w-3 h-3" /> Integrity Protected
                  </span>
                  <span className="flex items-center gap-1 text-[#5B5BEF]">
                    <Lock className="w-3 h-3" /> Consent Active
                  </span>
                </div>
              </div>
            </div>

            {/* Orbiting Satellite Node 1: Education (Top Left) */}
            <div className="absolute top-4 -left-6 sm:-left-10 z-30 animate-pulse-glow">
              <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#DCD9FF] shadow-lg flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F0EEFF] flex items-center justify-center text-[#5B5BEF]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#10142F] block">Education</span>
                  <span className="text-[10px] text-[#10B981] font-semibold">Degree Verified ✓</span>
                </div>
              </div>
            </div>

            {/* Orbiting Satellite Node 2: Skills (Top Right) */}
            <div className="absolute top-12 -right-4 sm:-right-8 z-30">
              <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#DCD9FF] shadow-lg flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F0EEFF] flex items-center justify-center text-[#5B5BEF]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#10142F] block">Skills</span>
                  <span className="text-[10px] text-[#69708A] font-medium">UI/UX &amp; Python</span>
                </div>
              </div>
            </div>

            {/* Orbiting Satellite Node 3: Employment (Bottom Left) */}
            <div className="absolute -bottom-6 left-0 sm:left-4 z-30">
              <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#DCD9FF] shadow-lg flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F0EEFF] flex items-center justify-center text-[#5B5BEF]">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#10142F] block">Employment</span>
                  <span className="text-[10px] text-[#69708A] font-medium">DeltaQ • Confirmed</span>
                </div>
              </div>
            </div>

            {/* Orbiting Satellite Node 4: Achievements (Bottom Right) */}
            <div className="absolute bottom-2 -right-6 sm:-right-6 z-30 animate-pulse-glow">
              <div className="p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#DCD9FF] shadow-lg flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F0EEFF] flex items-center justify-center text-[#5B5BEF]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#10142F] block">Achievements</span>
                  <span className="text-[10px] text-[#10B981] font-semibold">Hackathon Award ✓</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
