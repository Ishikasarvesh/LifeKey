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
  Brain,
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
    <div className="min-h-screen bg-[#F7F8FC] text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#69708A] hover:text-[#5B5BEF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to LifeKey Overview</span>
          </Link>
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center border-[#DCD9FF] shadow-xl">
            <div className="w-14 h-14 border-4 border-[#E8E6FF] border-t-[#5B5BEF] rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#10142F]">
              Resolving Cryptographic Presentation...
            </h2>
            <p className="text-xs text-[#69708A] mt-2 font-mono">
              Verifying RSA-2048 Digital Signature • SHA-256 Integrity • Revocation Registry
            </p>
          </div>
        ) : error ? (
          <div className="glass-card p-10 text-center border-[#FECACA] bg-[#FEF2F2]/80 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#FEE2E2] border border-[#FECACA] text-[#EF4444] flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#DC2626]">
              Verification Failed / Invalid Token
            </h2>
            <p className="text-sm text-[#B91C1C] mt-2 max-w-md mx-auto">
              {error}
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/verify/lifekey_demo_token_xyz890"
                className="btn-primary text-xs"
              >
                Test Working Demo Token
              </Link>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-6 animate-fade-up">
            {/* Top Seal Card */}
            <div
              className={`p-8 rounded-[32px] glass-card border text-center transition-all ${
                result.overall_status === "VALID"
                  ? "border-[#A7F3D0] bg-white shadow-[0_20px_45px_-12px_rgba(16,185,129,0.12)]"
                  : result.overall_status === "REVOKED"
                  ? "border-[#FDE68A] bg-white shadow-[0_20px_45px_-12px_rgba(245,158,11,0.12)]"
                  : "border-[#FECACA] bg-white shadow-[0_20px_45px_-12px_rgba(239,68,68,0.12)]"
              }`}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 p-[2px] transition-transform hover:scale-105">
                {result.overall_status === "VALID" ? (
                  <div className="w-full h-full rounded-[22px] bg-[#ECFDF5] border-2 border-[#10B981] flex items-center justify-center text-[#10B981] shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                ) : result.overall_status === "REVOKED" ? (
                  <div className="w-full h-full rounded-[22px] bg-[#FFFBEB] border-2 border-[#F59E0B] flex items-center justify-center text-[#F59E0B] shadow-lg shadow-amber-500/20">
                    <AlertTriangle className="w-10 h-10" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-[22px] bg-[#FEF2F2] border-2 border-[#EF4444] flex items-center justify-center text-[#EF4444] shadow-lg shadow-red-500/20">
                    <XCircle className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="inline-block px-3.5 py-1 rounded-full text-xs font-mono uppercase font-bold tracking-wider mb-2 border">
                {result.overall_status === "VALID" ? (
                  <span className="text-[#059669] bg-[#ECFDF5] border-[#A7F3D0] px-3 py-1 rounded-full">
                    ✓ CRYPTOGRAPHIC SEAL: AUTHENTIC &amp; VALID
                  </span>
                ) : result.overall_status === "REVOKED" ? (
                  <span className="text-[#D97706] bg-[#FFFBEB] border-[#FDE68A] px-3 py-1 rounded-full">
                    ⚠️ CREDENTIAL WITHDRAWN: REVOKED BY ISSUER
                  </span>
                ) : (
                  <span className="text-[#DC2626] bg-[#FEF2F2] border-[#FECACA] px-3 py-1 rounded-full">
                    ❌ VERIFICATION REJECTED: INTEGRITY FAILURE
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10142F] mt-2">
                {result.candidate_name || "Verified Candidate"}
              </h1>
              <p className="text-sm text-[#69708A] mt-1 max-w-xl mx-auto">
                {result.reason}
              </p>
            </div>

            {/* Cryptographic Trust Check Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl glass-card">
                <div className="text-[10.5px] font-mono font-bold text-[#69708A]">1. DIGITAL SIGNATURE</div>
                <div className="text-sm font-bold text-[#10142F] mt-1 flex items-center gap-1.5">
                  {result.signature_valid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span className="text-[#059669]">RSA-PSS Valid</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-[#EF4444]" />
                      <span className="text-[#DC2626]">Invalid Signature</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-card">
                <div className="text-[10.5px] font-mono font-bold text-[#69708A]">2. DATA INTEGRITY</div>
                <div className="text-sm font-bold text-[#10142F] mt-1 flex items-center gap-1.5">
                  {result.integrity_valid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span className="text-[#059669]">SHA-256 Match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-[#EF4444]" />
                      <span className="text-[#DC2626]">Tampered Payload</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-card">
                <div className="text-[10.5px] font-mono font-bold text-[#69708A]">3. REVOCATION REGISTRY</div>
                <div className="text-sm font-bold text-[#10142F] mt-1 flex items-center gap-1.5">
                  {result.revocation_status === "ACTIVE" ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span className="text-[#059669]">Active (Not Revoked)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                      <span className="text-[#D97706]">Revoked Status</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-card">
                <div className="text-[10.5px] font-mono font-bold text-[#69708A]">4. SELECTIVE CONSENT</div>
                <div className="text-sm font-bold text-[#10142F] mt-1 flex items-center gap-1.5">
                  {result.consent_valid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                      <span className="text-[#059669]">Consent Granted</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-[#EF4444]" />
                      <span className="text-[#DC2626]">Consent Denied</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Credential Intelligence & Quality Check Section */}
            <div
              className={`p-6 rounded-3xl glass-card border ${
                result.quality_status === "review_required"
                  ? "border-[#FDE68A] bg-[#FFFBEB]/50"
                  : "border-[#A7F3D0] bg-[#ECFDF5]/30"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.06]">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#5B5BEF]" />
                  <h4 className="text-sm font-bold text-[#10142F] uppercase tracking-wider font-mono">
                    Credential Intelligence &amp; Duplicate Check
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase ${
                    result.quality_status === "review_required"
                      ? "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
                      : "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                  }`}
                >
                  {result.quality_status === "review_required"
                    ? "⚠ REVIEW SIGNAL DETECTED"
                    : "✓ ZERO DISCREPANCIES DETECTED"}
                </span>
              </div>

              {result.quality_issues && result.quality_issues.length > 0 ? (
                <div className="mt-4 space-y-2.5">
                  <div className="text-xs text-[#92400E]">
                    <strong>Human Review Signal:</strong> One or more cross-record items are flagged for administrative review. LifeKey does not declare fraud automatically.
                  </div>
                  {result.quality_issues.map((iss, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-[#FDE68A] text-xs text-[#92400E] flex items-start justify-between gap-2 shadow-sm"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[#D97706] font-bold">⚠</span>
                        <div>
                          <span>{iss.message}</span>
                          {iss.action && (
                            <span className="block text-[11px] font-mono text-[#B45309] mt-0.5">
                              Recommended action: {iss.action}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FFFBEB] text-[#B45309] shrink-0 border border-[#FDE68A]">
                        {iss.type.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}

                  {result.quality_comparisons && result.quality_comparisons.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setComparisonModalData(result.quality_comparisons![0])}
                      className="mt-3 px-4 py-2 rounded-xl bg-[#5B5BEF] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#5B5BEF]/25 hover:bg-[#6964F2] transition-all"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Compare Flagged Records Side-by-Side</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 text-xs text-[#065F46]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>
                    Verified no duplicate awards, graduation date conflicts, or schema anomalies across registered records.
                  </span>
                </div>
              )}
            </div>

            {/* Verified Claims Card */}
            {result.credential_data && (
              <div className="p-7 rounded-3xl glass-card border-[#DCD9FF]">
                <div className="flex items-center justify-between pb-4 border-b border-[#F0EEFF]">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#5B5BEF]" />
                    <h3 className="text-lg font-bold text-[#10142F]">
                      Verified Disclosed Claims
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#5B5BEF] uppercase">
                    Issuer: {result.institution_name}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {result.credential_data.title && (
                    <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-[#E8E6FF]">
                      <div className="text-[11px] font-bold text-[#69708A] uppercase">Award Title</div>
                      <div className="font-bold text-[#10142F] mt-1 text-base">
                        {result.credential_data.title}
                      </div>
                    </div>
                  )}

                  {result.credential_data.major && (
                    <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-[#E8E6FF]">
                      <div className="text-[11px] font-bold text-[#69708A] uppercase">Academic Major</div>
                      <div className="font-bold text-[#10142F] mt-1 text-base">
                        {result.credential_data.major}
                      </div>
                    </div>
                  )}

                  {result.credential_data.cgpa && (
                    <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-[#E8E6FF]">
                      <div className="text-[11px] font-bold text-[#69708A] uppercase">CGPA Performance</div>
                      <div className="font-bold text-[#10B981] mt-1 text-base font-mono">
                        {result.credential_data.cgpa} / {result.credential_data.scale || "10.0"}
                      </div>
                    </div>
                  )}

                  {result.credential_data.graduation_year && (
                    <div className="p-4 rounded-2xl bg-[#F7F8FC] border border-[#E8E6FF]">
                      <div className="text-[11px] font-bold text-[#69708A] uppercase">Graduation Year</div>
                      <div className="font-bold text-[#10142F] mt-1 text-base">
                        {result.credential_data.graduation_year}
                      </div>
                    </div>
                  )}

                  {result.credential_data.skills && Array.isArray(result.credential_data.skills) && (
                    <div className="sm:col-span-2 p-4 rounded-2xl bg-[#F7F8FC] border border-[#E8E6FF]">
                      <div className="text-[11px] font-bold text-[#69708A] uppercase mb-2">Verified Competencies</div>
                      <div className="flex flex-wrap gap-2">
                        {result.credential_data.skills.map((skill: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="px-3 py-1 rounded-xl bg-[#F0EEFF] text-[#5B5BEF] border border-[#DCD9FF] text-xs font-bold"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Raw JSON toggle */}
                <div className="mt-6 pt-4 border-t border-[#F0EEFF]">
                  <button
                    type="button"
                    onClick={() => setShowRawJson(!showRawJson)}
                    className="text-xs font-mono text-[#5B5BEF] hover:underline flex items-center gap-1.5 font-bold"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{showRawJson ? "Hide Raw Cryptographic Payload" : "Inspect Raw Cryptographic Claims JSON"}</span>
                  </button>

                  {showRawJson && (
                    <pre className="mt-3 p-4 rounded-2xl bg-[#10142F] text-[#DCD9FF] border border-white/[0.1] text-[11px] font-mono overflow-x-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Modal: Side-by-Side Record Comparison */}
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
