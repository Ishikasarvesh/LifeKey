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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`max-w-2xl w-full glass-card bg-white rounded-3xl p-6 sm:p-8 border text-left my-8 shadow-2xl relative ${
            isReviewRequired ? "border-amber-300" : "border-[#DCD9FF]"
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#F0EEFF] gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded font-bold tracking-wider badge-indigo flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#5B5BEF]" />
                  W3C AUTOMATED CREDENTIAL QUALITY CHECK
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#10142F]">
                {report.credential_title}
              </h2>
              <p className="text-xs text-[#69708A] mt-1 font-mono">
                {report.credential_id ? `ID: ${report.credential_id}` : "Pre-Issuance Evaluation"}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-[#10142F] hover:bg-[#F0EEFF] transition-all"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status & Cleanliness Score Banner */}
          <div className={`mt-5 p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            isReviewRequired
              ? "bg-amber-50 border-amber-200"
              : "bg-emerald-50 border-emerald-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isReviewRequired ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {isReviewRequired ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#69708A] block font-semibold">Overall Status</span>
                <span className={`text-base font-black tracking-wide ${
                  isReviewRequired ? "text-amber-800" : "text-emerald-800"
                }`}>
                  {isReviewRequired ? "STATUS: REVIEW REQUIRED" : "STATUS: NO QUALITY ISSUES DETECTED"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-[#69708A] block font-semibold">Cleanliness Score</span>
              <span className={`text-2xl font-black font-mono ${
                report.quality_score >= 90 ? "text-emerald-700" :
                report.quality_score >= 70 ? "text-amber-700" : "text-rose-700"
              }`}>
                {report.quality_score}%
              </span>
            </div>
          </div>

          {/* Section: Passed Checks */}
          <div className="mt-5 space-y-2">
            <div className="text-xs font-mono uppercase text-[#69708A] font-bold">
              Verified Core Standards:
            </div>
            <div className="grid grid-cols-1 gap-2">
              {report.passed_checks.map((checkText, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">
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
              <div className="text-xs font-mono uppercase text-amber-700 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Items Flagged for Human Administrative Review ({report.issues.length}):
              </div>
              <div className="space-y-2">
                {report.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-amber-600 font-bold text-sm mt-0.5">⚠</span>
                      <div>
                        <span className="font-semibold text-[#10142F] block">
                          {issue.message}
                        </span>
                        {issue.action && (
                          <span className="text-[11px] font-mono text-amber-800 block mt-0.5">
                            Recommended Action: {issue.action}
                          </span>
                        )}
                        {issue.field && (
                          <span className="text-[10px] font-mono text-[#69708A] block mt-0.5">
                            Field: <strong className="text-[#10142F]">{issue.field}</strong>
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
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F0EEFF]">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-secondary text-xs font-bold text-[#10142F] border border-[#DCD9FF] transition-all"
            >
              Close
            </button>

            <div className="w-full sm:w-auto flex items-center gap-3">
              {firstComparison && onOpenCompare && (
                <button
                  onClick={() => {
                    onOpenCompare(firstComparison);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-secondary text-[#5B5BEF] border-[#DCD9FF] font-bold text-xs shadow-sm flex items-center justify-center gap-2"
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
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-primary text-white font-bold text-xs shadow-md shadow-[#5B5BEF]/20 flex items-center justify-center gap-2"
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
