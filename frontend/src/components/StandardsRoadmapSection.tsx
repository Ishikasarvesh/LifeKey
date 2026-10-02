"use client";

import { FileCheck, Activity, Landmark, Shield, Sparkles } from "lucide-react";

export default function StandardsRoadmapSection() {
  const STANDARDS = [
    {
      title: "Verifiable Credentials",
      badge: "STANDARDS COMPLIANT",
      badgeColor: "badge-indigo",
      desc: "W3C Verifiable Credentials Data Model v2.0 with JSON-LD canonicalized cryptosuites and cryptographic signatures.",
      status: "Implemented & Active",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      icon: <FileCheck className="w-5 h-5 text-[#5B5BEF]" />,
    },
    {
      title: "Health Interoperability",
      badge: "ARCHITECTURE ROADMAP",
      badgeColor: "badge-rose",
      desc: "Designed for architectural compatibility with HL7® FHIR® protocols and future alignment with Ayushman Bharat Digital Mission (ABDM) consent rails.",
      status: "Future Integration Design",
      statusColor: "text-amber-800 bg-amber-50 border-amber-200",
      icon: <Activity className="w-5 h-5 text-rose-600" />,
    },
    {
      title: "Regulated Financial Data",
      badge: "ARCHITECTURE ROADMAP",
      badgeColor: "badge-amber",
      desc: "Designed for compatibility with consent-based regulated financial-data ecosystems and RBI Account Aggregator (AA) framework principles.",
      status: "Future Integration Design",
      statusColor: "text-amber-800 bg-amber-50 border-amber-200",
      icon: <Landmark className="w-5 h-5 text-amber-600" />,
    },
    {
      title: "Data Protection & Privacy",
      badge: "PRIVACY BY DESIGN",
      badgeColor: "badge-lime",
      desc: "Conforms to applicable Indian Data Protection requirements (DPDP Act), enforcing data minimization, storage limitation, and revocable consent.",
      status: "Native Core Principle",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      icon: <Shield className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-[#DCD9FF] relative overflow-hidden" id="standards">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-indigo text-xs font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#5B5BEF]" />
            STANDARDS & INTEROPERABILITY
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#10142F] tracking-tight">
            Interoperable by Design
          </h2>
          <p className="text-sm sm:text-base text-[#69708A]">
            Built on open global standards and designed for smooth integration with national digital public infrastructure ecosystems.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STANDARDS.map(item => (
            <div
              key={item.title}
              className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F7F8FC] border border-[#E8E6FF] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className={`text-[9.5px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#10142F]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#69708A] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0EEFF]">
                <span className={`text-[10px] font-mono px-2 py-1 rounded font-bold border block text-center ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
