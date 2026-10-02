"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  api, getUser,
  User, CredentialOut, VerificationResult, ConsentRequestOut, OverShareWarning
} from "@/lib/api";
import {
  Briefcase, ShieldCheck, ShieldAlert, QrCode, CheckCircle2,
  AlertTriangle, XCircle, Sparkles, Cpu, Send, Lock, Check,
  History, FileText, ExternalLink, Zap, Flame, RefreshCw,
  Shield, AlertCircle, Eye, ChevronRight, Info, X, Scale, Brain
} from "lucide-react";
import CompareRecordsModal from "@/components/CompareRecordsModal";
import { RecordComparison } from "@/lib/api";

export default function EmployerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [consents, setConsents] = useState<ConsentRequestOut[]>([]);
  const [loading, setLoading] = useState(true);

  // Verification state
  const [verifyToken, setVerifyToken] = useState("lifekey_demo_token_xyz890");
  const [verifyResult, setVerifyResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [comparisonModalData, setComparisonModalData] = useState<RecordComparison | null>(null);

  // Tamper Lab
  const [tamperCandidate, setTamperCandidate] = useState<CredentialOut | null>(null);
  const [isTampered, setIsTampered] = useState(false);
  const [tamperedCgpa, setTamperedCgpa] = useState("9.95");
  const [tamperLabResult, setTamperLabResult] = useState<VerificationResult | null>(null);
  const [isTamperTesting, setIsTamperTesting] = useState(false);

  // Consent Request Modal
  const [reqModalOpen, setReqModalOpen] = useState(false);
  const [targetStudentEmail, setTargetStudentEmail] = useState("parth@lifekey.id");
  const [selectedFields, setSelectedFields] = useState<string[]>(["title", "major", "cgpa", "skills", "status"]);
  const [reqMessage, setReqMessage] = useState("Verification of AI/ML diploma for Junior AI Engineer onboarding.");
  const [reqPurpose, setReqPurpose] = useState("Employment credential verification");
  const [reqRoleContext, setReqRoleContext] = useState("Junior AI Engineer — Remote");
  const [isSendingReq, setIsSendingReq] = useState(false);
  const [reqSuccess, setReqSuccess] = useState<string | null>(null);

  // Live over-share check
  const [overShareWarnings, setOverShareWarnings] = useState<OverShareWarning[]>([]);
  const [checkingOverShare, setCheckingOverShare] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentList, consentList] = await Promise.all([
        api.listStudents().catch(() => []),
        api.getAllConsents().catch(() => []),
      ]);
      setStudents(studentList);
      setConsents(consentList);

      const wallet = await api.getWallet().catch(() => []);
      if (wallet.length > 0) setTamperCandidate(wallet[0]);
    } catch (err) {
      console.error("Error loading employer data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const curUser = getUser();
    if (!curUser) { router.push("/login"); return; }
    if (curUser.role !== "EMPLOYER") {
      if (curUser.role === "STUDENT") router.push("/dashboard/student");
      else if (curUser.role === "INSTITUTION") router.push("/dashboard/institution");
      return;
    }
    setUser(curUser);
    loadData();
  }, [router, loadData]);

  // Live over-share check whenever fields/role change
  useEffect(() => {
    if (!reqModalOpen) return;
    const timeout = setTimeout(async () => {
      if (selectedFields.length === 0) { setOverShareWarnings([]); return; }
      setCheckingOverShare(true);
      try {
        const res = await api.checkOverShare({
          requested_fields: selectedFields,
          role_context: reqRoleContext,
          purpose: reqPurpose,
        });
        setOverShareWarnings(res.warnings);
      } catch { setOverShareWarnings([]); }
      finally { setCheckingOverShare(false); }
    }, 600);
    return () => clearTimeout(timeout);
  }, [selectedFields, reqRoleContext, reqPurpose, reqModalOpen]);

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyToken.trim()) return;
    setIsVerifying(true);
    setVerifyError(null);
    setVerifyResult(null);
    try {
      const res = await api.verifyByToken(verifyToken.trim());
      setVerifyResult(res);
    } catch (err: any) {
      setVerifyError(err.message || "Token invalid or expired.");
    } finally {
      setIsVerifying(false);
    }
  };

  const runTamperTest = async () => {
    if (!tamperCandidate) return;
    setIsTamperTesting(true);
    try {
      const payloadData = isTampered ? { ...tamperCandidate.credential_data, cgpa: tamperedCgpa } : undefined;
      const res = await api.verifyCredentialDirect({ credential_id: tamperCandidate.id, credential_data: payloadData });
      setTamperLabResult(res);
    } catch (err: any) {
      alert(err.message || "Tamper test failed");
    } finally {
      setIsTamperTesting(false);
    }
  };

  const handleSendConsentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingReq(true);
    try {
      await api.createConsentRequest({
        holder_email: targetStudentEmail,
        credential_ids: tamperCandidate ? [tamperCandidate.id] : [],
        requested_fields: selectedFields,
        message: reqMessage,
        purpose: reqPurpose,
        role_context: reqRoleContext,
      });
      setReqSuccess(`Selective disclosure request sent to ${targetStudentEmail}!`);
      setReqModalOpen(false);
      loadData();
      setTimeout(() => setReqSuccess(null), 5000);
    } catch (err: any) {
      alert(err.message || "Failed to create consent request");
    } finally {
      setIsSendingReq(false);
    }
  };

  const toggleField = (field: string) => {
    setSelectedFields(prev => prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]);
  };

  const ALL_FIELDS = [
    { key: "title", label: "Credential Title" },
    { key: "major", label: "Academic Major" },
    { key: "cgpa", label: "CGPA Grade" },
    { key: "skills", label: "Verified Skills" },
    { key: "status", label: "Graduation Status" },
    { key: "registration_no", label: "Student Roll No" },
    { key: "home_address", label: "Home Address ⚠" },
    { key: "phone_number", label: "Phone Number ⚠" },
    { key: "date_of_birth", label: "Date of Birth ⚠" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white relative overflow-hidden">
      {/* Ambient background glow orbs matching landing page */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-gradient-to-br from-[#E8E6FF]/60 to-[#F0EEFF]/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-10 w-[500px] h-[300px] bg-gradient-to-bl from-[#E0EAFF]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#DCD9FF]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded badge-indigo font-bold tracking-wider">
                ENTERPRISE VERIFIER NODE
              </span>
              <span className="text-[11px] text-[#69708A] font-mono font-medium">{user?.organization || "Enterprise HR"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#10142F] tracking-tight">
              Employer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5BEF] to-[#7A5AF8]">Verification</span> Portal
            </h1>
            <p className="text-sm text-[#69708A] mt-1">
              Zero-knowledge validation · Selective consent · Tamper detection · Burn-aware verification
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={loadData} className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-[#10142F] shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 text-[#5B5BEF]" /> Refresh
            </button>
            <button onClick={() => setReqModalOpen(true)}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#5B5BEF]/20">
              <Send className="w-3.5 h-3.5" /> Request Consent
            </button>
          </div>
        </div>

        {reqSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-fade-up shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />{reqSuccess}
          </div>
        )}

        {/* ── Tamper Detection Lab ──────────────────────── */}
        <div className="mt-7 p-6 sm:p-8 rounded-3xl glass-card border border-rose-200/80 relative overflow-hidden shadow-sm animate-fade-up bg-white">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-[#F0EEFF]">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-rose-600 uppercase font-bold tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> CRYPTOGRAPHIC TAMPER LAB
              </div>
              <h2 className="text-2xl font-black text-[#10142F] mt-1.5">
                Live Tamper Detection Demo
              </h2>
              <p className="text-sm text-[#69708A] mt-1 max-w-2xl">
                Modify a student&apos;s grade and watch SHA-256 cryptographic hash divergence immediately fail verification.
              </p>
            </div>
            <button type="button" onClick={runTamperTest} disabled={isTamperTesting}
              className="px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shrink-0 disabled:opacity-50 bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all">
              {isTamperTesting
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Cpu className="w-4 h-4" /> Run Verification</>
              }
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="p-5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF]">
              <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono">1. Simulation Controls</span>

              <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#DCD9FF] shadow-sm">
                <div>
                  <div className="text-xs font-bold text-[#10142F]">Simulate Fraudulent Tampering</div>
                  <div className="text-[11px] text-[#69708A]">
                    {isTampered ? "Forging CGPA 8.85 → " + tamperedCgpa : "Authentic record (CGPA: 8.85)"}
                  </div>
                </div>
                <button type="button" onClick={() => setIsTampered(!isTampered)}
                  className={`w-14 h-7 rounded-full transition-colors relative p-1 ${isTampered ? "bg-rose-600" : "bg-slate-200"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${isTampered ? "translate-x-7" : "translate-x-0"}`} />
                </button>
              </div>

              {isTampered && (
                <div className="mt-3 space-y-2">
                  <label className="block text-xs font-medium text-rose-700">Forged CGPA Value</label>
                  <input type="text" value={tamperedCgpa} onChange={e => setTamperedCgpa(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-rose-700 font-bold font-mono border-rose-300 bg-white" />
                  <div className="text-[11px] text-rose-600 font-mono">
                    ⚠ Stored issuer hash will NOT match this modified payload.
                  </div>
                </div>
              )}
            </div>

            {/* Result */}
            <div className="p-5 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] flex flex-col justify-center">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono">2. Verifier Engine Output</span>
                {tamperLabResult && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    tamperLabResult.overall_status === "VALID" ? "badge-lime" : "badge-rose"
                  }`}>{tamperLabResult.overall_status}</span>
                )}
              </div>

              {!tamperLabResult ? (
                <div className="text-center py-6 text-xs text-[#69708A]">
                  Click &ldquo;Run Verification&rdquo; to test integrity check.
                </div>
              ) : tamperLabResult.overall_status === "VALID" ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> CREDENTIAL AUTHENTIC
                  </div>
                  <p className="text-xs text-emerald-900">{tamperLabResult.reason}</p>
                  <div className="text-[10px] font-mono text-emerald-700/80 pt-2 border-t border-emerald-200">
                    RSA-2048 Signature: VALID · SHA-256 Digest: 100% MATCH
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" /> VERIFICATION REJECTED: TAMPER DETECTED
                  </div>
                  <p className="text-xs text-rose-900">{tamperLabResult.reason}</p>
                  <div className="text-[10px] font-mono text-rose-700/80 pt-2 border-t border-rose-200">
                    Hash Mismatch · Credential payload altered after issuer signing!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Verification + Consent Grid ───────────────── */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* QR / Token Verifier */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-[#DCD9FF] shadow-sm bg-white">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EEFF]">
                <h3 className="text-lg font-bold text-[#10142F] flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#5B5BEF]" /> Candidate Token Verifier
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded badge-indigo">Instant</span>
              </div>

              <form onSubmit={handleVerifyToken} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#69708A] mb-1.5">Candidate Presentation Token</label>
                  <div className="flex gap-2">
                    <input type="text" required value={verifyToken} onChange={e => setVerifyToken(e.target.value)}
                      placeholder="Paste token or QR-scanned value"
                      className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-mono bg-white text-[#10142F] border-[#DCD9FF]" />
                    <button type="submit" disabled={isVerifying}
                      className="btn-primary px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shrink-0 disabled:opacity-50 text-white shadow-md shadow-[#5B5BEF]/20">
                      {isVerifying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Verify"}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#69708A] mt-1.5">
                    Demo: <code className="text-[#5B5BEF] font-bold">lifekey_demo_token_xyz890</code>
                  </p>
                </div>
              </form>

              {verifyError && (
                <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />{verifyError}
                </div>
              )}

              {verifyResult && (
                <div className="mt-5 p-5 rounded-2xl bg-[#FAFAFE] border border-[#DCD9FF] space-y-4 animate-fade-up">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        verifyResult.overall_status === "VALID" ? "badge-lime" : "badge-rose"
                      }`}>STATUS: {verifyResult.overall_status}</span>
                      <h4 className="text-lg font-bold text-[#10142F] mt-1.5">
                        {verifyResult.candidate_name || "Verified Candidate"}
                      </h4>
                      <p className="text-xs text-[#69708A]">Issuer: {verifyResult.institution_name}</p>
                    </div>
                    <Link href={`/verify/${verifyToken}`} target="_blank"
                      className="text-xs font-semibold text-[#5B5BEF] hover:underline flex items-center gap-1">
                      Public Proof <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { label: "RSA-2048 Signature", val: verifyResult.signature_valid ? "✓ Valid" : "❌ Invalid", ok: verifyResult.signature_valid },
                      { label: "SHA-256 Integrity", val: verifyResult.integrity_valid ? "✓ Match" : "❌ Mismatch", ok: verifyResult.integrity_valid },
                      { label: "Revocation Status", val: verifyResult.revocation_status === "ACTIVE" ? "✓ Active" : `❌ ${verifyResult.revocation_status}`, ok: verifyResult.revocation_status === "ACTIVE" },
                      { label: "Candidate Consent", val: verifyResult.consent_valid ? "✓ Granted" : "❌ Denied", ok: verifyResult.consent_valid },
                    ].map((item, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white border border-[#E8E6FF]">
                        <div className="text-[10px] text-[#69708A] font-mono">{item.label}</div>
                        <div className={`text-xs font-bold mt-0.5 ${item.ok ? "text-emerald-600" : "text-rose-600"}`}>{item.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Credential Intelligence & Duplicate QA Section */}
                  <div className="pt-3 border-t border-[#E8E6FF]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-mono uppercase text-[#69708A] font-bold flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-[#5B5BEF]" />
                        Credential Intelligence QA
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        verifyResult.quality_status === "review_required" ? "badge-amber" : "badge-lime"
                      }`}>
                        {verifyResult.quality_status === "review_required" ? "⚠ REVIEW REQUIRED" : "✓ ZERO DISCREPANCIES"}
                      </span>
                    </div>

                    {verifyResult.quality_issues && verifyResult.quality_issues.length > 0 ? (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                        <div className="text-xs text-amber-900 font-medium">
                          <strong>Advisory:</strong> Potential record discrepancy flagged for human administrative review.
                        </div>
                        {verifyResult.quality_issues.map((iss, idx) => (
                          <div key={idx} className="text-[11px] text-amber-900 flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">⚠</span>
                            <span>{iss.message}</span>
                          </div>
                        ))}
                        {verifyResult.quality_comparisons && verifyResult.quality_comparisons.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setComparisonModalData(verifyResult.quality_comparisons![0])}
                            className="mt-2 px-3 py-1.5 rounded-lg btn-secondary text-[#5B5BEF] border-[#DCD9FF] text-xs font-bold flex items-center gap-1.5 shadow-sm"
                          >
                            <Scale className="w-3 h-3 text-[#5B5BEF]" />
                            <span>Compare Flagged Records Side-by-Side</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>All cross-record duplicate, conflict, and validity checks passed.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Consent Inquiries */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#10142F] flex items-center gap-2">
                  <History className="w-5 h-5 text-[#5B5BEF]" /> Consent Inquiries
                </h3>
                <p className="text-xs text-[#69708A]">Selective disclosure requests sent to candidates.</p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded badge-indigo font-bold">{consents.length} total</span>
            </div>

            {consents.length === 0 ? (
              <div className="p-8 text-center glass-card rounded-2xl border border-[#DCD9FF] bg-white shadow-sm">
                <FileText className="w-8 h-8 text-[#69708A]/50 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#10142F]">No Inquiries Sent</h4>
                <p className="text-xs text-[#69708A] mt-1">Click &ldquo;Request Consent&rdquo; above to begin.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {consents.map(consent => (
                  <div key={consent.id} className="p-4 rounded-2xl glass-card border border-[#DCD9FF] bg-white shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            consent.status === "APPROVED" ? "badge-lime" :
                            consent.status === "PENDING" ? "badge-amber" : "badge-rose"
                          }`}>{consent.status}</span>
                          <span className="text-xs font-mono text-[#69708A]">
                            {new Date(consent.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {consent.role_context && (
                          <p className="text-xs text-[#10142F] font-semibold mt-1.5">
                            <span className="text-[#69708A] font-normal">Role:</span> {consent.role_context}
                          </p>
                        )}
                        <p className="text-xs text-[#69708A] mt-1">{consent.message || "Credential inquiry"}</p>
                      </div>
                      {consent.status === "APPROVED" && consent.verification_token && (
                        <button
                          onClick={() => { setVerifyToken(consent.verification_token!); }}
                          className="shrink-0 px-3 py-1.5 rounded-lg btn-secondary text-xs font-semibold text-[#5B5BEF] border border-[#DCD9FF] shadow-sm">
                          Load Token
                        </button>
                      )}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[#F0EEFF] flex flex-wrap gap-1.5">
                      {consent.requested_fields.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#F0EEFF] text-[10px] text-[#5B5BEF] font-mono font-medium">{f}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Modal: Consent Request ───────────────────── */}
      {reqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="max-w-lg w-full glass-card bg-white rounded-3xl p-6 sm:p-7 border border-[#DCD9FF] text-left max-h-[90vh] overflow-y-auto animate-fade-up shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <h3 className="text-base font-bold text-[#10142F] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#5B5BEF]" /> Request Selective Disclosure
              </h3>
              <button onClick={() => setReqModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-[#10142F] hover:bg-[#F0EEFF] transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendConsentRequest} className="mt-4 space-y-4">
              {/* Purpose-Bound Section */}
              <div className="p-3.5 rounded-xl bg-[#F0EEFF]/50 border border-[#DCD9FF] space-y-3">
                <div className="text-[11px] font-mono text-[#5B5BEF] uppercase font-bold">Purpose-Bound Sharing</div>
                <div>
                  <label className="block text-xs font-medium text-[#69708A] mb-1.5">Role Context (WHY)</label>
                  <input type="text" value={reqRoleContext} onChange={e => setReqRoleContext(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-white text-[#10142F] border-[#DCD9FF]"
                    placeholder="e.g. Remote Software Engineer" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#69708A] mb-1.5">Purpose Statement</label>
                  <input type="text" value={reqPurpose} onChange={e => setReqPurpose(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-white text-[#10142F] border-[#DCD9FF]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#69708A] mb-1.5">Candidate Email</label>
                <select value={targetStudentEmail} onChange={e => setTargetStudentEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-white text-[#10142F] border-[#DCD9FF]">
                  {students.length > 0
                    ? students.map(s => <option key={s.id} value={s.email}>{s.name} ({s.email})</option>)
                    : <option value="parth@lifekey.id">Parth Patil (parth@lifekey.id)</option>
                  }
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#69708A] mb-1.5">Requested Fields</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_FIELDS.map(item => {
                    const isWarned = overShareWarnings.some(w => w.field.toLowerCase() === item.key.toLowerCase());
                    const isSelected = selectedFields.includes(item.key);
                    return (
                      <button key={item.key} type="button" onClick={() => toggleField(item.key)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-left flex items-center gap-2 transition-all relative ${
                          isSelected
                            ? isWarned
                              ? "bg-amber-50 border-amber-300 text-amber-900"
                              : "bg-[#F0EEFF] border-[#5B5BEF] text-[#5B5BEF] font-bold"
                            : "bg-white border-[#E8E6FF] text-[#69708A] hover:border-[#DCD9FF]"
                        }`}>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? isWarned ? "bg-amber-500 border-amber-600" : "bg-[#5B5BEF] border-[#5B5BEF]"
                            : "border-slate-300 bg-white"
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className="truncate flex-1">{item.label}</span>
                        {isWarned && <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Over-Share Warning Panel */}
              {overShareWarnings.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2 animate-fade-up">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    {overShareWarnings.length} Anomalous Field{overShareWarnings.length !== 1 ? "s" : ""} Detected
                  </div>
                  {overShareWarnings.map((w, i) => (
                    <div key={i} className="text-[11px] text-amber-900">
                      <strong>{w.field}</strong>: {w.reason}
                    </div>
                  ))}
                  <p className="text-[10px] text-[#69708A]">
                    Consider removing these fields — the candidate&apos;s dashboard will flag this as an anomalous request.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#69708A] mb-1.5">Message / Context</label>
                <input type="text" value={reqMessage} onChange={e => setReqMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-white text-[#10142F] border-[#DCD9FF]" />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setReqModalOpen(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold text-[#10142F] border border-[#DCD9FF]">
                  Cancel
                </button>
                <button type="submit" disabled={isSendingReq}
                  className="btn-primary px-5 py-2 rounded-xl text-white text-xs font-bold disabled:opacity-50 flex items-center gap-2 shadow-md shadow-[#5B5BEF]/20">
                  {isSendingReq ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Dispatch Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Side-by-Side Record Comparison ──── */}
      {comparisonModalData && (
        <CompareRecordsModal
          comparison={comparisonModalData}
          onClose={() => setComparisonModalData(null)}
          issues={verifyResult?.quality_issues || []}
        />
      )}
    </div>
  );
}
