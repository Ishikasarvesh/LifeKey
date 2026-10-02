"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HeartPulse, ShieldCheck, AlertTriangle, Building2, User,
  FileText, Clock, CheckCircle2, XCircle, Share2, History,
  Activity, ArrowRight, Lock, Eye, AlertOctagon, Sparkles,
  ChevronRight, Calendar, Info, Check, X
} from "lucide-react";

export default function HealthTransitionsPage() {
  // Consent Request State
  const [cityCareStatus, setCityCareStatus] = useState<"PENDING" | "APPROVED" | "DECLINED">("PENDING");

  // Hospital -> Hospital Transition State
  const [hospitalTransferStatus, setHospitalTransferStatus] = useState<"PENDING" | "APPROVED">("PENDING");

  // Emergency Access Simulation State
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencySeconds, setEmergencySeconds] = useState(1800); // 30 minutes

  // Access History Modal
  const [historyOpen, setHistoryOpen] = useState(false);

  // Specialist Referral State
  const [specialistShared, setSpecialistShared] = useState(false);

  // Lab Result State
  const [labShared, setLabShared] = useState(false);

  // Emergency timer countdown simulation
  useEffect(() => {
    let interval: any;
    if (emergencyActive && emergencySeconds > 0) {
      interval = setInterval(() => {
        setEmergencySeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emergencyActive, emergencySeconds]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[400px] bg-gradient-to-br from-rose-100/60 to-[#F0EEFF]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-[550px] h-[350px] bg-gradient-to-bl from-[#E8E6FF]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

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
              <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold tracking-wider badge-rose flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-rose-600" />
                HEALTH SANDBOX · SYNTHETIC DEMONSTRATION DATA
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#10142F] tracking-tight">
              Health <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-[#7A5AF8]">Transitions</span>
            </h1>
            <p className="text-sm text-[#69708A] mt-1">
              Connect authorized health information for continuity of care — without creating a centralized medical database.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setHistoryOpen(true)}
              className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-[#10142F] border border-[#DCD9FF] shadow-sm"
            >
              <History className="w-3.5 h-3.5 text-[#5B5BEF]" /> View Access History
            </button>
          </div>
        </div>

        {/* ── Critical Medical Verification Notice ────────── */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 shadow-sm flex items-start gap-3 animate-fade-up">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="text-amber-800 font-bold block mb-0.5">Clinical Authenticity Standard:</strong>
            Digitized or OCR-extracted health information is not automatically medically verified. LIFEKEY explicitly distinguishes between <span className="px-1.5 py-0.5 rounded bg-white border border-amber-300 font-bold text-amber-800 text-[10px] font-mono">USER-UPLOADED (Awaiting source verification)</span> and <span className="px-1.5 py-0.5 rounded bg-emerald-100 border border-emerald-300 font-bold text-emerald-800 text-[10px] font-mono">SOURCE-VERIFIED (Cryptographically signed by accredited provider)</span>. Designed for future compatibility with FHIR and ABDM healthcare rails.
          </div>
        </div>

        {/* ── Top Dashboard Stats & Providers ──────────────── */}
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Connected Providers */}
          <div className="lg:col-span-4 p-5 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <h3 className="text-sm font-bold text-[#10142F] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#5B5BEF]" /> Connected Providers
              </h3>
              <span className="text-[10px] font-mono badge-indigo px-2 py-0.5 rounded font-bold">3 ACTIVE</span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: "CityCare Hospital", role: "Primary Care Node", status: "Connected", icon: "🏥" },
                { name: "Dr. Mehta", role: "Cardiology Specialist", status: "Connected", icon: "👨‍⚕️" },
                { name: "LifeLab Diagnostics", role: "Clinical Pathology", status: "Connected", icon: "🧪" },
              ].map((prov, i) => (
                <div key={i} className="p-3 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{prov.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-[#10142F]">{prov.name}</div>
                      <div className="text-[10px] text-[#69708A]">{prov.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    {prov.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Record References (Synthetic) */}
          <div className="lg:col-span-4 p-5 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <h3 className="text-sm font-bold text-[#10142F] flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-500" /> Record References
              </h3>
              <span className="text-[10px] font-mono text-[#69708A]">Updated: Oct 1, 2026</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF]">
                <span className="text-lg font-black text-[#10142F] block">3</span>
                <span className="text-[10px] text-[#69708A] font-semibold">Diagnosis</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF]">
                <span className="text-lg font-black text-[#10142F] block">2</span>
                <span className="text-[10px] text-[#69708A] font-semibold">Medications</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF]">
                <span className="text-lg font-black text-[#10142F] block">5</span>
                <span className="text-[10px] text-[#69708A] font-semibold">Lab Reports</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E8E6FF]">
                <span className="text-[#10142F] font-semibold">Hypertension Assessment</span>
                <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  ✓ Source Verified
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E8E6FF]">
                <span className="text-[#10142F] font-semibold">Lipid Panel Report</span>
                <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  ⚠ User-Uploaded
                </span>
              </div>
            </div>
          </div>

          {/* Health Timeline */}
          <div className="lg:col-span-4 p-5 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <h3 className="text-sm font-bold text-[#10142F] flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Health Timeline
              </h3>
              <span className="text-[10px] font-mono text-[#69708A]">Recent Events</span>
            </div>

            <div className="space-y-3 relative pl-4 border-l-2 border-[#DCD9FF] ml-2 text-xs">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#5B5BEF]" />
                <span className="text-[10px] font-mono text-[#69708A]">Sept 28, 2026</span>
                <div className="font-bold text-[#10142F]">Lab result uploaded & signed</div>
                <div className="text-[11px] text-[#69708A]">LifeLab Diagnostics · Lipid Panel</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono text-[#69708A]">Sept 20, 2026</span>
                <div className="font-bold text-[#10142F]">Medication regimen updated</div>
                <div className="text-[11px] text-[#69708A]">CityCare Hospital · Cardiology</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-[10px] font-mono text-[#69708A]">Sept 10, 2026</span>
                <div className="font-bold text-[#10142F]">Hospital consultation logged</div>
                <div className="text-[11px] text-[#69708A]">Routine outpatient consultation</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Emergency Access Simulation (Standout UI) ──── */}
        <div className="mt-8 p-6 sm:p-7 rounded-3xl bg-rose-50/70 border-2 border-rose-300 relative overflow-hidden shadow-sm animate-fade-up">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-rose-200">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-rose-700 font-bold tracking-widest">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                EXCEPTIONAL WORKFLOW · BREAK-GLASS EMERGENCY ACCESS
              </div>
              <h2 className="text-2xl font-black text-rose-950 mt-1">
                Emergency Access Simulation
              </h2>
              <p className="text-xs text-rose-800 mt-0.5 max-w-2xl">
                Reason: &ldquo;Patient unconscious — continuity of emergency care&rdquo;. Strictly time-boxed and audited.
              </p>
            </div>

            {!emergencyActive ? (
              <button
                onClick={() => {
                  setEmergencyActive(true);
                  setEmergencySeconds(1800);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-600/25 transition-all shrink-0"
              >
                <AlertOctagon className="w-4 h-4" /> Activate Emergency Access
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-rose-300 shadow-sm shrink-0">
                <div className="text-right">
                  <div className="text-[10px] font-mono text-rose-600 uppercase font-bold">Emergency Access Active</div>
                  <div className="text-xl font-black font-mono text-rose-700">{formatTimer(emergencySeconds)}</div>
                </div>
                <button
                  onClick={() => setEmergencyActive(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Deactivate
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1">
              <span className="text-[10px] font-mono uppercase text-rose-700 font-bold block">1. ACCESS SCOPE (MINIMAL)</span>
              <ul className="space-y-1 text-rose-950">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> Critical allergies & blood group</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> Current active medications</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> Recent primary diagnoses</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1">
              <span className="text-[10px] font-mono uppercase text-rose-700 font-bold block">2. MANDATORY PROTOCOL</span>
              <ul className="space-y-1 text-rose-950">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> Verified emergency clinician badge</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> 30-minute maximum session window</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> Immutable post-event SMS alert to holder</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-1">
              <span className="text-[10px] font-mono uppercase text-rose-700 font-bold block">3. AUDIT & DISCLOSURE</span>
              <p className="text-[11px] text-rose-900 leading-relaxed">
                Emergency access is never anonymous. The doctor identity, clinical location, and time are recorded into the permanent LifeKey audit ledger.
              </p>
            </div>
          </div>
        </div>

        {/* ── Interactive Prototype Workflows ──────────────── */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Workflow 1: Hospital -> Hospital Transition */}
          <div className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#5B5BEF] font-bold tracking-wider">TRANSITION PROTOTYPE</span>
                <h3 className="text-lg font-black text-[#10142F]">Hospital → Hospital Transition</h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                hospitalTransferStatus === "APPROVED" ? "badge-lime" : "badge-amber"
              }`}>
                {hospitalTransferStatus === "APPROVED" ? "✓ TRANSFERRED" : "AWAITING APPROVAL"}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#69708A] block">Current Provider</span>
                <span className="font-bold text-[#10142F]">CityCare Hospital</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5B5BEF]" />
              <div className="text-right">
                <span className="text-[10px] text-[#69708A] block">Target Provider</span>
                <span className="font-bold text-[#10142F]">Metro Hospital</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-bold text-[#10142F]">Requested Information:</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">✓ Relevant diagnosis</span>
                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">✓ Current medication</span>
                <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">✓ Relevant lab reports</span>
              </div>
              <div className="text-[10.5px] text-[#69708A] flex items-center gap-1.5 pt-1">
                <X className="w-3.5 h-3.5 text-rose-500" />
                <span>Not shared: Unrelated history, financial details, or unrelated clinical notes.</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0EEFF] flex items-center justify-end gap-2">
              <button
                onClick={() => setHospitalTransferStatus("APPROVED")}
                disabled={hospitalTransferStatus === "APPROVED"}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
              >
                {hospitalTransferStatus === "APPROVED" ? "Transfer Approved" : "Approve Hospital Transfer"}
              </button>
            </div>
          </div>

          {/* Workflow 2: Doctor -> Specialist Referral */}
          <div className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#5B5BEF] font-bold tracking-wider">REFERRAL PROTOTYPE</span>
                <h3 className="text-lg font-black text-[#10142F]">Doctor → Specialist Referral</h3>
              </div>
              <span className="text-[10px] font-mono badge-indigo px-2 py-0.5 rounded font-bold">48 HR EXPIRY</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[#69708A] block">Primary Physician</span>
                <span className="font-bold text-[#10142F]">Dr. Sharma (CityCare)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#5B5BEF]" />
              <div className="text-right">
                <span className="text-[10px] text-[#69708A] block">Cardiology Specialist</span>
                <span className="font-bold text-[#10142F]">Dr. Mehta</span>
              </div>
            </div>

            <div className="text-xs text-[#69708A] leading-relaxed">
              Purpose: <strong>Specialist consultation</strong>. Only records relevant to this specific referral will be shared. Access automatically expires 48 hours after appointment.
            </div>

            <div className="pt-3 border-t border-[#F0EEFF] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#69708A]">Purpose: Cardiology Review</span>
              <button
                onClick={() => setSpecialistShared(!specialistShared)}
                className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold text-[#5B5BEF] border border-[#DCD9FF] shadow-sm"
              >
                {specialistShared ? "✓ Shared with Dr. Mehta" : "Authorize 48hr Referral"}
              </button>
            </div>
          </div>

          {/* Workflow 3: Lab -> Doctor Verified Results */}
          <div className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#10B981] font-bold tracking-wider">LAB VERIFICATION PROTOTYPE</span>
                <h3 className="text-lg font-black text-[#10142F]">Lab → Doctor Verified Result</h3>
              </div>
              <span className="text-[10px] font-mono badge-lime px-2 py-0.5 rounded font-bold">RSA VALID</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#ECFDF5]/60 border border-[#A7F3D0] text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#065F46]">LifeLab Diagnostics · Synthetic Demo Result</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700">✓ Source Verified</span>
              </div>
              <p className="text-[11px] text-[#065F46]/80">
                Cryptographic signature matches accredited laboratory public key. Zero tampering detected.
              </p>
            </div>

            <div className="pt-3 border-t border-[#F0EEFF] flex items-center justify-between">
              <span className="text-[11px] text-[#69708A]">Available for authorized sharing</span>
              <button
                onClick={() => setLabShared(!labShared)}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{labShared ? "Shared with Physician" : "Share with Doctor"}</span>
              </button>
            </div>
          </div>

          {/* Workflow 4: Health Consent Request Modal Simulation */}
          <div className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#5B5BEF] font-bold tracking-wider">INCOMING CONSENT REQUEST</span>
                <h3 className="text-lg font-black text-[#10142F]">CityCare Hospital Requests Access</h3>
              </div>
              <span className="text-[10px] font-mono badge-indigo px-2 py-0.5 rounded font-bold">7 DAYS</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#69708A] uppercase font-bold block">PURPOSE</span>
                <span className="font-semibold text-[#10142F]">Continuity of care following outpatient consultation</span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#69708A] uppercase font-bold block">REQUESTED RECORDS</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5B5BEF] font-semibold text-[10.5px]">✓ Relevant diagnosis</span>
                  <span className="px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5B5BEF] font-semibold text-[10.5px]">✓ Current medication</span>
                  <span className="px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5B5BEF] font-semibold text-[10.5px]">✓ Relevant lab reports</span>
                </div>
              </div>

              <div className="text-[10.5px] text-[#69708A]">
                ○ Not requested: Full historical record, unrelated conditions, or financial data.
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0EEFF] flex items-center justify-between">
              <span className={`text-[11px] font-bold ${
                cityCareStatus === "APPROVED" ? "text-emerald-700" :
                cityCareStatus === "DECLINED" ? "text-rose-700" : "text-amber-700"
              }`}>
                Status: {cityCareStatus}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCityCareStatus("DECLINED")}
                  disabled={cityCareStatus !== "PENDING"}
                  className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-semibold text-rose-700 border border-rose-200"
                >
                  Decline
                </button>
                <button
                  onClick={() => setCityCareStatus("APPROVED")}
                  disabled={cityCareStatus !== "PENDING"}
                  className="px-4 py-1.5 rounded-xl btn-primary text-xs font-bold text-white shadow-sm"
                >
                  Approve Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal: Health Access History Audit Trail */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="max-w-xl w-full glass-card bg-white rounded-3xl p-6 sm:p-7 border border-[#DCD9FF] shadow-2xl text-left animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#5B5BEF] font-bold">AUDIT TRAIL</span>
                <h3 className="text-xl font-black text-[#10142F]">Health Access History</h3>
              </div>
              <button onClick={() => setHistoryOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-[#10142F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#10142F]">Metro Hospital</span>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded badge-lime font-bold">APPROVED</span>
                </div>
                <div className="text-[11px] text-[#69708A]">Oct 2, 2026 · 21:30 | Purpose: Continuity of care</div>
                <div className="text-[11px] text-[#10142F] font-mono">Disclosed: Diagnosis, Active Medications</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#10142F]">Dr. Mehta (Cardiology)</span>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">EXPIRED</span>
                </div>
                <div className="text-[11px] text-[#69708A]">Oct 1, 2026 · 14:10 | Purpose: Specialist referral</div>
                <div className="text-[11px] text-[#10142F] font-mono">Disclosed: Lab lipid panel</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900">Emergency Access Sessions</span>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">NONE RECORDED</span>
                </div>
                <div className="text-[11px] text-rose-800/80">No unannounced break-glass events occurred in this 30-day period.</div>
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
