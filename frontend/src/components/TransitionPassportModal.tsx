"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Briefcase, Calendar, Clock, ShieldCheck, CheckCircle2,
  AlertTriangle, ArrowRight, Lock, Eye, Building2, UserCheck,
  FileCheck2, Shield, Info, Sparkles, Check, ChevronRight, Share2
} from "lucide-react";

interface TransitionPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
}

export default function TransitionPassportModal({
  isOpen,
  onClose,
  onApprove,
  onReject,
  status
}: TransitionPassportModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onApprove();
    }, 700);
  };

  const handleReject = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onReject();
    }, 500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="max-w-3xl w-full glass-card bg-white rounded-3xl p-6 sm:p-8 border border-[#DCD9FF] text-left my-8 shadow-2xl relative"
        >
          {/* Top Header */}
          <div className="flex items-start justify-between pb-5 border-b border-[#F0EEFF] gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold tracking-wider badge-indigo flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-[#5B5BEF]" />
                  PURPOSE-SPECIFIC TRANSITION PASSPORT
                </span>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                  TIME-LIMITED · EXPIRES OCT 10, 2026
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#10142F] tracking-tight">
                Starting My First Job
              </h2>
              <p className="text-xs sm:text-sm text-[#69708A] mt-1">
                Review exactly what <strong className="text-[#10142F]">TechNova HR</strong> is requesting before sharing. Only the required proof bundle will be transmitted.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-[#10142F] hover:bg-[#F0EEFF] transition-all"
              title="Close passport"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Requester & Purpose Summary Bar */}
          <div className="my-5 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F7F8FC] border border-[#E8E6FF]">
            <div>
              <span className="text-[10px] font-mono text-[#69708A] uppercase font-bold block">REQUESTER</span>
              <span className="text-xs font-bold text-[#10142F] flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-[#5B5BEF]" /> TechNova HR
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#69708A] uppercase font-bold block">PURPOSE</span>
              <span className="text-xs font-semibold text-[#10142F] mt-0.5 block truncate">Employment onboarding</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#69708A] uppercase font-bold block">REQUEST DATE</span>
              <span className="text-xs font-semibold text-[#10142F] mt-0.5 block">Oct 2, 2026</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#69708A] uppercase font-bold block">EXPIRATION</span>
              <span className="text-xs font-bold text-amber-700 mt-0.5 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" /> Oct 10, 2026
              </span>
            </div>
          </div>

          {/* Section: Data Minimization Audit Checklist */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#69708A] font-bold tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5B5BEF]" />
                Data Minimization Scope
              </span>
              <span className="text-[11px] text-[#5B5BEF] font-semibold">Strict Purpose Bound</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#DCD9FF] space-y-2">
                <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold block">
                  ✓ REQUESTED INFORMATION (4 FIELDS)
                </span>
                <ul className="space-y-1.5 text-xs text-[#10142F]">
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span><strong>Identity:</strong> Holder Legal Name & Citizen ID</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span><strong>Education:</strong> B.Tech Degree & AI/ML Diploma</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span><strong>Skills:</strong> Verified Applied Python Proficiency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span><strong>Employment:</strong> Onboarding Eligibility Attestation</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFAFE] border border-[#E8E6FF] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#69708A] font-bold block">
                  ○ NOT REQUESTED / PROTECTED (EXCLUDED)
                </span>
                <ul className="space-y-1.5 text-xs text-[#69708A]">
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">○</span>
                    <span>Government National ID (Aadhaar/PAN)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">○</span>
                    <span>Medical or Health Records</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">○</span>
                    <span>Personal Bank or Financial Information</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">○</span>
                    <span>Family / Demographic Records</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section: Credentials Included in Passport */}
          <div className="mt-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#69708A] font-bold tracking-wider">
                Included Verifiable Credentials (3)
              </span>
              <span className="text-[11px] font-mono text-[#69708A]">W3C JSON-LD Proofs</span>
            </div>

            <div className="space-y-2">
              {/* Credential 1 */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#DCD9FF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#10142F]">B.Tech in Information Technology</span>
                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded badge-lime font-bold">ACTIVE</span>
                  </div>
                  <div className="text-[11px] text-[#69708A] mt-0.5">
                    Issuer: D. J. Sanghvi College of Engineering · CGPA: 8.85
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10.5px] font-mono">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-semibold">
                    ✓ RSA-2048 Valid
                  </span>
                  <span className="text-[#5B5BEF] bg-[#F0EEFF] px-2 py-1 rounded border border-[#DCD9FF] font-semibold">
                    ✓ Issuer Verified
                  </span>
                </div>
              </div>

              {/* Credential 2 */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#DCD9FF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#10142F]">Diploma in Artificial Intelligence & Machine Learning</span>
                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded badge-lime font-bold">ACTIVE</span>
                  </div>
                  <div className="text-[11px] text-[#69708A] mt-0.5">
                    Issuer: ABC Polytechnic Institute · Grade: First Class Distinction
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10.5px] font-mono">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-semibold">
                    ✓ Signature Valid
                  </span>
                  <span className="text-[#5B5BEF] bg-[#F0EEFF] px-2 py-1 rounded border border-[#DCD9FF] font-semibold">
                    ✓ Issuer Verified
                  </span>
                </div>
              </div>

              {/* Credential 3 (With Flag) */}
              <div className="p-3.5 rounded-2xl bg-white border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#10142F]">Python Certificate</span>
                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded badge-amber font-bold flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Duplicate detected
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    Issuer: TechNova Academy · Signal: Review required (Curriculum overlap)
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10.5px] font-mono">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-semibold">
                    ✓ Signature Valid
                  </span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 font-semibold">
                    ⚠ Credential Intel QA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Information Panel: LIFEKEY PROTECTED */}
          <div className="mt-5 p-4 rounded-2xl bg-[#F0EEFF]/50 border border-[#DCD9FF] space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-[#5B5BEF] font-bold">
              <Shield className="w-3.5 h-3.5 text-[#5B5BEF]" />
              LIFEKEY PROTECTED ARCHITECTURE
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#10142F] font-medium">
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Issuer verified</span>
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Credential integrity verified</span>
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Purpose specified</span>
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Consent required</span>
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Access expires automatically</span>
              <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-600" /> Access logged permanently</span>
            </div>
            <p className="text-[10.5px] text-[#69708A] pt-1 border-t border-[#DCD9FF]/60">
              Only the information listed above will be shared. LIFEKEY does not store an unencrypted central dossier.
            </p>
          </div>

          {/* Action Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F0EEFF]">
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-secondary text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
            >
              Reject Request
            </button>

            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl btn-secondary text-xs font-semibold text-[#10142F] border border-[#DCD9FF]"
              >
                Close
              </button>

              <button
                onClick={handleApprove}
                disabled={isProcessing || status === "APPROVED"}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-primary text-white font-bold text-xs shadow-md shadow-[#5B5BEF]/20 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : status === "APPROVED" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Approved & Shared</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Approve & Share Passport</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
