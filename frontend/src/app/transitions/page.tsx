"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  GraduationCap, Briefcase, HeartPulse, Landmark, Shield,
  ArrowRight, CheckCircle2, Clock, Sparkles, Lock, ShieldCheck,
  ChevronRight, AlertTriangle, FileText, Check, ExternalLink, Activity
} from "lucide-react";
import TransitionPassportModal from "@/components/TransitionPassportModal";

interface TransitionCard {
  id: string;
  icon: React.ReactNode;
  category: "EDUCATION" | "EMPLOYMENT" | "HEALTH" | "FINANCE";
  title: string;
  subtitle: string;
  purpose: string;
  requiredInfo: string[];
  status: "FUNCTIONAL_CORE" | "SANDBOX_PROTOTYPE";
  statusText: string;
  expiry: string;
  consentState: string;
  badgeColor: string;
  href?: string;
  actionText: string;
}

export default function TransitionsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [passportApproved, setPassportApproved] = useState(false);

  const TRANSITIONS: TransitionCard[] = [
    {
      id: "start_job",
      icon: <Briefcase className="w-6 h-6 text-[#5B5BEF]" />,
      category: "EMPLOYMENT",
      title: "💼 Start Job",
      subtitle: "Onboarding with Zero Reverification",
      purpose: "Employment verification and candidate onboarding eligibility",
      requiredInfo: ["Identity & Citizen ID", "B.Tech / Degree Records", "Verified Technical Skills", "Employment Onboarding Proof"],
      status: "FUNCTIONAL_CORE",
      statusText: passportApproved ? "Active Passport Approved" : "Live Working Passport",
      expiry: "10 Days (Purpose-Bound)",
      consentState: passportApproved ? "Approved by Citizen" : "Awaiting Holder Approval",
      badgeColor: "badge-indigo",
      actionText: "Review & Launch Passport",
    },
    {
      id: "start_university",
      icon: <GraduationCap className="w-6 h-6 text-[#10B981]" />,
      category: "EDUCATION",
      title: "🎓 Start University",
      subtitle: "Higher Education Enrollment",
      purpose: "Academic admission and entrance eligibility verification",
      requiredInfo: ["Identity Proof", "Previous Educational Records", "Entrance Examination Qualification", "Extracurricular Certificates"],
      status: "FUNCTIONAL_CORE",
      statusText: "Ready to Generate",
      expiry: "30 Days (Academic Cycle)",
      consentState: "Student Controlled",
      badgeColor: "badge-lime",
      href: "/dashboard/student",
      actionText: "View in Student Wallet",
    },
    {
      id: "change_hospital",
      icon: <HeartPulse className="w-6 h-6 text-rose-500" />,
      category: "HEALTH",
      title: "🏥 Change Hospital",
      subtitle: "Continuity of Clinical Care",
      purpose: "Cross-provider medical history transfer without centralizing health data",
      requiredInfo: ["Patient Identity", "Relevant Diagnostic Summary", "Active Medications List", "Recent Diagnostic Lab Reports"],
      status: "SANDBOX_PROTOTYPE",
      statusText: "Health Sandbox · Synthetic Demo",
      expiry: "7 Days (Clinical Transfer)",
      consentState: "Patient Consent Required",
      badgeColor: "badge-rose",
      href: "/transitions/health",
      actionText: "Open Health Sandbox",
    },
    {
      id: "apply_finance",
      icon: <Landmark className="w-6 h-6 text-amber-500" />,
      category: "FINANCE",
      title: "💰 Apply for Financial Service",
      subtitle: "Loan & Underwriting Verification",
      purpose: "Income and employment attestation for retail credit evaluation",
      requiredInfo: ["Citizen Identity Proof", "Verified Employer Record", "Cryptographic Income Attestation", "Essential Financial Profile"],
      status: "SANDBOX_PROTOTYPE",
      statusText: "Finance Sandbox · Synthetic Demo",
      expiry: "7 Days (Underwriting Window)",
      consentState: "Applicant Consent Required",
      badgeColor: "badge-amber",
      href: "/transitions/finance",
      actionText: "Open Finance Sandbox",
    },
    {
      id: "insurance_claim",
      icon: <Shield className="w-6 h-6 text-cyan-600" />,
      category: "FINANCE",
      title: "🛡️ Insurance Claim",
      subtitle: "Claim Assessment & Supporting Proofs",
      purpose: "Fast-track claim adjudication through verified incident proofs",
      requiredInfo: ["Policyholder Identity", "Active Policy Number", "Verified Employment Attestation", "Specified Claim Supporting Evidences"],
      status: "SANDBOX_PROTOTYPE",
      statusText: "Finance Sandbox · Synthetic Demo",
      expiry: "14 Days (Claim Processing)",
      consentState: "Explicit Citizen Consent",
      badgeColor: "badge-teal",
      href: "/transitions/finance",
      actionText: "Inspect Claim Prototype",
    },
  ];

  const filtered = activeFilter === "ALL"
    ? TRANSITIONS
    : TRANSITIONS.filter(t => t.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[400px] bg-gradient-to-br from-[#E8E6FF]/70 to-[#F0EEFF]/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-[550px] h-[350px] bg-gradient-to-bl from-[#E0EAFF]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">

        {/* ── Page Header ─────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pb-8 border-b border-[#DCD9FF]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-indigo text-xs font-bold font-mono tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#5B5BEF]" />
            CROSS-LIFECYCLE TRANSITION PLATFORM
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#10142F] tracking-tight">
            LIFE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5BEF] to-[#7A5AF8]">TRANSITIONS</span>
          </h1>
          <p className="text-base sm:text-lg text-[#69708A] font-normal leading-relaxed">
            Move through important life events with verified information under your control. A Transition Passport is a temporary, purpose-bound collection of verified proofs that eliminates friction and repetitive verification.
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-[#69708A] pt-2">
            <span className="flex items-center gap-1 font-semibold text-[#10142F]"><Check className="w-3.5 h-3.5 text-emerald-600" /> Purpose-Specific</span>
            <span className="text-[#DCD9FF]">·</span>
            <span className="flex items-center gap-1 font-semibold text-[#10142F]"><Check className="w-3.5 h-3.5 text-emerald-600" /> Time-Limited</span>
            <span className="text-[#DCD9FF]">·</span>
            <span className="flex items-center gap-1 font-semibold text-[#10142F]"><Check className="w-3.5 h-3.5 text-emerald-600" /> Minimal Sharing</span>
            <span className="text-[#DCD9FF]">·</span>
            <span className="flex items-center gap-1 font-semibold text-[#10142F]"><Check className="w-3.5 h-3.5 text-emerald-600" /> 100% Auditable</span>
          </div>
        </div>

        {/* ── Category Filter Pills ───────────────────────── */}
        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
          {[
            { id: "ALL", label: "All Transitions" },
            { id: "EMPLOYMENT", label: "💼 Employment (Live Core)" },
            { id: "EDUCATION", label: "🎓 Education (Live Core)" },
            { id: "HEALTH", label: "🏥 Health (Sandbox)" },
            { id: "FINANCE", label: "💰 Finance (Sandbox)" },
          ].map(pill => (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                activeFilter === pill.id
                  ? "bg-[#5B5BEF] text-white shadow-md shadow-[#5B5BEF]/25"
                  : "bg-white text-[#69708A] border border-[#DCD9FF] hover:text-[#10142F] hover:bg-[#F0EEFF]"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* ── Transition Cards Grid ──────────────────────── */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(card => {
            const isLiveJob = card.id === "start_job";
            return (
              <div
                key={card.id}
                className="glass-card bg-white rounded-3xl p-6 sm:p-7 border border-[#DCD9FF] shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-[#5B5BEF]/40 transition-all duration-300 relative group"
              >
                <div>
                  {/* Top Badge & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold ${card.badgeColor}`}>
                      {card.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      card.status === "FUNCTIONAL_CORE" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}>
                      {card.status === "FUNCTIONAL_CORE" ? "FUNCTIONAL CORE" : "SANDBOX / DEMO"}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#10142F] tracking-tight group-hover:text-[#5B5BEF] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#5B5BEF] mt-0.5">
                    {card.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#F0EEFF] space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-[#69708A] uppercase font-bold block">PURPOSE</span>
                      <p className="text-xs text-[#10142F] font-medium leading-relaxed mt-0.5">
                        {card.purpose}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[#69708A] uppercase font-bold block">REQUIRED INFORMATION</span>
                      <ul className="mt-1 space-y-1">
                        {card.requiredInfo.map((info, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-xs text-[#10142F]">
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px] font-bold">✓</span>
                            <span>{info}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2 rounded-xl bg-[#F7F8FC] border border-[#E8E6FF]">
                        <span className="text-[9px] text-[#69708A] uppercase block">EXPIRATION</span>
                        <span className="text-[#10142F] font-bold flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-amber-600" /> {card.expiry}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#F7F8FC] border border-[#E8E6FF]">
                        <span className="text-[9px] text-[#69708A] uppercase block">CONSENT</span>
                        <span className="text-emerald-700 font-bold block mt-0.5">
                          {card.consentState}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-6 pt-4 border-t border-[#F0EEFF]">
                  {isLiveJob ? (
                    <button
                      onClick={() => setJobModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl btn-primary text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md shadow-[#5B5BEF]/20"
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : card.href ? (
                    <Link
                      href={card.href}
                      className="w-full py-2.5 px-4 rounded-xl btn-secondary text-xs font-bold text-[#10142F] border border-[#DCD9FF] flex items-center justify-center gap-2 hover:bg-[#F0EEFF] transition-all"
                    >
                      <span>{card.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#5B5BEF]" />
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Architecture Overview Banner ───────────────── */}
        <div className="mt-14 p-8 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-[11px] font-mono uppercase text-[#5B5BEF] font-bold tracking-wider">
                CORE PHILOSOPHY
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#10142F]">
                LIFEKEY is not a central database of your life.
              </h2>
              <p className="text-sm text-[#69708A] leading-relaxed">
                LIFEKEY is a user-controlled trust and transition layer. When you switch jobs, colleges, hospitals, or banks, LIFEKEY prepares a verifiable, minimal passport with explicit consent and automatic expiry.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-xl bg-[#F0EEFF] text-[#5B5BEF] font-bold border border-[#DCD9FF]">
                  W3C JSON-LD Proofs
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  Data Minimization
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-bold border border-amber-200">
                  Zero Central Dossier
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F7F8FC] p-5 rounded-2xl border border-[#E8E6FF] space-y-3 font-mono text-xs">
              <div className="text-[11px] uppercase font-bold text-[#69708A]">The Transition Protocol</div>
              <div className="space-y-2">
                <div className="p-2 rounded-xl bg-white border border-[#DCD9FF] text-[#10142F] flex items-center justify-between">
                  <span>1. Verified Origin</span>
                  <span className="text-emerald-700 font-bold">Issuer Signed</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#DCD9FF] text-[#10142F] flex items-center justify-between">
                  <span>2. Life Event Trigger</span>
                  <span className="text-[#5B5BEF] font-bold">Passport Formed</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#DCD9FF] text-[#10142F] flex items-center justify-between">
                  <span>3. User Review</span>
                  <span className="text-amber-700 font-bold">Minimal Consent</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#DCD9FF] text-[#10142F] flex items-center justify-between">
                  <span>4. Cryptographic Proof</span>
                  <span className="text-emerald-700 font-bold">Verifier Engine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal: Live Transition Passport Demo */}
      <TransitionPassportModal
        isOpen={jobModalOpen}
        onClose={() => setJobModalOpen(false)}
        onApprove={() => {
          setPassportApproved(true);
          setJobModalOpen(false);
        }}
        onReject={() => {
          setPassportApproved(false);
          setJobModalOpen(false);
        }}
        status={passportApproved ? "APPROVED" : "PENDING_APPROVAL"}
      />
    </div>
  );
}
