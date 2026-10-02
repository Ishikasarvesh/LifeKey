"use client";

import { useState } from "react";
import Image from "next/image";
import {
  GraduationCap,
  Sparkles,
  Briefcase,
  Award,
  CheckCircle2,
  Lock,
  Share2,
  QrCode,
  ShieldCheck,
  Eye,
  FileText,
  Calendar,
} from "lucide-react";

export default function WalletShowcase() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const credentials = [
    {
      id: "cred-edu-1",
      category: "EDUCATION",
      title: "B.Tech in Information Technology",
      issuer: "D. J. Sanghvi College of Engineering",
      issued: "June 2026",
      status: "Verified ✓",
      type: "Degree & Transcript",
      icon: "/assets/3d/education.svg",
      details: {
        cgpa: "8.85 / 10.0",
        regId: "DJS-2022-IT-084",
        hash: "e3b0c44298fc1c149afbf4c8996fb924",
      },
    },
    {
      id: "cred-skill-1",
      category: "SKILLS",
      title: "Professional Skill Certificate",
      issuer: "UI/UX Design Institute (Interaction Design)",
      issued: "August 2025",
      status: "Verified ✓",
      type: "Skill Validation",
      icon: "/assets/3d/skills.svg",
      details: {
        skills: "Figma, User Research, Motion Design, Design Systems",
        certId: "DES-ADV-883",
        hash: "7f83b1657ff1fc53b92dc18148a1d65d",
      },
    },
    {
      id: "cred-work-1",
      category: "EMPLOYMENT",
      title: "Employment Record",
      issuer: "DeltaQ, Pune",
      issued: "December 2025",
      status: "Verified ✓",
      type: "Work Experience",
      icon: "/assets/3d/employment.svg",
      details: {
        role: "Graphic & UI Designer (Contract)",
        duration: "Jan 2025 — Dec 2025 (12 Months)",
        hash: "c24a9a0be7659586b5105266cb1e4695",
      },
    },
    {
      id: "cred-achieve-1",
      category: "ACHIEVEMENTS",
      title: "National Innovation Award",
      issuer: "Smart India Hackathon Finalist",
      issued: "March 2026",
      status: "Verified ✓",
      type: "Award & Honors",
      icon: "/assets/3d/achievements.svg",
      details: {
        track: "Fintech & Digital Governance Track",
        rank: "1st Runner Up (Team LifeKey)",
        hash: "a43878b209d7499d6d5ebaa025a1e7d0",
      },
    },
  ];

  const filtered =
    activeCategory === "all"
      ? credentials
      : credentials.filter((c) => c.category === activeCategory);

  return (
    <section id="product" className="py-24 bg-white relative overflow-hidden">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#F0EEFF] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#F7F6FF] rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0EEFF] border border-[#DCD9FF] text-[11px] font-bold text-[#5B5BEF] uppercase tracking-wider">
              <span>Personal Vault Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#10142F] tracking-tight leading-tight">
              Your credentials. <br />
              One secure wallet.
            </h2>
            <p className="text-base sm:text-lg text-[#69708A]">
              Consolidate academic transcripts, verified skills, and career history inside a single cryptographic container with granular user control.
            </p>
          </div>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#F7F8FC] border border-[#DCD9FF]">
            {["all", "EDUCATION", "SKILLS", "EMPLOYMENT", "ACHIEVEMENTS"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-white text-[#5B5BEF] shadow-sm border border-[#DCD9FF]"
                    : "text-[#69708A] hover:text-[#10142F]"
                }`}
              >
                {cat === "all" ? "All Records (4)" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Realistic LifeKey Wallet UI Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((cred) => (
            <div
              key={cred.id}
              className="glass-card p-7 sm:p-8 flex flex-col justify-between group hover:border-[#5B5BEF]/40"
            >
              <div>
                {/* Header Row: Category Badge + Status */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-[#F0EEFF] text-[#5B5BEF] border border-[#DCD9FF]">
                      {cred.category}
                    </span>
                    <span className="text-[11px] font-medium text-[#69708A]">
                      {cred.type}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{cred.status}</span>
                  </span>
                </div>

                {/* Main Credential Info */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF] flex-shrink-0 flex items-center justify-center p-2.5 group-hover:scale-105 transition-transform">
                    <Image
                      src={cred.icon}
                      alt={cred.title}
                      width={36}
                      height={36}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-[#10142F] tracking-tight group-hover:text-[#5B5BEF] transition-colors">
                      {cred.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#69708A] mt-0.5">
                      {cred.issuer}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#9499B0] mt-1">
                      <Calendar className="w-3 h-3" /> Issued {cred.issued}
                    </span>
                  </div>
                </div>

                {/* Specific Credential Metadata Preview */}
                <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-[#E8E6FF] space-y-2 text-xs">
                  {Object.entries(cred.details).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-[#69708A] uppercase font-semibold text-[10px]">
                        {key}
                      </span>
                      <span className="font-mono font-medium text-[#10142F] truncate max-w-[200px]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="mt-6 pt-4 border-t border-[#F0EEFF] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#69708A]">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>RSA-PSS Signed</span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-1.5 rounded-xl bg-white border border-[#DCD9FF] text-xs font-bold text-[#10142F] hover:bg-[#F0EEFF] transition-all flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#5B5BEF]" />
                    <span>Share</span>
                  </button>
                  <button className="p-2 rounded-xl bg-[#F0EEFF] text-[#5B5BEF] hover:bg-[#E8E6FF] transition-all" title="View QR">
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
