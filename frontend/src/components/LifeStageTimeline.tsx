"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

export default function LifeStageTimeline() {
  const [selectedStage, setSelectedStage] = useState<number>(0);

  const stages = [
    {
      num: "01",
      title: "Education",
      subtitle: "Degrees & Academic Records",
      icon: "/assets/3d/education.svg",
      tag: "Academic Genesis",
      examples: [
        "Bachelor of Technology in Information Technology",
        "Higher Secondary Certificate (HSC)",
        "Cumulative Grade Point Transcript (8.85 CGPA)",
      ],
      description:
        "Academic institutions issue cryptographically signed degrees directly to student vaults, eliminating fake graduation documents.",
    },
    {
      num: "02",
      title: "Skills",
      subtitle: "Certificates & Skill Validation",
      icon: "/assets/3d/skills.svg",
      tag: "Applied Competence",
      examples: [
        "Advanced Interaction Design (UI/UX) Certificate",
        "Full-Stack Python & Distributed Systems Attestation",
        "Cloud Security & Zero-Trust Architecture Credential",
      ],
      description:
        "Continuous micro-credentials and bootcamps verified with granular attribute proofs, proving mastery without disclosing test marks.",
    },
    {
      num: "03",
      title: "Employment",
      subtitle: "Work History & Experience",
      icon: "/assets/3d/employment.svg",
      tag: "Career Progression",
      examples: [
        "Senior Design Engineer Attestation • TechNova Labs",
        "Graphic & UI Designer Record • DeltaQ",
        "Performance Evaluation & Peer Recommendations",
      ],
      description:
        "Seamless transition into corporate ecosystems. Employers issue verifiable work experience tokens that cannot be falsified on CVs.",
    },
    {
      num: "04",
      title: "Achievements",
      subtitle: "Awards & Accomplishments",
      icon: "/assets/3d/achievements.svg",
      tag: "Distinction & Honors",
      examples: [
        "Smart India Hackathon Finalist Trophy Attestation",
        "Open-Source Contributor of the Year 2026",
        "Research Publication in Cryptographic Systems",
      ],
      description:
        "Honors, patents, and community contributions are anchored to your persistent sovereign identity across every life transition.",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background lavender glow paths */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#F0EEFF]/70 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0EEFF] border border-[#DCD9FF] text-[11px] font-bold text-[#5B5BEF] uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Continuous Transition Layer</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#10142F] tracking-tight leading-tight">
            One identity. <br />
            Every stage.
          </h2>

          <p className="text-base sm:text-lg text-[#69708A] font-normal">
            LifeKey is purpose-built to bridge transitions: moving smoothly from campus graduation to high-impact career milestones without losing verification provenance.
          </p>
        </div>

        {/* 4 Life-Stage Cards (Horizontal Timeline on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {stages.map((stage, idx) => {
            const isSelected = selectedStage === idx;

            return (
              <div
                key={stage.title}
                onClick={() => setSelectedStage(idx)}
                className={`cursor-pointer rounded-[28px] p-7 transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#F7F6FF] border-[#5B5BEF] shadow-[0_20px_45px_-12px_rgba(91,91,239,0.16)] -translate-y-1.5"
                    : "bg-white border-[#DCD9FF] hover:border-[#5B5BEF]/40 shadow-sm"
                } border`}
              >
                <div>
                  {/* Top Bar with Number & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xl font-black text-[#5B5BEF]">
                      {stage.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-[#DCD9FF] text-[#10142F]">
                      {stage.tag}
                    </span>
                  </div>

                  {/* 3D Stage Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-white border border-[#DCD9FF] flex items-center justify-center p-3 mb-5 shadow-sm">
                    <Image
                      src={stage.icon}
                      alt={stage.title}
                      width={44}
                      height={44}
                    />
                  </div>

                  {/* Stage Title */}
                  <h3 className="text-2xl font-extrabold text-[#10142F] tracking-tight">
                    {stage.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#5B5BEF] mt-0.5">
                    {stage.subtitle}
                  </p>

                  <p className="text-xs text-[#69708A] mt-3 leading-relaxed">
                    {stage.description}
                  </p>

                  {/* Example records preview */}
                  <div className="mt-5 pt-4 border-t border-[#E8E6FF] space-y-2">
                    <span className="text-[10px] font-mono font-bold text-[#69708A] uppercase tracking-wider block">
                      VERIFIABLE ASSETS
                    </span>
                    {stage.examples.map((ex) => (
                      <div key={ex} className="flex items-start gap-1.5 text-[11px] text-[#10142F] font-medium leading-snug">
                        <CheckCircle2 className="w-3 h-3 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <span className="truncate">{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 flex items-center text-xs font-bold text-[#5B5BEF]">
                  <span>Explore {stage.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
