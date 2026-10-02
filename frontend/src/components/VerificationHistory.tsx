"use client";

import { CheckCircle2, Share2, Award, Clock, ArrowUpRight } from "lucide-react";

export default function VerificationHistory() {
  const events = [
    {
      date: "02 Oct 2026, 14:32",
      title: "Credential Verified",
      context: "Employer verification by TechNova HR",
      type: "VERIFIED",
      token: "TK-7F3A-2D9E",
      status: "Success ✓",
    },
    {
      date: "29 Sep 2026, 09:15",
      title: "Credential Shared",
      context: "Job application — Selective disclosure (Degree + CGPA)",
      type: "SHARED",
      token: "TK-5A2C-91B4",
      status: "Consent Active",
    },
    {
      date: "24 Sep 2026, 11:00",
      title: "Credential Issued",
      context: "D. J. Sanghvi College of Engineering • RSA-PSS Signed",
      type: "ISSUED",
      token: "LK-REG-8821",
      status: "Canonical Anchor",
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0EEFF] text-[#5B5BEF] text-[11px] font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Audit &amp; Provenance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10142F] tracking-tight">
            Immutable Verification History
          </h2>
          <p className="text-xs sm:text-sm text-[#69708A]">
            Every presentation, verification, and issuance is cryptographically journaled for candidate and employer auditing.
          </p>
        </div>

        {/* Compact History Ledger */}
        <div className="glass-card p-6 sm:p-8 border-[#DCD9FF] space-y-4">
          {events.map((evt, idx) => (
            <div
              key={evt.date}
              className="p-4 rounded-2xl bg-[#F7F8FC] border border-[#E8E6FF] hover:border-[#5B5BEF]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  evt.type === "VERIFIED"
                    ? "bg-[#ECFDF5] text-[#10B981]"
                    : evt.type === "SHARED"
                    ? "bg-[#F0EEFF] text-[#5B5BEF]"
                    : "bg-[#FFFBEB] text-[#D97706]"
                }`}>
                  {evt.type === "VERIFIED" && <CheckCircle2 className="w-5 h-5" />}
                  {evt.type === "SHARED" && <Share2 className="w-5 h-5" />}
                  {evt.type === "ISSUED" && <Award className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#10142F]">{evt.title}</h4>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-[#69708A] border border-[#DCD9FF]">
                      {evt.token}
                    </span>
                  </div>
                  <p className="text-xs text-[#69708A] mt-0.5">{evt.context}</p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E8E6FF] text-xs">
                <span className="font-mono text-[#69708A] text-[11px]">{evt.date}</span>
                <span className="font-bold text-[#10B981] sm:mt-0.5">{evt.status}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
