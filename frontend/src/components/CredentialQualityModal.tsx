"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CredentialQualityReport, RecordComparison } from "@/lib/api";
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Scale, 
  ArrowRight, 
  Sparkles,
  Layers,
  Building2,
  Calendar,
  Eye,
  FileCheck2
} from "lucide-react";

interface CredentialQualityModalProps {
  report: CredentialQualityReport | null;
  onClose: () => void;
  onOpenCompare?: (comparison: RecordComparison) => void;
  onReviewCredential?: () => void;
}

export default function CredentialQualityModal({
  report,
  onClose,
  onOpenCompare,
  onReviewCredential,
}: CredentialQualityModalProps) {
  if (!report) return null;

  const isReviewRequired = report.status === "review_required" || report.issues.length > 0;
  const firstComparison = report.comparisons && report.comparisons.length > 0 ? report.comparisons[0] : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`max-w-2xl w-full glass-panel-glow rounded-3xl p-6 sm:p-8 border text-left my-8 shadow-2xl relative ${
            isReviewRequired ? "border-amber-500/35" : "border-emerald-500/35"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/[0.08] gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded font-bold tracking-wider badge-violet flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-violet-400" />
                  W3C AUTOMATED CREDENTIAL QUALITY CHECK
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {report.credential_title}
              </h2>
              <p className="text-xs text-[#8d8aab] mt-1 font-mono">
                {report.credential_id ? `ID: ${report.credential_id}` : "Pre-Issuance Evaluation"}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/[0.06] transition-all"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status & Cleanliness Score Banner */}
          <div className={`mt-5 p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            isReviewRequired
              ? "bg-amber-500/10 border-amber-500/30"
              : "bg-emerald-500/10 border-emerald-500/30"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isReviewRequired ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"
              }`}>
                {isReviewRequired ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7c78a0] block">Overall Status</span>
                <span className={`text-base font-black tracking-wide ${
                  isReviewRequired ? "text-amber-300" : "text-emerald-300"
                }`}>
                  {isReviewRequired ? "STATUS: REVIEW REQUIRED" : "STATUS: NO QUALITY ISSUES DETECTED"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-[#7c78a0] block">Cleanliness Score</span>
              <span className={`text-2xl font-black font-mono ${
                report.quality_score >= 90 ? "text-emerald-400" :
                report.quality_score >= 70 ? "text-amber-400" : "text-rose-400"
              }`}>
                {report.quality_score}%
              </span>
            </div>
          </div>

          {/* Section: Passed Checks */}
          <div className="mt-5 space-y-2">
            <div className="text-xs font-mono uppercase text-[#7c78a0] font-bold">
              Verified Core Standards:
            </div>
            <div className="grid grid-cols-1 gap-2">
              {report.passed_checks.map((checkText, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/15 text-xs text-emerald-200/90 flex items-center gap-2.5"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </span>
                  <span>{checkText}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Warnings / Flagged Items (if any) */}
          {isReviewRequired && report.issues.length > 0 && (
            <div className="mt-5 space-y-2">
              <div className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Items Flagged for Human Administrative Review ({report.issues.length}):
              </div>
              <div className="space-y-2">
                {report.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-500/[0.08] border border-amber-500/25 text-xs text-amber-100 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-amber-400 font-bold text-sm mt-0.5">⚠</span>
                      <div>
                        <span className="font-semibold text-white block">
                          {issue.message}
                        </span>
                        {issue.action && (
                          <span className="text-[11px] font-mono text-amber-300/80 block mt-0.5">
                            Recommended Action: {issue.action}
                          </span>
                        )}
                        {issue.field && (
                          <span className="text-[10px] font-mono text-[#a8a4c8] block mt-0.5">
                            Field: <strong className="text-white">{issue.field}</strong>
                            {issue.value_1 && issue.value_2 ? ` (${issue.value_1} vs ${issue.value_2})` : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold badge-amber shrink-0">
                      {issue.type.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-gray-300 hover:text-white border border-white/[0.07] transition-all"
            >
              Close
            </button>

            <div className="w-full sm:w-auto flex items-center gap-3">
              {firstComparison && onOpenCompare && (
                <button
                  onClick={() => {
                    onOpenCompare(firstComparison);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-teal text-white font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                >
                  <Scale className="w-4 h-4" />
                  <span>Compare Records</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (onReviewCredential) onReviewCredential();
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-violet text-white font-bold text-xs shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Review Credential</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
