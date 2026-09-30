"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api, VerificationResult } from "@/lib/api";
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  KeyRound, 
  GraduationCap, 
  Lock, 
  Building2, 
  Calendar, 
  ArrowLeft,
  Share2,
  Cpu,
  Fingerprint,
  QrCode,
  Scale,
  Brain
} from "lucide-react";
import CompareRecordsModal from "@/components/CompareRecordsModal";
import { RecordComparison } from "@/lib/api";

export default function VerifyTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);
  const [comparisonModalData, setComparisonModalData] = useState<RecordComparison | null>(null);

  useEffect(() => {
    async function runVerification() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.verifyByToken(token);
        setResult(res);
      } catch (err: any) {
        setError(err.message || "Invalid or expired verification presentation token");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      runVerification();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#06050f] text-[#e2e0f0] flex flex-col selection:bg-violet-700 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8d8aab] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to LIFEKEY Overview</span>
          </Link>
        </div>

        {loading ? (
          <div className="glass-panel-glow rounded-3xl p-12 text-center border border-violet-500/25">
            <div className="w-14 h-14 border-4 border-violet-500/20 border-t-violet-400 rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white">
              Resolving Cryptographic Presentation...
            </h2>
            <p className="text-xs text-[#8d8aab] mt-2 font-mono">
              Verifying RSA-2048 Digital Signature • SHA-256 Integrity • Revocation Registry
            </p>
          </div>
        ) : error ? (
          <div className="glass-panel-glow rounded-3xl p-10 text-center border border-rose-500/40">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-rose-400">
              Verification Failed / Invalid Token
            </h2>
            <p className="text-sm text-gray-300 mt-2 max-w-md mx-auto">
              {error}
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/verify/lifekey_demo_token_xyz890"
                className="px-5 py-2.5 rounded-xl btn-violet text-white font-bold text-xs shadow-lg transition-all"
              >
                Test Working Demo Token
              </Link>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-6 animate-fade-up">
            {/* Top Seal */}
            <div className={`p-8 rounded-3xl glass-panel-glow border text-center transition-all ${
              result.overall_status === "VALID"
                ? "border-emerald-500/40 shadow-emerald-500/10"
                : result.overall_status === "REVOKED"
                ? "border-amber-500/40 shadow-amber-500/10"
                : "border-rose-500/40 shadow-rose-500/10"
            }`}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 p-[2px] transition-transform hover:scale-105">
                {result.overall_status === "VALID" ? (
                  <div className="w-full h-full rounded-[22px] bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                ) : result.overall_status === "REVOKED" ? (
                  <div className="w-full h-full rounded-[22px] bg-amber-500/15 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/20">
                    <AlertTriangle className="w-10 h-10" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-[22px] bg-rose-500/15 border-2 border-rose-400 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/20">
                    <XCircle className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono uppercase font-bold tracking-widest mb-2 border bg-black/40">
                {result.overall_status === "VALID" ? (
                  <span className="text-emerald-400">✓ W3C CRYPTOGRAPHIC SEAL: AUTHENTIC & VALID</span>
                ) : result.overall_status === "REVOKED" ? (
                  <span className="text-amber-400">⚠️ CREDENTIAL WITHDRAWN: REVOKED BY ISSUER</span>
                ) : (
                  <span className="text-rose-400">❌ VERIFICATION REJECTED: INTEGRITY FAILURE</span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
                {result.candidate_name || "Verified Candidate"}
              </h1>
              <p className="text-sm text-[#8d8aab] mt-1 max-w-xl mx-auto">
                {result.reason}
              </p>
            </div>

            {/* Cryptographic Trust Check Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl glass-panel border border-white/[0.08]">
                <div className="text-[11px] font-mono text-[#7c78a0]">1. DIGITAL SIGNATURE</div>
                <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                  {result.signature_valid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">RSA-2048 Valid</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-400">Invalid Signature</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-white/[0.08]">
                <div className="text-[11px] font-mono text-[#7c78a0]">2. DATA INTEGRITY</div>
                <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                  {result.integrity_valid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">SHA-256 Match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-400">Tampered Payload</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-white/[0.08]">
                <div className="text-[11px] font-mono text-[#7c78a0]">3. REVOCATION REGISTRY</div>
                <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                  {result.revocation_status === "ACTIVE" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Active (Not Revoked)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300">Revoked Status</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-panel border border-white/[0.08]">
                <div className="text-[11px] font-mono text-[#7c78a0]">4. SELECTIVE CONSENT</div>
                <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                  {result.consent_valid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Consent Granted</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-400">Consent Denied</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Credential Intelligence & Quality Check Section */}
            <div className={`p-5 rounded-3xl glass-panel border ${
              result.quality_status === "review_required" ? "border-amber-500/30 bg-amber-500/[0.03]" : "border-emerald-500/20"
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-teal-400" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Credential Intelligence & Duplicate Check
                  </h4>
                </div>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                  result.quality_status === "review_required" ? "badge-amber" : "badge-lime"
                }`}>
                  {result.quality_status === "review_required" ? "⚠ REVIEW REQUIRED" : "✓ ZERO DISCREPANCIES DETECTED"}
                </span>
              </div>

              {result.quality_issues && result.quality_issues.length > 0 ? (
                <div className="mt-3 space-y-2">
                  <div className="text-xs text-amber-200">
                    <strong>Advisory Flag:</strong> One or more cross-record items require administrative review before confirmation.
                  </div>
                  {result.quality_issues.map((iss, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-100 flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">⚠</span>
                        <div>
                          <span>{iss.message}</span>
                          {iss.action && (
                            <span className="block text-[11px] font-mono text-amber-300 mt-0.5">
                              Action: {iss.action}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded badge-amber shrink-0">
                        {iss.type.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}

                  {result.quality_comparisons && result.quality_comparisons.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setComparisonModalData(result.quality_comparisons![0])}
                      className="mt-2 px-4 py-2 rounded-xl btn-teal text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Compare Flagged Records Side-by-Side</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified no exact duplicates, textual similarities, or conflicting graduation years across candidate credentials.</span>
                </div>
              )}
            </div>

            {/* Verified Claims Card */}
            {result.credential_data && (
              <div className="p-6 rounded-3xl glass-panel border border-white/[0.08]">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-teal-400" />
                    <h3 className="text-lg font-bold text-white">
                      Verified Disclosed Claims
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-teal-400 uppercase">
                    Issuer: {result.institution_name}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {result.credential_data.title && (
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="text-xs text-[#7c78a0]">Award Title</div>
                      <div className="font-bold text-white mt-1">
                        {result.credential_data.title}
                      </div>
                    </div>
                  )}

                  {result.credential_data.major && (
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="text-xs text-[#7c78a0]">Academic Major</div>
                      <div className="font-bold text-white mt-1">
                        {result.credential_data.major}
                      </div>
                    </div>
                  )}

                  {result.credential_data.cgpa && (
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="text-xs text-[#7c78a0]">CGPA Performance</div>
                      <div className="font-bold text-teal-400 mt-1">
                        {result.credential_data.cgpa} / {result.credential_data.scale || 10.0}
                      </div>
                    </div>
                  )}

                  {result.credential_data.graduation_year && (
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="text-xs text-[#7c78a0]">Graduation Year</div>
                      <div className="font-bold text-white mt-1">
                        {result.credential_data.graduation_year}
                      </div>
                    </div>
                  )}

                  {result.credential_data.skills && Array.isArray(result.credential_data.skills) && (
                    <div className="sm:col-span-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="text-xs text-[#7c78a0] mb-2">Verified Competencies</div>
                      <div className="flex flex-wrap gap-2">
                        {result.credential_data.skills.map((skill: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="px-3 py-1 rounded-lg badge-teal text-xs font-medium"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Raw JSON toggle */}
                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setShowRawJson(!showRawJson)}
                    className="text-xs font-mono text-teal-400 hover:underline flex items-center gap-1.5"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{showRawJson ? "Hide Raw Cryptographic Payload" : "Inspect Raw Cryptographic Claims JSON"}</span>
                  </button>

                  {showRawJson && (
                    <pre className="mt-3 p-4 rounded-2xl bg-black/60 border border-white/[0.08] text-[11px] font-mono text-teal-300 overflow-x-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* ── Modal: Side-by-Side Record Comparison ──── */}
        {comparisonModalData && (
          <CompareRecordsModal
            comparison={comparisonModalData}
            onClose={() => setComparisonModalData(null)}
            issues={result?.quality_issues || []}
          />
        )}
      </main>
    </div>
  );
}
