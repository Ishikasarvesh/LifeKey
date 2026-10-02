"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, Briefcase, GraduationCap, Building2,
  Clock, ShieldCheck, Check, Calendar, PlusCircle
} from "lucide-react";

interface CreatePassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (passport: any) => void;
}

export default function CreatePassportModal({
  isOpen,
  onClose,
  onCreate
}: CreatePassportModalProps) {
  const [eventType, setEventType] = useState("START_JOB");
  const [targetOrg, setTargetOrg] = useState("TechNova HR");
  const [purpose, setPurpose] = useState("Employment onboarding and identity verification");
  const [expiryDays, setExpiryDays] = useState("7");
  const [selectedCreds, setSelectedCreds] = useState<string[]>([
    "btech_degree",
    "aiml_diploma",
    "python_cert"
  ]);

  if (!isOpen) return null;

  const toggleCred = (id: string) => {
    setSelectedCreds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays));

    onCreate({
      id: "pass_" + Date.now(),
      title: eventType === "START_JOB" ? "Starting My First Job" :
             eventType === "UNIVERSITY" ? "University Admission" :
             eventType === "HEALTH" ? "Hospital Transfer (Sandbox)" :
             eventType === "FINANCE" ? "Financial Service Application (Sandbox)" : "Insurance Claim (Sandbox)",
      icon: eventType === "START_JOB" ? "💼" :
            eventType === "UNIVERSITY" ? "🎓" :
            eventType === "HEALTH" ? "🏥" :
            eventType === "FINANCE" ? "💰" : "🛡️",
      requestedBy: targetOrg,
      purpose,
      status: "APPROVED",
      expires: expiryDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      includedCount: selectedCreds.length,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="max-w-xl w-full glass-card bg-white rounded-3xl p-6 sm:p-7 border border-[#DCD9FF] text-left my-8 shadow-2xl relative"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EEFF]">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#5B5BEF] font-bold">
                <Sparkles className="w-3 h-3" />
                CREATE TRANSITION PASSPORT
              </div>
              <h3 className="text-xl font-black text-[#10142F] mt-0.5">
                Prepare Life Event Bundle
              </h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-[#10142F] hover:bg-[#F0EEFF]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#69708A] mb-1.5">Life Event Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: "START_JOB", label: "💼 Start Job" },
                  { id: "UNIVERSITY", label: "🎓 Start University" },
                  { id: "HEALTH", label: "🏥 Change Hospital" },
                  { id: "FINANCE", label: "💰 Financial Service" },
                  { id: "INSURANCE", label: "🛡️ Insurance Claim" },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEventType(item.id)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                      eventType === item.id
                        ? "bg-[#F0EEFF] border-[#5B5BEF] text-[#5B5BEF]"
                        : "bg-[#FAFAFE] border-[#E8E6FF] text-[#69708A] hover:border-[#DCD9FF]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#69708A] mb-1.5">Recipient Organization</label>
              <input
                type="text"
                required
                value={targetOrg}
                onChange={e => setTargetOrg(e.target.value)}
                placeholder="e.g. TechNova HR / CityCare Hospital / Demo Bank"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm bg-white text-[#10142F] border-[#DCD9FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#69708A] mb-1.5">Specific Purpose Statement</label>
              <input
                type="text"
                required
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder="e.g. Onboarding verification"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm bg-white text-[#10142F] border-[#DCD9FF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#69708A] mb-1.5">Access Duration (Expiry)</label>
                <select
                  value={expiryDays}
                  onChange={e => setExpiryDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm bg-white text-[#10142F] border-[#DCD9FF]"
                >
                  <option value="1">24 Hours (Immediate)</option>
                  <option value="3">3 Days</option>
                  <option value="7">7 Days (Standard)</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days (Maximum)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#69708A] mb-1.5">Data Minimization</label>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Only chosen proofs are shared. No extra data.</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#69708A] mb-1.5">Select Verifiable Credentials to Include</label>
              <div className="space-y-2">
                {[
                  { id: "btech_degree", title: "B.Tech in Information Technology", issuer: "DJSCOE", valid: true },
                  { id: "aiml_diploma", title: "Diploma in AI & Machine Learning", issuer: "ABC Poly", valid: true },
                  { id: "python_cert", title: "Python Certificate", issuer: "TechNova", valid: true },
                ].map(cred => {
                  const isChecked = selectedCreds.includes(cred.id);
                  return (
                    <button
                      key={cred.id}
                      type="button"
                      onClick={() => toggleCred(cred.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-[#F0EEFF] border-[#5B5BEF] text-[#10142F]"
                          : "bg-white border-[#E8E6FF] text-[#69708A]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? "bg-[#5B5BEF] border-[#5B5BEF] text-white" : "border-slate-300 bg-white"
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{cred.title}</div>
                          <div className="text-[10px] text-[#69708A]">{cred.issuer}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ RSA-2048
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#F0EEFF]">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold text-[#10142F] border border-[#DCD9FF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md shadow-[#5B5BEF]/20 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Passport</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
