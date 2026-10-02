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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="max-w-3xl w-full glass-card bg-white rounded-3xl p-6 sm:p-8 border border-[#DCD9FF] text-left my-8 shadow-2xl relative"
        >
          {/* Top Bar */}
          <div className="flex items-start justify-between pb-4 border-b border-[#F0EEFF] gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded font-bold tracking-wider badge-amber flex items-center gap-1">
                  <Scale className="w-3 h-3 text-amber-600" />
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
              <h2 className="text-xl sm:text-2xl font-black text-[#10142F]">
                Record Comparison Audit
              </h2>
              <p className="text-xs text-[#69708A] mt-1">
                Side-by-side reconciliation between candidate records. Review discrepancies below.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-[#10142F] hover:bg-[#F0EEFF] transition-all"
              title="Close comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Policy Banner: Never declare fraudulent */}
          <div className="my-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-amber-800">Administrative Review Policy:</strong> Discrepancies are flagged exclusively for human review and administrative reconciliation. The system does not decide which record is correct, nor does it automatically declare any credential fraudulent.
            </div>
          </div>

          {/* Side-by-Side Comparison Table */}
          <div className="mt-5 overflow-hidden rounded-2xl border border-[#DCD9FF] bg-white shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-[#F7F8FC] border-b border-[#E8E6FF] p-3 text-xs font-mono font-bold text-[#69708A]">
              <div className="col-span-4 uppercase tracking-wider text-[#69708A]">
                Attribute / Field
              </div>
              <div className="col-span-4 px-2">
                <span className="text-[#5B5BEF] font-bold">RECORD A</span>
                <span className="block text-[10px] text-[#69708A] font-normal truncate mt-0.5">
                  {comparison.record_a_title}
                </span>
              </div>
              <div className="col-span-4 px-2">
                <span className="text-[#7A5AF8] font-bold">RECORD B</span>
                <span className="block text-[10px] text-[#69708A] font-normal truncate mt-0.5">
                  {comparison.record_b_title}
                </span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-[#F0EEFF]">
              {comparison.comparison_fields.map((field, idx) => {
                const isConflict = field.is_conflict;
                const isMatch = field.is_match;

                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-12 p-3 text-xs transition-colors items-center ${
                      isConflict
                        ? "bg-amber-50/70 border-l-2 border-l-amber-500"
                        : idx % 2 === 0
                        ? "bg-[#FAFAFE]"
                        : "bg-white"
                    }`}
                  >
                    <div className="col-span-4 pr-2">
                      <span className="font-semibold text-[#10142F] block">
                        {field.field_name}
                      </span>
                      {isConflict && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-700 mt-0.5 font-bold">
                          <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                          Conflict Detected
                        </span>
                      )}
                      {isMatch && !isConflict && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          Matched
                        </span>
                      )}
                    </div>

                    <div className={`col-span-4 px-2 font-mono ${
                      isConflict ? "text-amber-900 font-bold" : "text-[#10142F]"
                    }`}>
                      {field.record_a_value || "—"}
                    </div>

                    <div className={`col-span-4 px-2 font-mono flex items-center justify-between ${
                      isConflict ? "text-amber-900 font-bold" : "text-[#10142F]"
                    }`}>
                      <span>{field.record_b_value || "—"}</span>
                      {isConflict && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold border border-amber-300 shrink-0 ml-1">
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
            <div className="mt-4 p-4 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] space-y-2">
              <div className="text-xs font-mono uppercase text-[#69708A] font-bold">
                Recommended Actions:
              </div>
              {issues.map((iss, i) => (
                <div key={i} className="text-xs text-[#10142F] flex items-start gap-2">
                  <span className="text-amber-600 font-bold">⚠</span>
                  <div>
                    <span>{iss.message}</span>
                    {iss.action && (
                      <span className="block text-[11px] font-mono text-[#5B5BEF] font-semibold mt-0.5">
                        Action Required: {iss.action}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F0EEFF]">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-secondary text-xs font-bold text-[#10142F] border border-[#DCD9FF] transition-all flex items-center justify-center gap-2"
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
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-primary text-white font-bold text-xs shadow-md shadow-[#5B5BEF]/20 flex items-center justify-center gap-2"
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
