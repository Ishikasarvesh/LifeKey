"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Landmark, Shield, CheckCircle2, Clock, Building2,
  Briefcase, FileText, ArrowRight, Share2, Info,
  Check, X, AlertTriangle, Sparkles, ChevronRight, Lock
} from "lucide-react";

export default function FinanceTransitionsPage() {
  const [loanConsentStatus, setLoanConsentStatus] = useState<"PENDING" | "APPROVED" | "DECLINED">("PENDING");
  const [insuranceShared, setInsuranceShared] = useState(false);
  const [accountSwitched, setAccountSwitched] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[400px] bg-gradient-to-br from-amber-100/60 to-[#F0EEFF]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-[550px] h-[350px] bg-gradient-to-bl from-[#E0EAFF]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* ── Breadcrumb & Sandbox Banner ──────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-[#DCD9FF]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Link href="/transitions" className="text-xs font-bold text-[#5B5BEF] hover:underline flex items-center gap-1">
                ← Life Transitions
              </Link>
              <span className="text-[#DCD9FF]">/</span>
              <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold tracking-wider badge-amber flex items-center gap-1">
                <Landmark className="w-3 h-3 text-amber-600" />
                FINANCE SANDBOX · SYNTHETIC DEMONSTRATION DATA
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#10142F] tracking-tight">
              Financial Information, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-[#7A5AF8]">With Consent</span>
            </h1>
            <p className="text-sm text-[#69708A] mt-1">
              LIFEKEY can eventually connect authorized financial sources and share only the information required for a specific transition.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setHistoryOpen(true)}
              className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-[#10142F] border border-[#DCD9FF] shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-[#5B5BEF]" /> Sharing History
            </button>
          </div>
        </div>

        {/* ── Critical Financial Neutrality Notice ────────── */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 shadow-sm flex items-start gap-3 animate-fade-up">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="text-amber-800 font-bold block mb-0.5">Non-Adjudication Principle:</strong>
            LIFEKEY does not approve or reject loans. LIFEKEY only facilitates authorized, purpose-bound information exchange. Synthetic demonstration only — no real financial integration or bank transaction history is connected. Designed for future compatibility with Account Aggregator and consent-based regulated financial architectures.
          </div>
        </div>

        {/* ── Top Dashboard Stats & Financial Sources ──────── */}
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Connected Financial Sources */}
          <div className="lg:col-span-5 p-5 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <h3 className="text-sm font-bold text-[#10142F] flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#5B5BEF]" /> Connected Financial Sources
              </h3>
              <span className="text-[10px] font-mono badge-indigo px-2 py-0.5 rounded font-bold">SYNTHETIC</span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: "Demo Bank", type: "Depository Proof Node", status: "Connected", icon: "🏦" },
                { name: "Employment Record", type: "TechNova Verified Issuer", status: "Verified", icon: "💼" },
                { name: "Income Source", type: "Annual CTC Attestation", status: "Verified", icon: "💰" },
              ].map((src, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{src.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-[#10142F]">{src.name}</div>
                      <div className="text-[10px] text-[#69708A]">{src.type}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    {src.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Information Request */}
          <div className="lg:col-span-7 p-5 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-amber-700 font-bold badge-amber px-2.5 py-0.5 rounded-full">
                  ACTIVE REQUEST
                </span>
                <h3 className="text-sm font-bold text-[#10142F]">TechFinance Information Request</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                AWAITING APPROVAL
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FAFAFE] border border-[#E8E6FF]">
                <span className="text-[10px] font-mono text-[#69708A] uppercase block">REQUESTER</span>
                <span className="font-bold text-[#10142F] mt-0.5 block">TechFinance NBFC</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAFAFE] border border-[#E8E6FF]">
                <span className="text-[10px] font-mono text-[#69708A] uppercase block">PURPOSE</span>
                <span className="font-bold text-[#10142F] mt-0.5 block">Loan Application</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAFAFE] border border-[#E8E6FF]">
                <span className="text-[10px] font-mono text-[#69708A] uppercase block">DURATION</span>
                <span className="font-bold text-amber-700 mt-0.5 block">7 Days Expiry</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-[11px] font-bold text-[#10142F]">Data Minimization Scope:</div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-semibold">
                  ✓ Employment Verification
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-semibold">
                  ✓ Annual Income Verification
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10.5px] font-semibold">
                  ✓ Essential Financial Profile
                </span>
              </div>
              <div className="text-[10.5px] text-[#69708A] pt-1">
                ○ Not requested: Bank transaction logs, retail spending history, or personal investment ledger.
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0EEFF] flex items-center justify-between">
              <span className="text-[11px] text-[#69708A] italic">
                *LIFEKEY does not make lending decisions.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLoanConsentStatus("DECLINED")}
                  disabled={loanConsentStatus !== "PENDING"}
                  className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-semibold text-rose-700 border border-rose-200"
                >
                  Decline
                </button>
                <button
                  onClick={() => setLoanConsentStatus("APPROVED")}
                  disabled={loanConsentStatus !== "PENDING"}
                  className="px-4 py-1.5 rounded-xl btn-primary text-xs font-bold text-white shadow-sm"
                >
                  {loanConsentStatus === "APPROVED" ? "Approved & Disclosed" : "Approve Minimal Exchange"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section: Employment -> Financial Service Flow ── */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-5 animate-fade-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EEFF]">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#5B5BEF] uppercase font-bold tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> VERIFIED CREDENTIAL PIPELINE
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#10142F] mt-0.5">
                Employment → Financial Service Transition
              </h2>
            </div>
            <span className="text-[11px] font-mono badge-indigo px-3 py-1 rounded-full font-bold">
              6-STEP TRANSITION PIPELINE
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#69708A]">
            Watch how a verified credential earned during employment smoothly fuels retail financial applications without manual paperwork or document forgery.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {[
              { step: "01", title: "Verified Employment", desc: "Signed by Employer", icon: "💼" },
              { step: "02", title: "Income Verification", desc: "Cryptographic CTC", icon: "💰" },
              { step: "03", title: "Financial Application", desc: "User initiated", icon: "📝" },
              { step: "04", title: "User Consent", desc: "Purpose-bound approval", icon: "🛡️" },
              { step: "05", title: "Authorized Exchange", desc: "Minimal proof token", icon: "⚡" },
              { step: "06", title: "Lender Evaluation", desc: "External decision", icon: "🏦" },
            ].map(item => (
              <div key={item.step} className="p-3.5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#5B5BEF] font-bold">
                  <span>STEP {item.step}</span>
                  <span className="text-base">{item.icon}</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#10142F] leading-tight">{item.title}</div>
                  <div className="text-[10.5px] text-[#69708A] mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F0EEFF]/50 border border-[#DCD9FF] text-xs text-[#10142F] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#5B5BEF] shrink-0" />
            <span><strong>Clear Authority Boundary:</strong> LIFEKEY does NOT evaluate credit scores or make the lending decision. LIFEKEY securely transfers the verified proof bundle.</span>
          </div>
        </div>

        {/* ── Two Prototype Workflows: Insurance & Account Change ── */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Workflow 1: Insurance Claim Transition */}
          <div className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#5B5BEF] font-bold tracking-wider">INSURANCE PROTOTYPE</span>
                <h3 className="text-lg font-black text-[#10142F]">Insurance Claim Transition</h3>
              </div>
              <span className="text-[10px] font-mono badge-teal px-2 py-0.5 rounded font-bold">7 DAYS</span>
            </div>

            <p className="text-xs text-[#69708A]">
              Insurance Provider requests specific proof bundle to settle claim without requiring repetitive identity attestation.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] text-xs space-y-1.5">
              <div className="font-bold text-[#10142F]">Requested Proof Bundle:</div>
              <ul className="space-y-1 text-xs text-[#10142F]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Active Policy Information</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Employment Onboarding Confirmation</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Verified Incident Supporting Documentation</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-[#F0EEFF] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#69708A]">Purpose: Claim assessment</span>
              <button
                onClick={() => setInsuranceShared(!insuranceShared)}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{insuranceShared ? "Claim Proofs Shared" : "Review & Share"}</span>
              </button>
            </div>
          </div>

          {/* Workflow 2: Financial Account Change */}
          <div className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#5B5BEF] font-bold tracking-wider">ACCOUNT MIGRATION PROTOTYPE</span>
                <h3 className="text-lg font-black text-[#10142F]">Change Financial Service</h3>
              </div>
              <span className="text-[10px] font-mono badge-amber px-2 py-0.5 rounded font-bold">MINIMAL TRANSFER</span>
            </div>

            <p className="text-xs text-[#69708A]">
              Moving to a new financial service? Seamlessly transfer verified KYC & employment history without exposing full historical transactions.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#69708A] block">Old Service</span>
                <span className="font-bold text-[#10142F]">Legacy Credit Node</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5B5BEF]" />
              <div className="text-right">
                <span className="text-[10px] text-[#69708A] block">New Service</span>
                <span className="font-bold text-[#10142F]">NextGen Wealth Desk</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0EEFF] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#69708A]">Status: Synthetic Simulation</span>
              <button
                onClick={() => setAccountSwitched(!accountSwitched)}
                className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold text-[#5B5BEF] border border-[#DCD9FF] shadow-sm"
              >
                {accountSwitched ? "✓ Migrated with Minimal Proof" : "Simulate Service Switch"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal: Financial Sharing History Audit Trail */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="max-w-xl w-full glass-card bg-white rounded-3xl p-6 sm:p-7 border border-[#DCD9FF] shadow-2xl text-left animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#5B5BEF] font-bold">AUDIT TRAIL</span>
                <h3 className="text-xl font-black text-[#10142F]">Financial Sharing History</h3>
              </div>
              <button onClick={() => setHistoryOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-[#10142F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#10142F]">TechFinance NBFC</span>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded badge-lime font-bold">APPROVED</span>
                </div>
                <div className="text-[11px] text-[#69708A]">Oct 2, 2026 · 18:20 | Purpose: Loan application</div>
                <div className="text-[11px] text-[#10142F] font-mono">Disclosed: Verified Employment, CTC Proof</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#10142F]">Apex Mutual Desk</span>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">EXPIRED</span>
                </div>
                <div className="text-[11px] text-[#69708A]">Sept 15, 2026 · 11:00 | Purpose: Investment onboarding</div>
                <div className="text-[11px] text-[#10142F] font-mono">Disclosed: Identity Attestation</div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#F0EEFF] flex justify-end">
              <button
                onClick={() => setHistoryOpen(false)}
                className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold text-[#10142F] border border-[#DCD9FF]"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
