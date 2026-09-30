"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RecordComparison, QualityIssue } from "@/lib/api";
import { 
  X, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  ShieldAlert, 
  Info, 
  Check, 
  FileText,
  Building2,
  Calendar,
  Layers
} from "lucide-react";

interface CompareRecordsModalProps {
  comparison: RecordComparison | null;
  onClose: () => void;
  onAcknowledge?: () => void;
  issues?: QualityIssue[];
}

export default function CompareRecordsModal({
  comparison,
  onClose,
  onAcknowledge,
  issues = [],
}: CompareRecordsModalProps) {
  if (!comparison) return null;

  const conflictCount = comparison.comparison_fields.filter((f) => f.is_conflict).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="max-w-3xl w-full glass-panel-glow rounded-3xl p-6 sm:p-8 border border-amber-500/30 text-left my-8 shadow-2xl relative"
        >
          {/* Top Bar */}
          <div className="flex items-start justify-between pb-4 border-b border-white/[0.08] gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded font-bold tracking-wider badge-amber flex items-center gap-1">
                  <Scale className="w-3 h-3 text-amber-400" />
                  CREDENTIAL INTELLIGENCE COMPARISON
                </span>
                {conflictCount > 0 ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold badge-rose flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {conflictCount} Conflict{conflictCount !== 1 ? "s" : ""} Flagged
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold badge-lime flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Consistent Records
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Record Comparison Audit
              </h2>
              <p className="text-xs text-[#8d8aab] mt-1">
                Side-by-side reconciliation between candidate records. Review discrepancies below.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/[0.06] transition-all"
              title="Close comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Policy Banner: Never declare fraudulent */}
          <div className="my-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-amber-300">Administrative Review Policy:</strong> Discrepancies are flagged exclusively for human review and administrative reconciliation. The system does not decide which record is correct, nor does it automatically declare any credential fraudulent.
            </div>
          </div>

          {/* Side-by-Side Comparison Table */}
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.09] bg-black/40">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-white/[0.03] border-b border-white/[0.08] p-3 text-xs font-mono font-bold text-[#a8a4c8]">
              <div className="col-span-4 uppercase tracking-wider text-[#7c78a0]">
                Attribute / Field
              </div>
              <div className="col-span-4 px-2">
                <span className="text-violet-300">RECORD A</span>
                <span className="block text-[10px] text-gray-400 font-normal truncate mt-0.5">
                  {comparison.record_a_title}
                </span>
              </div>
              <div className="col-span-4 px-2">
                <span className="text-teal-300">RECORD B</span>
                <span className="block text-[10px] text-gray-400 font-normal truncate mt-0.5">
                  {comparison.record_b_title}
                </span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-white/[0.05]">
              {comparison.comparison_fields.map((field, idx) => {
                const isConflict = field.is_conflict;
                const isMatch = field.is_match;

                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-12 p-3 text-xs transition-colors items-center ${
                      isConflict
                        ? "bg-amber-500/[0.07] border-l-2 border-l-amber-400"
                        : idx % 2 === 0
                        ? "bg-white/[0.01]"
                        : "bg-transparent"
                    }`}
                  >
                    <div className="col-span-4 pr-2">
                      <span className="font-semibold text-gray-300 block">
                        {field.field_name}
                      </span>
                      {isConflict && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 mt-0.5 font-bold">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Conflict Detected
                        </span>
                      )}
                      {isMatch && !isConflict && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400/80 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                          Matched
                        </span>
                      )}
                    </div>

                    <div className={`col-span-4 px-2 font-mono ${
                      isConflict ? "text-amber-200 font-bold" : "text-gray-200"
                    }`}>
                      {field.record_a_value || "—"}
                    </div>

                    <div className={`col-span-4 px-2 font-mono flex items-center justify-between ${
                      isConflict ? "text-amber-200 font-bold" : "text-gray-200"
                    }`}>
                      <span>{field.record_b_value || "—"}</span>
                      {isConflict && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shrink-0 ml-1">
                          ⚠ Diff
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flagged Review Action Callout */}
          {issues.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-2">
              <div className="text-xs font-mono uppercase text-[#7c78a0] font-bold">
                Recommended Actions:
              </div>
              {issues.map((iss, i) => (
                <div key={i} className="text-xs text-[#c4c0dc] flex items-start gap-2">
                  <span className="text-amber-400 font-bold">⚠</span>
                  <div>
                    <span>{iss.message}</span>
                    {iss.action && (
                      <span className="block text-[11px] font-mono text-teal-300 mt-0.5">
                        Action Required: {iss.action}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-gray-300 hover:text-white border border-white/[0.07] transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                onClick={() => {
                  if (onAcknowledge) onAcknowledge();
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-teal text-white font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Acknowledge & Mark Reviewed</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
