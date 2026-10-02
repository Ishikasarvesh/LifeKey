"use client";

import { useState } from "react";
import {
  Share2,
  Clock,
  UserCheck,
  Briefcase,
  Copy,
  Check,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react";

export default function PurposeBoundSharing() {
  const [who, setWho] = useState("Acme Hiring Team");
  const [why, setWhy] = useState("Job Application — Software Engineer");
  const [untilWhen, setUntilWhen] = useState("30 Apr 2026");
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
    degree: true,
    major: true,
    cgpa: true,
    institution: true,
    home_address: false,
    phone_number: false,
    date_of_birth: false,
  });

  const [generatedToken, setGeneratedToken] = useState("TK-7F3A-2D9E");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleField = (field: string) => {
    setSelectedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleGenerateShare = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randomHex2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      setGeneratedToken(`TK-${randomHex}-${randomHex2}`);
      setIsGenerating(false);
    }, 600);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-[#F7F8FC] border-y border-[#E8E6FF] relative overflow-hidden">
      {/* Background Soft Lavender Blobs */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-[#E8E6FF]/60 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#F0EEFF] rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#DCD9FF] text-[11px] font-bold text-[#5B5BEF] uppercase tracking-wider shadow-sm">
            <Share2 className="w-3.5 h-3.5" />
            <span>Privacy-First Sharing</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#10142F] tracking-tight leading-tight">
            Purpose-bound sharing. <br />
            Made simple.
          </h2>

          <p className="text-base sm:text-lg text-[#69708A] font-normal">
            Control exactly what to share, with whom, and for how long. Say goodbye to blindly emailing entire unredacted PDF transcripts.
          </p>
        </div>

        {/* Interactive Dual-Panel Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Share Credential Interactive Form / Modal (7 cols) */}
          <div className="lg:col-span-7 glass-card p-7 sm:p-9 shadow-xl">
            <div className="flex items-center justify-between pb-6 border-b border-[#F0EEFF]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0EEFF] flex items-center justify-center text-[#5B5BEF]">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#10142F]">SHARE CREDENTIAL</h3>
                  <p className="text-xs text-[#69708A]">Create an expiring, purpose-bound presentation</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
                Zero-Knowledge Ready
              </span>
            </div>

            {/* The 4 Principles Form */}
            <div className="mt-6 space-y-5">
              
              {/* WHO */}
              <div>
                <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#5B5BEF]" />
                  <span>Who (Recipient)</span>
                </label>
                <input
                  type="text"
                  value={who}
                  onChange={(e) => setWho(e.target.value)}
                  className="glass-input w-full text-sm font-semibold"
                  placeholder="e.g. Acme Hiring Team"
                />
              </div>

              {/* WHY */}
              <div>
                <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#5B5BEF]" />
                  <span>Why (Purpose)</span>
                </label>
                <input
                  type="text"
                  value={why}
                  onChange={(e) => setWhy(e.target.value)}
                  className="glass-input w-full text-sm font-semibold"
                  placeholder="e.g. Job Application"
                />
              </div>

              {/* WHAT (Selective Disclosure Field Checklist) */}
              <div>
                <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#5B5BEF]" />
                    <span>What (Selected Fields)</span>
                  </span>
                  <span className="text-[11px] text-[#69708A] font-normal lowercase">
                    toggle to redact sensitive fields
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { key: "degree", label: "Degree Title", safe: true },
                    { key: "major", label: "Major / Specialization", safe: true },
                    { key: "cgpa", label: "CGPA (8.85)", safe: true },
                    { key: "institution", label: "Institution Name", safe: true },
                    { key: "home_address", label: "Home Address", safe: false },
                    { key: "phone_number", label: "Phone Number", safe: false },
                    { key: "date_of_birth", label: "Date of Birth", safe: false },
                  ].map((field) => {
                    const isSelected = selectedFields[field.key];
                    return (
                      <button
                        key={field.key}
                        type="button"
                        onClick={() => toggleField(field.key)}
                        className={`p-2.5 rounded-xl text-left border text-xs font-semibold flex items-center justify-between transition-all ${
                          isSelected
                            ? field.safe
                              ? "bg-[#F0EEFF] border-[#5B5BEF] text-[#5B5BEF]"
                              : "bg-amber-50 border-amber-300 text-amber-900"
                            : "bg-white border-[#E8E6FF] text-[#9499B0] line-through"
                        }`}
                      >
                        <span className="truncate">{field.label}</span>
                        {isSelected ? (
                          <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 flex-shrink-0 text-[#9499B0]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* UNTIL WHEN */}
              <div>
                <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#5B5BEF]" />
                  <span>Until When (Consent Expiry)</span>
                </label>
                <input
                  type="text"
                  value={untilWhen}
                  onChange={(e) => setUntilWhen(e.target.value)}
                  className="glass-input w-full text-sm font-semibold"
                  placeholder="e.g. 30 Apr 2026"
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateShare}
                  disabled={isGenerating}
                  className="btn-primary w-full py-3.5 text-sm font-bold shadow-lg"
                >
                  {isGenerating ? (
                    <span>Generating Cryptographic Token...</span>
                  ) : (
                    <>
                      <span>Generate Purpose-Bound Share</span>
                      <Sparkles className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Right Panel: Selective Disclosure Token Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Token Output Card */}
            <div className="glass-card p-7 border-[#DCD9FF] relative overflow-hidden">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F0EEFF] text-[#5B5BEF]">
                Generated Verification Token
              </span>

              <h4 className="text-xl font-extrabold text-[#10142F] mt-3">
                Selective Disclosure Token
              </h4>

              <p className="text-xs text-[#69708A] mt-1">
                Only recipient <strong>{who}</strong> can verify the disclosed fields before <strong>{untilWhen}</strong>.
              </p>

              {/* Token Display Box */}
              <div className="mt-5 p-4 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-[#69708A] block">VERIFICATION TOKEN</span>
                  <span className="font-mono text-xl font-black text-[#5B5BEF] tracking-wider">
                    {generatedToken}
                  </span>
                </div>

                <button
                  onClick={copyToClipboard}
                  className="p-2.5 rounded-xl bg-white border border-[#DCD9FF] text-[#5B5BEF] hover:bg-[#F0EEFF] transition-all shadow-sm"
                  title="Copy Token"
                >
                  {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Over-Share Shield Protection Callout */}
              <div className="mt-5 p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 text-[#10B981]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#10142F] block">Privacy Shield Active</span>
                  <p className="text-[11px] text-[#065F46] mt-0.5 leading-relaxed">
                    Unchecked personal fields (Address, Phone, DoB) are cryptographically excised. The employer never receives raw data they did not request.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Summary Pill Checklist */}
            <div className="p-5 rounded-3xl bg-white border border-[#DCD9FF] space-y-2.5 text-xs text-[#69708A]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#5B5BEF] font-mono">WHO:</span>
                <span className="text-[#10142F] font-semibold">{who}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#5B5BEF] font-mono">WHY:</span>
                <span className="text-[#10142F] font-semibold truncate">{why}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#5B5BEF] font-mono">EXPIRY:</span>
                <span className="text-[#10142F] font-semibold">{untilWhen}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
