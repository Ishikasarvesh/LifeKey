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
  Shield, AlertCircle, Eye, ChevronRight, Info, X
} from "lucide-react";

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
    <div className="min-h-screen bg-[#06050f] text-[#e2e0f0] flex flex-col selection:bg-violet-700 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded badge-violet font-bold tracking-wider">
                ENTERPRISE VERIFIER NODE
              </span>
              <span className="text-[11px] text-[#7c78a0] font-mono">{user?.organization || "Enterprise HR"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Employer <span className="gradient-text-violet">Verification</span> Portal
            </h1>
            <p className="text-sm text-[#8d8aab] mt-1">
              Zero-knowledge validation · Selective consent · Tamper detection · Burn-aware verification
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={loadData} className="btn-ghost px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button onClick={() => setReqModalOpen(true)}
              className="btn-violet px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2">
              <Send className="w-3.5 h-3.5" /> Request Consent
            </button>
          </div>
        </div>

        {reqSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-sm flex items-center gap-2 animate-fade-up">
            <CheckCircle2 className="w-5 h-5 shrink-0" />{reqSuccess}
          </div>
        )}

        {/* ── Tamper Detection Lab ──────────────────────── */}
        <div className="mt-7 p-6 rounded-3xl glass-panel-danger relative overflow-hidden animate-fade-up">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.07]">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-rose-400 uppercase font-bold tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> CRYPTOGRAPHIC TAMPER LAB
              </div>
              <h2 className="text-2xl font-black text-white mt-1.5">
                Live Tamper Detection Demo
              </h2>
              <p className="text-sm text-[#8d8aab] mt-1 max-w-2xl">
                Modify a student&apos;s grade and watch SHA-256 cryptographic hash divergence immediately fail verification.
              </p>
            </div>
            <button type="button" onClick={runTamperTest} disabled={isTamperTesting}
              className="btn-coral px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shrink-0 disabled:opacity-50">
              {isTamperTesting
                ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                : <><Cpu className="w-4 h-4" /> Run Verification</>
              }
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">1. Simulation Controls</span>

              <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/[0.07]">
                <div>
                  <div className="text-xs font-bold text-white">Simulate Fraudulent Tampering</div>
                  <div className="text-[11px] text-[#7c78a0]">
                    {isTampered ? "Forging CGPA 8.85 → " + tamperedCgpa : "Authentic record (CGPA: 8.85)"}
                  </div>
                </div>
                <button type="button" onClick={() => setIsTampered(!isTampered)}
                  className={`w-14 h-7 rounded-full transition-colors relative p-1 ${isTampered ? "bg-rose-600" : "bg-white/[0.12]"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${isTampered ? "translate-x-7" : "translate-x-0"}`} />
                </button>
              </div>

              {isTampered && (
                <div className="mt-3 space-y-2">
                  <label className="block text-xs font-medium text-rose-300">Forged CGPA Value</label>
                  <input type="text" value={tamperedCgpa} onChange={e => setTamperedCgpa(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-xs text-rose-300 font-bold font-mono border-rose-500/40" />
                  <div className="text-[11px] text-rose-400 font-mono">
                    ⚠ Stored issuer hash will NOT match this modified payload.
                  </div>
                </div>
              )}
            </div>

            {/* Result */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-col justify-center">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">2. Verifier Engine Output</span>
                {tamperLabResult && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    tamperLabResult.overall_status === "VALID" ? "badge-lime" : "badge-rose"
                  }`}>{tamperLabResult.overall_status}</span>
                )}
              </div>

              {!tamperLabResult ? (
                <div className="text-center py-6 text-xs text-[#5c5880]">
                  Click &ldquo;Run Verification&rdquo; to test integrity check.
                </div>
              ) : tamperLabResult.overall_status === "VALID" ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> CREDENTIAL AUTHENTIC
                  </div>
                  <p className="text-xs text-emerald-200">{tamperLabResult.reason}</p>
                  <div className="text-[10px] font-mono text-emerald-300/70 pt-2 border-t border-emerald-500/20">
                    RSA-2048 Signature: VALID · SHA-256 Digest: 100% MATCH
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/35 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <XCircle className="w-5 h-5 shrink-0" /> VERIFICATION REJECTED: TAMPER DETECTED
                  </div>
                  <p className="text-xs text-rose-200">{tamperLabResult.reason}</p>
                  <div className="text-[10px] font-mono text-rose-300/70 pt-2 border-t border-rose-500/20">
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
            <div className="glass-panel rounded-3xl p-6 border border-white/[0.07]">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-teal-400" /> Candidate Token Verifier
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded badge-teal">Instant</span>
              </div>

              <form onSubmit={handleVerifyToken} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">Candidate Presentation Token</label>
                  <div className="flex gap-2">
                    <input type="text" required value={verifyToken} onChange={e => setVerifyToken(e.target.value)}
                      placeholder="Paste token or QR-scanned value"
                      className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-mono" />
                    <button type="submit" disabled={isVerifying}
                      className="btn-teal px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shrink-0 disabled:opacity-50">
                      {isVerifying ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Verify"}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#5c5880] mt-1.5">
                    Demo: <code className="text-teal-400">lifekey_demo_token_xyz890</code>
                  </p>
                </div>
              </form>

              {verifyError && (
                <div className="mt-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />{verifyError}
                </div>
              )}

              {verifyResult && (
                <div className="mt-5 p-5 rounded-2xl glass-panel border border-teal-500/25 space-y-4 animate-fade-up">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        verifyResult.overall_status === "VALID" ? "badge-lime" : "badge-rose"
                      }`}>STATUS: {verifyResult.overall_status}</span>
                      <h4 className="text-lg font-bold text-white mt-1.5">
                        {verifyResult.candidate_name || "Verified Candidate"}
                      </h4>
                      <p className="text-xs text-[#8d8aab]">Issuer: {verifyResult.institution_name}</p>
                    </div>
                    <Link href={`/verify/${verifyToken}`} target="_blank"
                      className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1">
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
                      <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="text-[10px] text-[#7c78a0] font-mono">{item.label}</div>
                        <div className={`text-xs font-bold mt-0.5 ${item.ok ? "text-emerald-400" : "text-rose-400"}`}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Consent Inquiries */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-violet-400" /> Consent Inquiries
                </h3>
                <p className="text-xs text-[#8d8aab]">Selective disclosure requests sent to candidates.</p>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded badge-violet">{consents.length} total</span>
            </div>

            {consents.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl border border-white/[0.07]">
                <FileText className="w-8 h-8 text-[#3d3a5c] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">No Inquiries Sent</h4>
                <p className="text-xs text-[#7c78a0] mt-1">Click &ldquo;Request Consent&rdquo; above to begin.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {consents.map(consent => (
                  <div key={consent.id} className="p-4 rounded-2xl glass-panel border border-white/[0.07]">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            consent.status === "APPROVED" ? "badge-lime" :
                            consent.status === "PENDING" ? "badge-amber" : "badge-rose"
                          }`}>{consent.status}</span>
                          <span className="text-xs font-mono text-[#5c5880]">
                            {new Date(consent.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {consent.role_context && (
                          <p className="text-xs text-[#a8a4c8] mt-1.5">
                            <span className="text-[#5c5880]">Role:</span> {consent.role_context}
                          </p>
                        )}
                        <p className="text-xs text-[#8d8aab] mt-1">{consent.message || "Credential inquiry"}</p>
                      </div>
                      {consent.status === "APPROVED" && consent.verification_token && (
                        <button
                          onClick={() => { setVerifyToken(consent.verification_token!); }}
                          className="shrink-0 px-3 py-1.5 rounded-lg badge-teal text-xs font-semibold">
                          Load Token
                        </button>
                      )}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex flex-wrap gap-1.5">
                      {consent.requested_fields.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white/[0.03] text-[10px] text-[#8d8aab] font-mono">{f}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="max-w-lg w-full glass-panel-glow rounded-3xl p-6 border border-violet-500/25 text-left max-h-[90vh] overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-violet-400" /> Request Selective Disclosure
              </h3>
              <button onClick={() => setReqModalOpen(false)} className="p-1 rounded-lg text-[#7c78a0] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendConsentRequest} className="mt-4 space-y-4">
              {/* Purpose-Bound Section */}
              <div className="p-3 rounded-xl bg-violet-500/[0.06] border border-violet-500/20 space-y-3">
                <div className="text-[11px] font-mono text-violet-400 uppercase font-bold">Purpose-Bound Sharing</div>
                <div>
                  <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">Role Context (WHY)</label>
                  <input type="text" value={reqRoleContext} onChange={e => setReqRoleContext(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                    placeholder="e.g. Remote Software Engineer" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">Purpose Statement</label>
                  <input type="text" value={reqPurpose} onChange={e => setReqPurpose(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">Candidate Email</label>
                <select value={targetStudentEmail} onChange={e => setTargetStudentEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-[#06050f]">
                  {students.length > 0
                    ? students.map(s => <option key={s.id} value={s.email}>{s.name} ({s.email})</option>)
                    : <option value="parth@lifekey.id">Parth Patil (parth@lifekey.id)</option>
                  }
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">Requested Fields</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_FIELDS.map(item => {
                    const isWarned = overShareWarnings.some(w => w.field.toLowerCase() === item.key.toLowerCase());
                    return (
                      <button key={item.key} type="button" onClick={() => toggleField(item.key)}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-left flex items-center gap-2 transition-all relative ${
                          selectedFields.includes(item.key)
                            ? isWarned
                              ? "bg-orange-600/20 border-orange-500/50 text-orange-200"
                              : "bg-violet-600/20 border-violet-500/50 text-white"
                            : "bg-white/[0.02] border-white/[0.08] text-[#7c78a0] hover:text-[#c4c0dc]"
                        }`}>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                          selectedFields.includes(item.key)
                            ? isWarned ? "bg-orange-500 border-orange-400" : "bg-violet-600 border-violet-500"
                            : "border-white/[0.2]"
                        }`}>
                          {selectedFields.includes(item.key) && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className="truncate flex-1">{item.label}</span>
                        {isWarned && <AlertTriangle className="w-3 h-3 text-orange-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Over-Share Warning Panel */}
              {overShareWarnings.length > 0 && (
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/25 space-y-2 animate-fade-up">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {overShareWarnings.length} Anomalous Field{overShareWarnings.length !== 1 ? "s" : ""} Detected
                  </div>
                  {overShareWarnings.map((w, i) => (
                    <div key={i} className="text-[11px] text-orange-200/80">
                      <strong>{w.field}</strong>: {w.reason}
                    </div>
                  ))}
                  <p className="text-[10px] text-[#7c78a0]">
                    Consider removing these fields — the candidate&apos;s dashboard will flag this as an anomalous request.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">Message / Context</label>
                <input type="text" value={reqMessage} onChange={e => setReqMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm" />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setReqModalOpen(false)}
                  className="px-4 py-2 rounded-xl btn-ghost text-xs font-semibold border border-white/[0.09]">
                  Cancel
                </button>
                <button type="submit" disabled={isSendingReq}
                  className="px-5 py-2 rounded-xl btn-violet text-white text-xs font-bold disabled:opacity-50 flex items-center gap-2">
                  {isSendingReq ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Dispatch Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
