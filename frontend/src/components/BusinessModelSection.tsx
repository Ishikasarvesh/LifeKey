"use client";

import { Building2, Briefcase, HeartPulse, Landmark, Shield, Sparkles, Check, ArrowRight } from "lucide-react";

export default function BusinessModelSection() {
  const CUSTOMER_GROUPS = [
    {
      title: "Educational Institutions",
      subtitle: "Issuance & Integrity",
      icon: <Building2 className="w-5 h-5 text-[#5B5BEF]" />,
      features: ["Cryptographic credential issuance", "Revocation & lifecycle registry", "Instant verification API endpoints", "Alumni transition tracking"],
    },
    {
      title: "Enterprises & Employers",
      subtitle: "Frictionless Onboarding",
      icon: <Briefcase className="w-5 h-5 text-[#7167F6]" />,
      features: ["Candidate verification portal", "Automated background validation", "Tamper detection pipeline", "Purpose-bound consent requests"],
    },
    {
      title: "Healthcare Networks",
      subtitle: "Clinical Continuity",
      icon: <HeartPulse className="w-5 h-5 text-rose-500" />,
      features: ["Inter-hospital patient transitions", "Doctor-to-specialist referrals", "Break-glass emergency audit trails", "Diagnostic lab verified results"],
    },
    {
      title: "Financial Institutions",
      subtitle: "Underwriting & KYC",
      icon: <Landmark className="w-5 h-5 text-amber-500" />,
      features: ["Employment & income proofs", "Retail loan underwriting bundles", "Fast-track insurance claim proofs", "Zero central dossier liability"],
    },
  ];

  const ROADMAP = [
    {
      phase: "PHASE 01",
      title: "Production MVP Core",
      focus: "Education → Employment",
      status: "LIVE & VERIFIED",
      statusColor: "badge-lime",
      items: [
        "Cryptographic Credential Issuance (RSA-2048 & SHA-256)",
        "Zero-Reverification Transition Passport for Employment",
        "Selective Consent & Over-share Anomaly Detection",
        "Credential Intelligence QA & Duplicate Detection",
        "Live Tamper Detection Lab & QR Verifier",
      ],
    },
    {
      phase: "PHASE 02",
      title: "Health Transitions",
      focus: "Clinical Continuity Sandbox",
      status: "PROTOTYPE / SYNTHETIC DATA",
      statusColor: "badge-rose",
      items: [
        "Hospital-to-Hospital Patient Transfer Workflows",
        "Doctor-to-Specialist 48hr Referral Protocols",
        "Break-Glass Emergency Access Simulation",
        "Verified Diagnostic Lab Results Sharing",
        "ABDM / FHIR-Compatible Architecture Alignment",
      ],
    },
    {
      phase: "PHASE 03",
      title: "Financial Transitions",
      focus: "Consent-Driven Underwriting Sandbox",
      status: "PROTOTYPE / SYNTHETIC DATA",
      statusColor: "badge-amber",
      items: [
        "Employment-to-Income Loan Proof Exchange",
        "Minimal KYC Financial Service Switching",
        "Insurance Claim Adjudication Evidence Bundles",
        "Account Aggregator-Compatible Architecture Alignment",
        "Enterprise Compliance & Audit Trails",
      ],
    },
  ];

  return (
    <section className="py-20 bg-[#F7F8FC] border-b border-[#DCD9FF] relative overflow-hidden" id="business-roadmap">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Business Model ──────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-indigo text-xs font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#5B5BEF]" />
            BUILT FOR TRUST INFRASTRUCTURE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#10142F] tracking-tight">
            Enterprise Trust Ecosystem
          </h2>
          <p className="text-sm sm:text-base text-[#69708A]">
            We provide verifiable digital infrastructure for organizations that issue, custody, and verify life records.
          </p>
          <div className="pt-2">
            <span className="inline-block px-4 py-2 rounded-2xl bg-white border border-[#DCD9FF] text-xs font-bold text-[#10142F] shadow-xs">
              💡 Core Business Ethos: <span className="text-[#5B5BEF]">&ldquo;We monetize the infrastructure, not the person&apos;s data.&rdquo;</span>
            </span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUSTOMER_GROUPS.map(grp => (
            <div
              key={grp.title}
              className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#5B5BEF] transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#F0EEFF] flex items-center justify-center mb-3">
                  {grp.icon}
                </div>
                <h3 className="text-base font-black text-[#10142F]">{grp.title}</h3>
                <div className="text-xs font-semibold text-[#5B5BEF] mt-0.5">{grp.subtitle}</div>

                <ul className="mt-4 space-y-2 text-xs text-[#10142F]">
                  {grp.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* ── Development Roadmap ─────────────────────────── */}
        <div className="mt-20 pt-16 border-t border-[#DCD9FF]">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-indigo text-xs font-bold font-mono uppercase tracking-wider">
              ROADMAP
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#10142F] tracking-tight">
              Phased Platform Roadmap
            </h2>
            <p className="text-sm text-[#69708A]">
              From live education-to-employment verification toward comprehensive life-stage transition rails.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ROADMAP.map((phase, idx) => (
              <div
                key={phase.phase}
                className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#5B5BEF] font-bold">{phase.phase}</span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${phase.statusColor}`}>
                      {phase.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#10142F]">{phase.title}</h3>
                  <div className="text-xs font-bold text-[#5B5BEF] mt-0.5">{phase.focus}</div>

                  <ul className="mt-5 space-y-2 text-xs text-[#10142F]">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#F0EEFF] text-[#5B5BEF] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
