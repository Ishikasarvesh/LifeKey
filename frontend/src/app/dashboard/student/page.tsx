"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  api, getUser,
  User, CredentialOut, ConsentRequestOut, TransitionStatus,
  ZKProofOut, BurnTokenOut, CredentialIntelReport, OverShareWarning
} from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";
import {
  GraduationCap, ShieldCheck, KeyRound, Award, CheckCircle2, Clock,
  Share2, FileText, QrCode, Sparkles, Layers, AlertCircle, Eye, Check,
  X, Lock, ExternalLink, ShieldAlert, Zap, Flame, Brain, Camera,
  ChevronRight, RefreshCw, AlertTriangle, XCircle, Shield, Hash,
  Fingerprint, ScanLine, Lightbulb, Copy, CheckCheck
} from "lucide-react";

type ActiveTab = "wallet" | "zk" | "burn" | "intel" | "camera";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<CredentialOut[]>([]);
  const [consents, setConsents] = useState<ConsentRequestOut[]>([]);
  const [transition, setTransition] = useState<TransitionStatus | null>(null);
  const [zkProofs, setZkProofs] = useState<ZKProofOut[]>([]);
  const [burnTokens, setBurnTokens] = useState<BurnTokenOut[]>([]);
  const [intelReport, setIntelReport] = useState<CredentialIntelReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("wallet");

  // Modal states
  const [activeModalCred, setActiveModalCred] = useState<CredentialOut | null>(null);
  const [qrModalToken, setQrModalToken] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ZK Proof form
  const [zkCredId, setZkCredId] = useState("");
  const [zkAttr, setZkAttr] = useState("cgpa");
  const [zkPredicate, setZkPredicate] = useState(">");
  const [zkThreshold, setZkThreshold] = useState("8.0");
  const [zkLoading, setZkLoading] = useState(false);
  const [zkResult, setZkResult] = useState<ZKProofOut | null>(null);

  // Burn token form
  const [burnConsentId, setBurnConsentId] = useState("");
  const [burnTTL, setBurnTTL] = useState(5);
  const [burnLoading, setBurnLoading] = useState(false);
  const [burnResult, setBurnResult] = useState<BurnTokenOut | null>(null);

  // Camera/digitizer state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [digitizerLoading, setDigitizerLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, string> | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [walletData, consentData, transData, zkData, burnData, intelData] = await Promise.all([
        api.getWallet(),
        api.getAllConsents(),
        api.getTransitionStatus().catch(() => null),
        api.getMyZKProofs().catch(() => []),
        api.getMyBurnTokens().catch(() => []),
        api.getIntelReport().catch(() => null),
      ]);
      setCredentials(walletData);
      setConsents(consentData);
      setTransition(transData);
      setZkProofs(zkData);
      setBurnTokens(burnData);
      setIntelReport(intelData);
      if (walletData.length > 0) setZkCredId(walletData[0].id);
      const approvedConsents = consentData.filter(c => c.status === "APPROVED");
      if (approvedConsents.length > 0) setBurnConsentId(approvedConsents[0].id);
    } catch (err) {
      console.error("Error loading student data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const curUser = getUser();
    if (!curUser) { router.push("/login"); return; }
    if (curUser.role !== "STUDENT") {
      if (curUser.role === "INSTITUTION") router.push("/dashboard/institution");
      else if (curUser.role === "EMPLOYER") router.push("/dashboard/employer");
      return;
    }
    setUser(curUser);
    loadData();
  }, [router, loadData]);

  const handleConsentResponse = async (consentId: string, approve: boolean) => {
    try {
      const res = await api.respondToConsent(consentId, approve);
      setActionSuccess(approve ? "Consent approved! Secure verification token generated." : "Consent denied.");
      if (approve && res.verification_token) setQrModalToken(res.verification_token);
      loadData();
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err: any) {
      alert(err.message || "Failed to respond to consent");
    }
  };

  const handleCreateZKProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setZkLoading(true);
    setZkResult(null);
    try {
      const proof = await api.createZKProof({
        credential_id: zkCredId,
        attribute: zkAttr,
        predicate: zkPredicate,
        threshold: zkThreshold,
      });
      setZkResult(proof);
      await api.getMyZKProofs().then(setZkProofs);
    } catch (err: any) {
      alert(err.message || "Failed to create ZK proof");
    } finally {
      setZkLoading(false);
    }
  };

  const handleCreateBurnToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setBurnLoading(true);
    setBurnResult(null);
    try {
      const bt = await api.createBurnToken(burnConsentId, burnTTL);
      setBurnResult(bt);
      await api.getMyBurnTokens().then(setBurnTokens);
    } catch (err: any) {
      alert(err.message || "Failed to create burn token");
    } finally {
      setBurnLoading(false);
    }
  };

  const handleResolveFlag = async (flagId: string) => {
    try {
      await api.resolveIntelFlag(flagId);
      const updated = await api.getIntelReport();
      setIntelReport(updated);
    } catch (err: any) {
      alert(err.message || "Failed to resolve flag");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
    } catch (err) {
      alert("Camera access denied or not available. Try uploading a file instead.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  };

  const simulateDigitize = () => {
    setDigitizerLoading(true);
    setTimeout(() => {
      setExtractedData({
        title: "Bachelor of Technology (B.Tech)",
        institution: "ABC Polytechnic Institute",
        major: "Artificial Intelligence & Machine Learning",
        graduation_year: "2024",
        grade: "First Class with Distinction",
        cgpa: "8.85",
        student_name: user?.name || "Student",
      });
      setDigitizerLoading(false);
    }, 2500);
  };

  const pendingConsents = consents.filter(c => c.status === "PENDING");
  const approvedConsents = consents.filter(c => c.status === "APPROVED");
  const intelFlagCount = intelReport?.flags?.length ?? 0;

  const TABS: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; color: string }[] = [
    { id: "wallet", label: "Credential Wallet", icon: <KeyRound className="w-4 h-4" />, badge: credentials.length, color: "violet" },
    { id: "zk", label: "ZK Proofs", icon: <Fingerprint className="w-4 h-4" />, badge: zkProofs.length, color: "teal" },
    { id: "burn", label: "Burn Tokens", icon: <Flame className="w-4 h-4" />, badge: burnTokens.filter(b => !b.is_burned).length, color: "coral" },
    { id: "intel", label: "Credential Intel", icon: <Brain className="w-4 h-4" />, badge: intelFlagCount > 0 ? intelFlagCount : undefined, color: "amber" },
    { id: "camera", label: "Doc Digitizer", icon: <Camera className="w-4 h-4" />, color: "lime" },
  ];

  return (
    <div className="min-h-screen bg-[#06050f] text-[#e2e0f0] flex flex-col selection:bg-violet-700 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded badge-teal font-bold tracking-wider">
                CITIZEN HOLDER WALLET
              </span>
              <span className="text-[11px] text-[#7c78a0] font-mono">ID: {user?.id.slice(0, 8)}…</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Welcome, <span className="gradient-text-violet">{user?.name || "Student"}</span>
            </h1>
            <p className="text-sm text-[#8d8aab] mt-1">
              Self-sovereign identity vault · Zero-knowledge proofs · Burn-after-read tokens
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button onClick={loadData} className="btn-ghost px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <Link href="/verify/lifekey_demo_token_xyz890"
              className="btn-teal px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" /> Public Verifier
            </Link>
          </div>
        </div>

        {/* ── Action Success ────────────────────────────── */}
        {actionSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-sm flex items-center justify-between animate-fade-up">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{actionSuccess}</div>
            {qrModalToken && (
              <button onClick={() => setQrModalToken(qrModalToken)} className="text-xs font-bold underline hover:text-white">
                View QR
              </button>
            )}
          </div>
        )}

        {/* ── Overshare Warnings on Pending Consents ──── */}
        {pendingConsents.some(c => c.overshare_warnings && c.overshare_warnings.length > 0) && (
          <div className="mt-5 p-4 rounded-2xl glass-panel-coral animate-fade-up">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-[#fb923c]" />
              <span className="font-bold text-[#fb923c] text-sm">Anomalous Data Requests Detected</span>
            </div>
            {pendingConsents.filter(c => c.overshare_warnings?.length).map(c => (
              <div key={c.id} className="mb-2 text-xs text-[#e2e0f0]/80">
                <span className="font-semibold text-white">{c.requester_name}:</span>{" "}
                {c.overshare_warnings?.join(" · ")}
              </div>
            ))}
            <p className="text-[11px] text-[#8d8aab] mt-2">
              Review these requests carefully. You can selectively deny unusual fields before approving.
            </p>
          </div>
        )}

        {/* ── Life Transition Passport ────────────────── */}
        {transition && (
          <div className="mt-7 p-6 rounded-3xl glass-panel-glow relative overflow-hidden animate-fade-up">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-bl from-violet-700/20 via-teal-500/10 to-transparent blur-3xl pointer-events-none animate-orb" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 border-b border-white/[0.07]">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-violet-400 uppercase font-bold tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" /> LIFE TRANSITION ENGINE
                </div>
                <h2 className="text-2xl font-black text-white mt-1.5">
                  Passport: <span className="gradient-text-teal">Student → Employee</span>
                </h2>
                <p className="text-sm text-[#8d8aab] mt-1 max-w-2xl">
                  Automated onboarding readiness engine. Correlates your verified credentials for zero-reverification employment entry.
                </p>
              </div>
              <div className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/[0.07] shrink-0">
                <div className="text-right">
                  <div className="text-[11px] text-[#7c78a0] uppercase font-mono tracking-wider">Readiness</div>
                  <div className="text-xl font-black text-white mt-0.5">{transition.completed} / {transition.total}</div>
                  <div className={`text-[11px] font-bold mt-0.5 ${transition.ready ? "text-emerald-400" : "text-[#fbbf24]"}`}>
                    {transition.ready ? "✓ TRANSITION READY" : "In Progress"}
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl p-[2px] shadow-lg"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #14b8a6)" }}>
                  <div className="w-full h-full bg-[#0c0b1a] rounded-[14px] flex items-center justify-center font-black text-lg"
                    style={{ color: "#a78bfa" }}>
                    {Math.round((transition.completed / transition.total) * 100)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {transition.requirements.map((req, idx) => (
                <div key={idx} className={`p-3.5 rounded-2xl border transition-all ${req.met
                  ? "bg-emerald-500/[0.06] border-emerald-500/25 text-emerald-300"
                  : "bg-white/[0.02] border-white/[0.06] text-[#7c78a0]"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest">REQ {String(idx + 1).padStart(2, "0")}</span>
                    {req.met ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="text-xs font-bold text-white leading-snug">{req.name}</div>
                  <div className="text-[10px] mt-1">{req.met ? "Verified" : "Missing"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Main Grid: Tabs + Consent Panel ──────────── */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left: Tab Panel */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tab Nav */}
            <div className="flex gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.07] overflow-x-auto">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all relative shrink-0 ${
                    activeTab === tab.id
                      ? "bg-white/[0.08] text-white shadow-sm"
                      : "text-[#7c78a0] hover:text-[#c4c0dc]"
                  }`}>
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      tab.color === "amber" ? "bg-amber-500/20 text-amber-300" :
                      tab.color === "teal" ? "bg-teal-500/20 text-teal-300" :
                      tab.color === "coral" ? "bg-orange-500/20 text-orange-300" :
                      "bg-violet-500/20 text-violet-300"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── TAB: Wallet ────────────────────────────── */}
            {activeTab === "wallet" && (
              <div className="space-y-4 animate-fade-up">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-violet-400" /> Cryptographic Credentials
                  </h3>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full badge-violet">{credentials.length} creds</span>
                </div>
                {loading ? (
                  <div className="p-12 text-center text-[#7c78a0] text-sm glass-panel rounded-2xl">Loading vault…</div>
                ) : credentials.length === 0 ? (
                  <div className="p-10 text-center glass-panel rounded-2xl border border-white/[0.07]">
                    <GraduationCap className="w-10 h-10 text-[#3d3a5c] mx-auto mb-3" />
                    <h4 className="text-base font-bold text-white">No Credentials Yet</h4>
                    <p className="text-xs text-[#7c78a0] mt-1">Log in as an institution to issue a verifiable award.</p>
                  </div>
                ) : (
                  credentials.map(cred => {
                    const data = cred.credential_data;
                    return (
                      <div key={cred.id} className="p-5 rounded-2xl glass-panel card-hover border border-white/[0.07] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{
                          background: cred.status === "ACTIVE" ? "linear-gradient(180deg,#8b5cf6,#14b8a6)" :
                                      cred.status === "REVOKED" ? "#e11d48" : "#fbbf24"
                        }} />
                        <div className="pl-3 flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600/20 to-teal-500/20 border border-violet-500/25 flex items-center justify-center text-violet-400 shrink-0">
                              {cred.credential_type === "DIPLOMA" ? <GraduationCap className="w-5 h-5" /> :
                               cred.credential_type === "SKILL" ? <Award className="w-5 h-5" /> :
                               <FileText className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded badge-violet font-bold">{cred.credential_type}</span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                  cred.status === "ACTIVE" ? "badge-lime" : "badge-rose"
                                }`}>{cred.status}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white mt-1.5">{data.title || "Verifiable Credential"}</h4>
                              <p className="text-xs text-[#8d8aab] mt-0.5">
                                Issuer: <strong className="text-[#c4c0dc]">{cred.issuer_name}</strong>
                              </p>
                            </div>
                          </div>
                          <button onClick={() => setActiveModalCred(cred)} title="Inspect"
                            className="p-2 rounded-xl btn-ghost border border-white/[0.07] text-[#7c78a0] hover:text-white shrink-0">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-4 pt-3 pl-3 border-t border-white/[0.06] flex flex-wrap gap-2">
                          {data.cgpa && (
                            <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-[#c4c0dc]">
                              CGPA: <strong className="text-teal-400">{data.cgpa}</strong>
                            </span>
                          )}
                          {data.major && (
                            <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-[#c4c0dc]">
                              {data.major}
                            </span>
                          )}
                          {data.skills && Array.isArray(data.skills) && (
                            <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-[#c4c0dc]">
                              Skills: <strong className="text-violet-400">{data.skills.join(", ")}</strong>
                            </span>
                          )}
                        </div>

                        <div className="mt-3 pl-3 flex items-center gap-1.5 text-[11px] font-mono text-[#5c5880]">
                          <Lock className="w-3 h-3 text-teal-500 shrink-0" />
                          <span className="truncate">SHA-256: {cred.credential_hash.slice(0, 40)}…</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ── TAB: ZK Proofs ────────────────────────── */}
            {activeTab === "zk" && (
              <div className="space-y-5 animate-fade-up">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-teal-400" /> Zero-Knowledge Attribute Proofs
                  </h3>
                  <p className="text-xs text-[#8d8aab] mt-1">
                    Prove a condition without revealing the actual value. The verifier gets a cryptographic guarantee, not your private data.
                  </p>
                </div>

                {/* ZK Generator */}
                <div className="p-5 rounded-2xl glass-panel-teal">
                  <div className="text-xs font-mono text-teal-400 uppercase font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" /> Generate New ZK Proof
                  </div>
                  <form onSubmit={handleCreateZKProof} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">Credential</label>
                      <select value={zkCredId} onChange={e => setZkCredId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-[#06050f]">
                        {credentials.map(c => (
                          <option key={c.id} value={c.id}>{c.credential_data.title || c.credential_type} — {c.issuer_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">Attribute</label>
                        <select value={zkAttr} onChange={e => setZkAttr(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl glass-input text-sm bg-[#06050f]">
                          <option value="cgpa">CGPA</option>
                          <option value="graduation_year">Grad Year</option>
                          <option value="age">Age</option>
                          <option value="score">Score</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">Predicate</label>
                        <select value={zkPredicate} onChange={e => setZkPredicate(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl glass-input text-sm bg-[#06050f]">
                          <option>&gt;</option>
                          <option>&gt;=</option>
                          <option>==</option>
                          <option>&lt;</option>
                          <option>&lt;=</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">Threshold</label>
                        <input type="text" value={zkThreshold} onChange={e => setZkThreshold(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl glass-input text-sm font-mono"
                          placeholder="8.0" />
                      </div>
                    </div>
                    <button type="submit" disabled={zkLoading || credentials.length === 0}
                      className="w-full py-2.5 rounded-xl btn-teal text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                      {zkLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> :
                        <><Fingerprint className="w-4 h-4" /> Generate ZK Proof</>}
                    </button>
                  </form>

                  {/* ZK Result */}
                  {zkResult && (
                    <div className={`mt-4 p-4 rounded-xl border ${zkResult.result
                      ? "bg-emerald-500/10 border-emerald-500/25"
                      : "bg-rose-500/10 border-rose-500/25"}`}>
                      <div className="flex items-center gap-2 mb-3">
                        {zkResult.result ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                        <span className={`font-bold text-sm ${zkResult.result ? "text-emerald-300" : "text-rose-300"}`}>
                          {zkResult.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-black/30 p-2 rounded-lg">
                          <div className="text-[#7c78a0] font-mono">PROOF ID</div>
                          <div className="text-teal-300 font-mono truncate">{zkResult.id.slice(0, 18)}…</div>
                        </div>
                        <div className="bg-black/30 p-2 rounded-lg">
                          <div className="text-[#7c78a0] font-mono">PROOF HASH</div>
                          <div className="text-violet-300 font-mono truncate">{zkResult.proof_hash.slice(0, 18)}…</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#7c78a0] mt-2">
                        Raw value was NEVER shared. Verifier receives only the boolean result above.
                      </p>
                    </div>
                  )}
                </div>

                {/* ZK Proofs List */}
                {zkProofs.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-[#a8a4c8] uppercase tracking-wider mb-2">Generated Proofs</div>
                    {zkProofs.map(zk => (
                      <div key={zk.id} className="p-4 rounded-xl glass-panel border border-white/[0.07] flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                            zk.result ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                          }`}>
                            {zk.result ? "✓" : "✗"}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{zk.label}</div>
                            <div className="text-[11px] text-[#7c78a0] font-mono">{new Date(zk.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                        <button onClick={() => copyToClipboard(zk.id, zk.id)}
                          className="p-1.5 rounded-lg btn-ghost text-[#7c78a0] hover:text-white shrink-0" title="Copy Proof ID">
                          {copiedId === zk.id ? <CheckCheck className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Burn Tokens ──────────────────────── */}
            {activeTab === "burn" && (
              <div className="space-y-5 animate-fade-up">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" /> Burn-After-Reading Tokens
                  </h3>
                  <p className="text-xs text-[#8d8aab] mt-1">
                    Generate a one-time QR link that self-destructs after a single scan or TTL expiry. Replay attacks are blocked and logged.
                  </p>
                </div>

                <div className="p-5 rounded-2xl glass-panel-coral">
                  <div className="text-xs font-mono text-orange-400 uppercase font-bold mb-4 flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5" /> Create Burn Token
                  </div>
                  <form onSubmit={handleCreateBurnToken} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">Approved Consent</label>
                      <select value={burnConsentId} onChange={e => setBurnConsentId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-[#06050f]">
                        {approvedConsents.length > 0
                          ? approvedConsents.map(c => (
                              <option key={c.id} value={c.id}>{c.requester_name} — {new Date(c.created_at).toLocaleDateString()}</option>
                            ))
                          : <option value="">No approved consents</option>
                        }
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#a8a4c8] mb-1.5">
                        TTL: <strong className="text-orange-400">{burnTTL} minute{burnTTL !== 1 ? "s" : ""}</strong>
                      </label>
                      <input type="range" min={1} max={60} value={burnTTL} onChange={e => setBurnTTL(Number(e.target.value))}
                        className="w-full accent-orange-500" />
                      <div className="flex justify-between text-[10px] text-[#5c5880] mt-1 font-mono">
                        <span>1 min</span><span>30 min</span><span>60 min</span>
                      </div>
                    </div>
                    <button type="submit" disabled={burnLoading || !burnConsentId}
                      className="w-full py-2.5 rounded-xl btn-coral text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                      {burnLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> :
                        <><Flame className="w-4 h-4" /> Generate Burn Token</>}
                    </button>
                  </form>

                  {burnResult && (
                    <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/25 space-y-3">
                      <div className="flex items-center gap-2 text-orange-300 font-bold text-sm">
                        <Flame className="w-4 h-4" /> Burn Token Created
                      </div>
                      <div className="text-center py-3">
                        <div className="inline-block p-3 rounded-xl bg-white shadow-xl">
                          <QRCodeSVG value={burnResult.verify_url || `http://localhost:3000/burn/${burnResult.token}`} size={160} level="H" />
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-[#8d8aab] break-all bg-black/40 p-2 rounded-lg">
                        {burnResult.verify_url}
                      </div>
                      <p className="text-[11px] text-orange-300">
                        ⚠ This link expires in {burnTTL} min and will self-destruct after ONE scan.
                      </p>
                    </div>
                  )}
                </div>

                {/* Burn Token History */}
                {burnTokens.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-[#a8a4c8] uppercase tracking-wider mb-2">Token History</div>
                    {burnTokens.map(bt => (
                      <div key={bt.id} className={`p-4 rounded-xl glass-panel border flex items-center justify-between gap-4 ${
                        bt.is_burned ? "border-rose-500/20" : "border-white/[0.07]"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            bt.is_burned ? "bg-rose-500/15" : "bg-orange-500/15"
                          }`}>
                            <Flame className={`w-4 h-4 ${bt.is_burned ? "text-rose-400" : "text-orange-400"}`} />
                          </div>
                          <div>
                            <div className={`text-xs font-bold ${bt.is_burned ? "text-rose-300" : "text-orange-300"}`}>
                              {bt.is_burned ? "BURNED" : "ACTIVE"}
                            </div>
                            <div className="text-[11px] text-[#7c78a0] font-mono">
                              Created: {new Date(bt.created_at).toLocaleString()}
                            </div>
                            {bt.attempted_reuse_count > 0 && (
                              <div className="text-[10px] text-rose-400 font-mono">
                                {bt.attempted_reuse_count} unauthorized replay attempt{bt.attempted_reuse_count !== 1 ? "s" : ""} blocked
                              </div>
                            )}
                          </div>
                        </div>
                        {!bt.is_burned && (
                          <button onClick={() => copyToClipboard(bt.verify_url || "", bt.id)}
                            className="p-1.5 rounded-lg btn-ghost text-[#7c78a0] hover:text-white shrink-0">
                            {copiedId === bt.id ? <CheckCheck className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Credential Intel ─────────────────── */}
            {activeTab === "intel" && (
              <div className="space-y-5 animate-fade-up">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Brain className="w-5 h-5 text-amber-400" /> Credential Intelligence
                    </h3>
                    <p className="text-xs text-[#8d8aab] mt-1">Automated quality & duplicate detection across your entire wallet.</p>
                  </div>
                  {intelReport && (
                    <div className={`text-center px-4 py-2 rounded-xl border ${
                      intelReport.quality_score >= 80 ? "badge-lime" :
                      intelReport.quality_score >= 50 ? "badge-amber" : "badge-rose"
                    }`}>
                      <div className="text-[10px] font-mono uppercase">Quality Score</div>
                      <div className="text-xl font-black">{intelReport.quality_score}/100</div>
                    </div>
                  )}
                </div>

                {intelReport && (
                  <>
                    {/* Summary Grid */}
                    {Object.keys(intelReport.summary).length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(intelReport.summary).map(([type, count]) => (
                          <div key={type} className="p-3 rounded-xl glass-panel border border-amber-500/15 text-center">
                            <div className="text-lg font-black text-amber-300">{count}</div>
                            <div className="text-[10px] font-mono text-[#7c78a0] uppercase">{type.replace("_", " ")}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Flags List */}
                    {intelReport.flags.length === 0 ? (
                      <div className="p-8 text-center glass-panel rounded-2xl border border-white/[0.07]">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                        <h4 className="text-base font-bold text-white">All Clear!</h4>
                        <p className="text-xs text-[#7c78a0] mt-1">No credential issues detected. Your wallet is clean.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {intelReport.flags.map(flag => (
                          <div key={flag.id} className={`p-4 rounded-xl glass-panel border ${
                            flag.severity === "HIGH" ? "border-rose-500/25 bg-rose-500/[0.04]" :
                            flag.severity === "MEDIUM" ? "border-amber-500/25 bg-amber-500/[0.04]" :
                            "border-white/[0.08]"
                          }`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  flag.severity === "HIGH" ? "bg-rose-500/15 text-rose-400" :
                                  flag.severity === "MEDIUM" ? "bg-amber-500/15 text-amber-400" :
                                  "bg-blue-500/15 text-blue-400"
                                }`}>
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                                      flag.severity === "HIGH" ? "badge-rose" :
                                      flag.severity === "MEDIUM" ? "badge-amber" : "badge-teal"
                                    }`}>{flag.flag_type.replace("_", " ")}</span>
                                    <span className="text-[10px] text-[#5c5880] font-mono">{flag.severity}</span>
                                  </div>
                                  <p className="text-xs text-[#c4c0dc] mt-1.5 leading-relaxed">{flag.description}</p>
                                </div>
                              </div>
                              <button onClick={() => handleResolveFlag(flag.id)}
                                className="shrink-0 px-3 py-1.5 rounded-lg btn-ghost text-[11px] font-semibold border border-white/[0.07]">
                                Resolve
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ── TAB: Camera Digitizer ────────────────── */}
            {activeTab === "camera" && (
              <div className="space-y-5 animate-fade-up">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-emerald-400" /> In-App Smart Camera & Document Digitizer
                  </h3>
                  <p className="text-xs text-[#8d8aab] mt-1">
                    Capture a physical certificate with your camera → auto-extract key fields → ready for import. No third-party apps needed.
                  </p>
                </div>

                <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20 space-y-4">
                  {!cameraStream && !capturedImage && (
                    <div className="space-y-3">
                      <div className="aspect-video rounded-xl border-2 border-dashed border-emerald-500/25 bg-emerald-500/[0.03] flex flex-col items-center justify-center gap-3">
                        <Camera className="w-12 h-12 text-emerald-500/50" />
                        <p className="text-sm text-[#7c78a0]">Camera preview will appear here</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={startCamera}
                          className="py-2.5 rounded-xl btn-teal text-sm font-bold flex items-center justify-center gap-2">
                          <Camera className="w-4 h-4" /> Open Camera
                        </button>
                        <label className="py-2.5 rounded-xl btn-ghost text-sm font-bold flex items-center justify-center gap-2 cursor-pointer border border-white/[0.09]">
                          <FileText className="w-4 h-4" /> Upload File
                          <input type="file" accept="image/*,application/pdf" className="sr-only"
                            onChange={() => simulateDigitize()} />
                        </label>
                      </div>
                    </div>
                  )}

                  {cameraStream && (
                    <div className="space-y-3">
                      <div className="aspect-video rounded-xl overflow-hidden bg-black border border-emerald-500/30 relative">
                        <video autoPlay playsInline className="w-full h-full object-cover"
                          ref={el => { if (el && cameraStream) el.srcObject = cameraStream; }} />
                        <div className="absolute inset-0 border-2 border-teal-400/30 rounded-xl pointer-events-none">
                          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-teal-400" />
                          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-teal-400" />
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-teal-400" />
                          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-teal-400" />
                          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-scanline" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { stopCamera(); simulateDigitize(); }}
                          className="py-2.5 rounded-xl btn-teal text-sm font-bold flex items-center justify-center gap-2">
                          <ScanLine className="w-4 h-4" /> Capture & Digitize
                        </button>
                        <button onClick={stopCamera}
                          className="py-2.5 rounded-xl btn-ghost text-sm font-semibold border border-white/[0.09]">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {digitizerLoading && (
                    <div className="py-8 text-center space-y-3">
                      <div className="w-12 h-12 border-2 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mx-auto" />
                      <p className="text-sm text-teal-400 font-medium">Analysing document structure…</p>
                      <p className="text-xs text-[#7c78a0]">Extracting credential fields using OCR pipeline</p>
                    </div>
                  )}

                  {extractedData && !digitizerLoading && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Extraction Complete — Review & Import
                      </div>
                      <div className="grid gap-2">
                        {Object.entries(extractedData).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.07]">
                            <span className="text-[11px] font-mono text-[#7c78a0] uppercase">{key.replace(/_/g, " ")}</span>
                            <span className="text-xs font-semibold text-white max-w-[55%] text-right truncate">{val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 py-2.5 rounded-xl btn-teal text-sm font-bold flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" /> Import to Wallet
                        </button>
                        <button onClick={() => setExtractedData(null)}
                          className="py-2.5 px-4 rounded-xl btn-ghost text-sm border border-white/[0.09]">
                          Discard
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Consent Manager ────────────────────── */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-violet-400" /> Consent Manager
                </h3>
                <p className="text-xs text-[#8d8aab]">You control exactly what employers see.</p>
              </div>
              <div className="flex gap-2">
                {pendingConsents.length > 0 && (
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full badge-amber font-bold animate-pulse-glow">
                    {pendingConsents.length} pending
                  </span>
                )}
              </div>
            </div>

            {consents.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl border border-white/[0.07]">
                <Share2 className="w-8 h-8 text-[#3d3a5c] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">No Requests Yet</h4>
                <p className="text-xs text-[#7c78a0] mt-1">Log in as an employer to send a verification request.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {consents.map(consent => (
                  <div key={consent.id} className={`p-5 rounded-2xl glass-panel border relative ${
                    consent.status === "PENDING" && consent.overshare_warnings?.length
                      ? "border-orange-500/30"
                      : "border-white/[0.07]"
                  }`}>
                    {/* Over-Share Warning Banner */}
                    {consent.overshare_warnings && consent.overshare_warnings.length > 0 && (
                      <div className="mb-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-orange-300 mb-1">⚠ Anomalous Data Request</div>
                          {consent.overshare_warnings.slice(0, 2).map((w, i) => (
                            <p key={i} className="text-[11px] text-orange-200/80">{w}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded badge-violet font-bold">
                          FROM: {consent.requester_name}
                        </span>
                        <div className="text-[11px] text-[#5c5880] mt-1 font-mono">
                          {new Date(consent.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold shrink-0 ${
                        consent.status === "APPROVED" ? "badge-lime" :
                        consent.status === "PENDING" ? "badge-amber" : "badge-rose"
                      }`}>{consent.status}</span>
                    </div>

                    {/* Purpose + Role Context */}
                    {(consent.purpose || consent.role_context) && (
                      <div className="mb-3 text-[11px] bg-black/25 p-2.5 rounded-xl border border-white/[0.05] space-y-1">
                        {consent.role_context && (
                          <div><span className="text-[#7c78a0]">Role:</span> <span className="text-[#c4c0dc]">{consent.role_context}</span></div>
                        )}
                        {consent.purpose && (
                          <div><span className="text-[#7c78a0]">Purpose:</span> <span className="text-[#c4c0dc]">{consent.purpose}</span></div>
                        )}
                      </div>
                    )}

                    {consent.message && (
                      <p className="text-xs text-[#a8a4c8] bg-black/25 p-2.5 rounded-xl border border-white/[0.05] italic mb-3">
                        &ldquo;{consent.message}&rdquo;
                      </p>
                    )}

                    {/* Requested Fields */}
                    <div className="mb-4">
                      <div className="text-[11px] font-semibold text-[#8d8aab] mb-1.5">Requested Fields:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {consent.requested_fields.map((field, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md badge-violet text-[11px] font-mono">
                            ☑ {field}
                          </span>
                        ))}
                      </div>
                    </div>

                    {consent.status === "PENDING" ? (
                      <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
                        <button onClick={() => handleConsentResponse(consent.id, true)}
                          className="flex-1 py-2 rounded-xl btn-teal text-xs font-bold flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => handleConsentResponse(consent.id, false)}
                          className="py-2 px-3 rounded-xl btn-ghost text-xs font-bold border border-white/[0.09] text-rose-400 hover:bg-rose-500/10">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : consent.status === "APPROVED" && consent.verification_token ? (
                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Token Active
                        </span>
                        <button onClick={() => setQrModalToken(consent.verification_token!)}
                          className="px-3 py-1.5 rounded-lg badge-violet text-xs font-semibold flex items-center gap-1.5">
                          <QrCode className="w-3 h-3" /> Show QR
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Modal: Credential Inspector ─────────────── */}
      {activeModalCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="max-w-2xl w-full glass-panel-glow rounded-3xl p-6 border border-violet-500/25 max-h-[90vh] overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg font-bold text-white">Verifiable Credential Payload</h3>
              </div>
              <button onClick={() => setActiveModalCred(null)} className="p-1.5 rounded-lg btn-ghost text-[#7c78a0]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs">
                <div className="text-[#7c78a0] font-mono mb-0.5">CREDENTIAL ID</div>
                <div className="text-white font-mono font-bold">{activeModalCred.id}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs">
                <div className="text-[#7c78a0] font-mono mb-0.5">SHA-256 HASH</div>
                <div className="text-teal-300 font-mono break-all">{activeModalCred.credential_hash}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-[#7c78a0] mb-1">CANONICAL CLAIMS JSON</div>
                <pre className="p-4 rounded-xl bg-black/60 border border-white/[0.08] text-[11px] font-mono text-emerald-300 overflow-x-auto">
                  {JSON.stringify(activeModalCred.credential_data, null, 2)}
                </pre>
              </div>
              <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">
                <strong>Signature:</strong> RSA-2048 PKCS#1 PSS. Verifiable without contacting the original issuer.
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={() => setActiveModalCred(null)}
                className="px-4 py-2 rounded-xl btn-ghost text-xs font-semibold border border-white/[0.09]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: QR Code ───────────────────────────── */}
      {qrModalToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="max-w-sm w-full glass-panel-glow rounded-3xl p-6 text-center border border-violet-500/25 animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-teal-400" /> Verifiable Presentation QR
              </h3>
              <button onClick={() => setQrModalToken(null)} className="p-1 rounded-lg text-[#7c78a0] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#7c78a0] mt-3">
              Present to the employer. Contains only a reference token — never raw credential data.
            </p>
            <div className="my-5 inline-block p-4 rounded-2xl bg-white shadow-2xl">
              <QRCodeSVG value={`http://localhost:3000/verify/${qrModalToken}`} size={180} level="H" includeMargin />
            </div>
            <div className="text-[11px] font-mono text-[#7c78a0] break-all bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
              {qrModalToken}
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Link href={`/verify/${qrModalToken}`} target="_blank"
                className="px-4 py-2 rounded-xl btn-violet text-white text-xs font-bold flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Test Verify
              </Link>
              <button onClick={() => setQrModalToken(null)}
                className="px-4 py-2 rounded-xl btn-ghost text-xs font-semibold border border-white/[0.09]">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
