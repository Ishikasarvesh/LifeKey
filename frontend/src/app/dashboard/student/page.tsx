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
  Fingerprint, ScanLine, Lightbulb, Copy, CheckCheck, Scale
} from "lucide-react";
import CompareRecordsModal from "@/components/CompareRecordsModal";
import CredentialQualityModal from "@/components/CredentialQualityModal";
import { RecordComparison, CredentialQualityReport } from "@/lib/api";

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
  const [comparisonModalData, setComparisonModalData] = useState<RecordComparison | null>(null);
  const [qualityModalReport, setQualityModalReport] = useState<CredentialQualityReport | null>(null);
  const [comparingLoading, setComparingLoading] = useState(false);

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

  const handleOpenCompare = async (credAId: string, credBId: string) => {
    try {
      setComparingLoading(true);
      const comp = await api.compareRecords(credAId, credBId);
      setComparisonModalData(comp);
    } catch (err: any) {
      alert(err.message || "Failed to load record comparison");
    } finally {
      setComparingLoading(false);
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
    <div className="min-h-screen bg-[#F7F8FC] text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white relative overflow-hidden">
      <Navbar />

      {/* Soft Ambient Glow Orbs */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#E8E6FF]/50 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#DCD9FF]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full badge-indigo font-bold tracking-wider">
                CITIZEN HOLDER WALLET
              </span>
              <span className="text-xs text-[#69708A] font-mono font-semibold">ID: {user?.id.slice(0, 8)}…</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10142F] tracking-tight">
              Welcome, <span className="gradient-text-indigo">{user?.name || "Student"}</span>
            </h1>
            <p className="text-sm text-[#69708A] mt-1 font-normal">
              Self-sovereign identity vault · Zero-knowledge proofs · Burn-after-read tokens
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="p-2.5 rounded-2xl bg-white hover:bg-[#F0EEFF] text-[#69708A] hover:text-[#10142F] border border-[#DCD9FF] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <Link href="/verify/lifekey_demo_token_xyz890"
              className="btn-primary px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md">
              <QrCode className="w-3.5 h-3.5" /> Public Verifier
            </Link>
          </div>
        </div>

        {/* ── Action Success ────────────────────────────── */}
        {actionSuccess && (
          <div className="mt-4 p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-sm flex items-center justify-between shadow-sm animate-fade-up">
            <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="w-4 h-4 text-[#10B981]" />{actionSuccess}</div>
            {qrModalToken && (
              <button onClick={() => setQrModalToken(qrModalToken)} className="text-xs font-bold underline hover:text-[#047857]">
                View QR
              </button>
            )}
          </div>
        )}

        {/* ── Overshare Warnings on Pending Consents ──── */}
        {pendingConsents.some(c => c.overshare_warnings && c.overshare_warnings.length > 0) && (
          <div className="mt-5 p-4 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] shadow-sm animate-fade-up">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-[#EA580C]" />
              <span className="font-bold text-[#EA580C] text-sm">Anomalous Data Requests Detected</span>
            </div>
            {pendingConsents.filter(c => c.overshare_warnings?.length).map(c => (
              <div key={c.id} className="mb-1 text-xs text-[#10142F]">
                <span className="font-semibold text-[#10142F]">{c.requester_name}:</span>{" "}
                <span className="text-[#69708A]">{c.overshare_warnings?.join(" · ")}</span>
              </div>
            ))}
            <p className="text-[11px] text-[#69708A] mt-2">
              Review these requests carefully. You can selectively deny unusual fields before approving.
            </p>
          </div>
        )}

        {/* ── Life Transition Passport ────────────────── */}
        {transition && (
          <div className="mt-7 p-6 sm:p-7 rounded-3xl glass-card bg-white border-[#DCD9FF] shadow-sm relative overflow-hidden animate-fade-up">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-5 border-b border-[#F0EEFF]">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#5B5BEF] uppercase font-bold tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" /> LIFE TRANSITION ENGINE
                </div>
                <h2 className="text-2xl font-extrabold text-[#10142F] mt-1">
                  Passport: <span className="gradient-text-indigo">Student → Employee</span>
                </h2>
                <p className="text-sm text-[#69708A] mt-1 max-w-2xl font-normal">
                  Automated onboarding readiness engine. Correlates your verified credentials for zero-reverification employment entry.
                </p>
              </div>
              <div className="flex items-center gap-4 bg-[#F7F6FF] p-4 rounded-2xl border border-[#DCD9FF] shrink-0">
                <div className="text-right">
                  <div className="text-[11px] text-[#69708A] uppercase font-mono tracking-wider font-bold">Readiness</div>
                  <div className="text-xl font-black text-[#10142F] mt-0.5">{transition.completed} / {transition.total}</div>
                  <div className={`text-[11px] font-bold mt-0.5 ${transition.ready ? "text-[#10B981]" : "text-[#D97706]"}`}>
                    {transition.ready ? "✓ TRANSITION READY" : "In Progress"}
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl p-[2px] shadow-sm bg-gradient-to-tr from-[#5B5BEF] to-[#7167F6]">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-black text-lg text-[#5B5BEF]">
                    {Math.round((transition.completed / transition.total) * 100)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {transition.requirements.map((req, idx) => (
                <div key={idx} className={`p-3.5 rounded-2xl border transition-all ${req.met
                  ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                  : "bg-white border-[#DCD9FF] text-[#69708A]"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold">REQ {String(idx + 1).padStart(2, "0")}</span>
                    {req.met ? <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> : <Clock className="w-4 h-4 text-[#D97706]" />}
                  </div>
                  <div className="text-xs font-bold text-[#10142F] leading-snug">{req.name}</div>
                  <div className="text-[10px] mt-1 font-semibold">{req.met ? "Verified" : "Missing"}</div>
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
            <div className="flex gap-1.5 p-1.5 rounded-2xl bg-[#F0EEFF] border border-[#DCD9FF] overflow-x-auto">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all relative shrink-0 ${
                    activeTab === tab.id
                      ? "bg-white text-[#10142F] shadow-sm"
                      : "text-[#69708A] hover:text-[#10142F]"
                  }`}>
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      tab.color === "amber" ? "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]" :
                      tab.color === "teal" ? "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]" :
                      tab.color === "coral" ? "bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]" :
                      "bg-[#F0EEFF] text-[#5B5BEF] border border-[#DCD9FF]"
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
                  <h3 className="text-lg font-extrabold text-[#10142F] flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#5B5BEF]" />
                    <span>Cryptographic Credentials</span>
                  </h3>
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full badge-indigo font-bold">{credentials.length} creds</span>
                </div>
                {loading ? (
                  <div className="p-12 text-center text-[#69708A] text-sm glass-card bg-white border-[#DCD9FF] rounded-2xl">Loading vault…</div>
                ) : credentials.length === 0 ? (
                  <div className="p-10 text-center glass-card bg-white rounded-2xl border-[#DCD9FF]">
                    <GraduationCap className="w-10 h-10 text-[#69708A] mx-auto mb-3" />
                    <h4 className="text-base font-bold text-[#10142F]">No Credentials Yet</h4>
                    <p className="text-xs text-[#69708A] mt-1">Log in as an institution to issue a verifiable award.</p>
                  </div>
                ) : (
                  credentials.map(cred => {
                    const data = cred.credential_data;
                    return (
                      <div key={cred.id} className="p-5 rounded-2xl glass-card bg-white border border-[#DCD9FF] shadow-sm hover:border-[#5B5BEF]/50 transition-all relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl" style={{
                          background: cred.status === "ACTIVE" ? "#10B981" :
                                      cred.status === "REVOKED" ? "#EF4444" : "#F59E0B"
                        }} />
                        <div className="pl-3 flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-[#F0EEFF] border border-[#DCD9FF] flex items-center justify-center text-[#5B5BEF] shadow-sm shrink-0">
                              {cred.credential_type === "DIPLOMA" ? <GraduationCap className="w-5 h-5" /> :
                               cred.credential_type === "SKILL" ? <Award className="w-5 h-5" /> :
                               <FileText className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded badge-indigo font-bold">{cred.credential_type}</span>
                                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold ${
                                  cred.status === "ACTIVE" ? "badge-lime" : "badge-rose"
                                }`}>{cred.status}</span>
                                {cred.quality_status === "review_required" ? (
                                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded font-bold badge-amber flex items-center gap-1">
                                    ⚠ Review Item
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded font-bold badge-lime flex items-center gap-1">
                                    ✓ QA Verified
                                  </span>
                                )}
                              </div>
                              <h4 className="text-base font-bold text-[#10142F] mt-1.5">{data.title || "Verifiable Credential"}</h4>
                              <p className="text-xs text-[#69708A] mt-0.5">
                                Issuer: <strong className="text-[#10142F]">{cred.issuer_name}</strong>
                              </p>
                            </div>
                          </div>
                          <button onClick={() => setActiveModalCred(cred)} title="Inspect Credential Payload"
                            className="p-2.5 rounded-xl bg-white hover:bg-[#F0EEFF] border border-[#DCD9FF] text-[#69708A] hover:text-[#5B5BEF] shadow-sm transition-all shrink-0">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-4 pt-3 pl-3 border-t border-[#F0EEFF] flex flex-wrap gap-2">
                          {data.cgpa && (
                            <span className="px-3 py-1 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF] text-xs text-[#10142F]">
                              CGPA: <strong className="text-[#059669]">{data.cgpa}</strong>
                            </span>
                          )}
                          {data.major && (
                            <span className="px-3 py-1 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF] text-xs text-[#10142F]">
                              {data.major}
                            </span>
                          )}
                          {data.skills && Array.isArray(data.skills) && (
                            <span className="px-3 py-1 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF] text-xs text-[#10142F]">
                              Skills: <strong className="text-[#5B5BEF]">{data.skills.join(", ")}</strong>
                            </span>
                          )}
                        </div>

                        <div className="mt-3 pl-3 flex items-center gap-1.5 text-[11px] font-mono text-[#69708A]">
                          <Lock className="w-3.5 h-3.5 text-[#5B5BEF] shrink-0" />
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
                  <h3 className="text-lg font-extrabold text-[#10142F] flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-[#5B5BEF]" />
                    <span>Zero-Knowledge Attribute Proofs</span>
                  </h3>
                  <p className="text-xs text-[#69708A] mt-1">
                    Prove a condition without revealing the actual value. The verifier gets a cryptographic guarantee, not your private data.
                  </p>
                </div>

                {/* ZK Generator */}
                <div className="p-6 rounded-3xl glass-card bg-white border-[#DCD9FF] shadow-sm">
                  <div className="text-xs font-mono text-[#5B5BEF] uppercase font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" /> Generate New ZK Proof
                  </div>
                  <form onSubmit={handleCreateZKProof} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">Credential</label>
                      <select value={zkCredId} onChange={e => setZkCredId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]">
                        {credentials.map(c => (
                          <option key={c.id} value={c.id}>{c.credential_data.title || c.credential_type} — {c.issuer_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">Attribute</label>
                        <select value={zkAttr} onChange={e => setZkAttr(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]">
                          <option value="cgpa">CGPA</option>
                          <option value="graduation_year">Grad Year</option>
                          <option value="age">Age</option>
                          <option value="score">Score</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">Predicate</label>
                        <select value={zkPredicate} onChange={e => setZkPredicate(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]">
                          <option>&gt;</option>
                          <option>&gt;=</option>
                          <option>==</option>
                          <option>&lt;</option>
                          <option>&lt;=</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">Threshold</label>
                        <input type="text" value={zkThreshold} onChange={e => setZkThreshold(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]"
                          placeholder="8.0" />
                      </div>
                    </div>
                    <button type="submit" disabled={zkLoading || credentials.length === 0}
                      className="btn-primary w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                      {zkLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> :
                        <><Fingerprint className="w-4 h-4" /> Generate ZK Proof</>}
                    </button>
                  </form>

                  {/* ZK Result */}
                  {zkResult && (
                    <div className={`mt-4 p-4 rounded-2xl border ${zkResult.result
                      ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
                      : "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]"}`}>
                      <div className="flex items-center gap-2 mb-3">
                        {zkResult.result ? <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> : <XCircle className="w-5 h-5 text-[#EF4444]" />}
                        <span className="font-bold text-sm">
                          {zkResult.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-white p-2.5 rounded-xl border border-[#DCD9FF]">
                          <div className="text-[#69708A] font-mono font-bold">PROOF ID</div>
                          <div className="text-[#10142F] font-mono truncate">{zkResult.id.slice(0, 18)}…</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-[#DCD9FF]">
                          <div className="text-[#69708A] font-mono font-bold">PROOF HASH</div>
                          <div className="text-[#5B5BEF] font-mono truncate">{zkResult.proof_hash.slice(0, 18)}…</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#69708A] mt-2 font-medium">
                        Raw value was NEVER shared. Verifier receives only the boolean result above.
                      </p>
                    </div>
                  )}
                </div>

                {/* ZK Proofs List */}
                {zkProofs.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-[#10142F] uppercase tracking-wider mb-2">Generated Proofs</div>
                    {zkProofs.map(zk => (
                      <div key={zk.id} className="p-4 rounded-2xl glass-card bg-white border border-[#DCD9FF] shadow-sm flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                            zk.result ? "bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]" : "bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]"
                          }`}>
                            {zk.result ? "✓" : "✗"}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#10142F]">{zk.label}</div>
                            <div className="text-[11px] text-[#69708A] font-mono">{new Date(zk.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                        <button onClick={() => copyToClipboard(zk.id, zk.id)}
                          className="p-2 rounded-xl bg-white hover:bg-[#F0EEFF] text-[#69708A] hover:text-[#10142F] border border-[#DCD9FF] shadow-sm shrink-0" title="Copy Proof ID">
                          {copiedId === zk.id ? <CheckCheck className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
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
                  <h3 className="text-lg font-extrabold text-[#10142F] flex items-center gap-2">
                    <Flame className="w-5 h-5 text-[#EA580C]" />
                    <span>Burn-After-Reading Tokens</span>
                  </h3>
                  <p className="text-xs text-[#69708A] mt-1">
                    Generate a one-time QR link that self-destructs after a single scan or TTL expiry. Replay attacks are blocked and logged.
                  </p>
                </div>

                <div className="p-6 rounded-3xl glass-card bg-white border-[#DCD9FF] shadow-sm">
                  <div className="text-xs font-mono text-[#EA580C] uppercase font-bold mb-4 flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5" /> Create Burn Token
                  </div>
                  <form onSubmit={handleCreateBurnToken} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">Approved Consent</label>
                      <select value={burnConsentId} onChange={e => setBurnConsentId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]">
                        {approvedConsents.length > 0
                          ? approvedConsents.map(c => (
                              <option key={c.id} value={c.id}>{c.requester_name} — {new Date(c.created_at).toLocaleDateString()}</option>
                            ))
                          : <option value="">No approved consents</option>
                        }
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">
                        TTL: <strong className="text-[#EA580C]">{burnTTL} minute{burnTTL !== 1 ? "s" : ""}</strong>
                      </label>
                      <input type="range" min={1} max={60} value={burnTTL} onChange={e => setBurnTTL(Number(e.target.value))}
                        className="w-full accent-[#5B5BEF]" />
                      <div className="flex justify-between text-[10px] text-[#69708A] mt-1 font-mono font-bold">
                        <span>1 min</span><span>30 min</span><span>60 min</span>
                      </div>
                    </div>
                    <button type="submit" disabled={burnLoading || !burnConsentId}
                      className="btn-primary w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50">
                      {burnLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> :
                        <><Flame className="w-4 h-4" /> Generate Burn Token</>}
                    </button>
                  </form>

                  {burnResult && (
                    <div className="mt-4 p-5 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] space-y-3">
                      <div className="flex items-center gap-2 text-[#EA580C] font-bold text-sm">
                        <Flame className="w-4 h-4" /> Burn Token Created
                      </div>
                      <div className="text-center py-3">
                        <div className="inline-block p-4 rounded-2xl bg-white shadow-xl border border-[#DCD9FF]">
                          <QRCodeSVG value={burnResult.verify_url || `http://localhost:3000/burn/${burnResult.token}`} size={160} level="H" />
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-[#69708A] break-all bg-white p-3 rounded-xl border border-[#DCD9FF]">
                        {burnResult.verify_url}
                      </div>
                      <p className="text-[11px] text-[#EA580C] font-semibold">
                        ⚠ This link expires in {burnTTL} min and will self-destruct after ONE scan.
                      </p>
                    </div>
                  )}
                </div>

                {/* Burn Token History */}
                {burnTokens.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-[#10142F] uppercase tracking-wider mb-2">Token History</div>
                    {burnTokens.map(bt => (
                      <div key={bt.id} className={`p-4 rounded-2xl glass-card bg-white border flex items-center justify-between gap-4 shadow-sm ${
                        bt.is_burned ? "border-[#FECACA]" : "border-[#DCD9FF]"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            bt.is_burned ? "bg-[#FEF2F2] text-[#EF4444]" : "bg-[#FFF7ED] text-[#EA580C]"
                          }`}>
                            <Flame className="w-4 h-4" />
                          </div>
                          <div>
                            <div className={`text-xs font-bold ${bt.is_burned ? "text-[#EF4444]" : "text-[#EA580C]"}`}>
                              {bt.is_burned ? "BURNED" : "ACTIVE"}
                            </div>
                            <div className="text-[11px] text-[#69708A] font-mono">
                              Created: {new Date(bt.created_at).toLocaleString()}
                            </div>
                            {bt.attempted_reuse_count > 0 && (
                              <div className="text-[10px] text-[#DC2626] font-mono font-bold">
                                {bt.attempted_reuse_count} unauthorized replay attempt{bt.attempted_reuse_count !== 1 ? "s" : ""} blocked
                              </div>
                            )}
                          </div>
                        </div>
                        {!bt.is_burned && (
                          <button onClick={() => copyToClipboard(bt.verify_url || "", bt.id)}
                            className="p-2 rounded-xl bg-white hover:bg-[#F0EEFF] text-[#69708A] hover:text-[#10142F] border border-[#DCD9FF] shadow-sm shrink-0">
                            {copiedId === bt.id ? <CheckCheck className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
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
                    <h3 className="text-lg font-extrabold text-[#10142F] flex items-center gap-2">
                      <Brain className="w-5 h-5 text-[#5B5BEF]" />
                      <span>Credential Intelligence</span>
                    </h3>
                    <p className="text-xs text-[#69708A] mt-1 font-normal">Automated quality & duplicate detection across your entire wallet.</p>
                  </div>
                  {intelReport && (
                    <div className={`text-center px-4 py-2 rounded-2xl border ${
                      intelReport.quality_score >= 80 ? "badge-lime" :
                      intelReport.quality_score >= 50 ? "badge-amber" : "badge-rose"
                    }`}>
                      <div className="text-[10px] font-mono uppercase font-bold">Quality Score</div>
                      <div className="text-xl font-black">{intelReport.quality_score}/100</div>
                    </div>
                  )}
                </div>

                {intelReport && (
                  <>
                    {/* Summary Grid */}
                    {Object.keys(intelReport.summary).length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {Object.entries(intelReport.summary).map(([type, count]) => (
                          <div key={type} className="p-3.5 rounded-2xl glass-card bg-white border border-[#DCD9FF] text-center shadow-sm">
                            <div className="text-xl font-black text-[#5B5BEF]">{count}</div>
                            <div className="text-[10px] font-mono text-[#69708A] uppercase font-bold">{type.replace("_", " ")}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Flags List */}
                    {intelReport.flags.length === 0 ? (
                      <div className="p-8 text-center glass-card bg-white rounded-2xl border-[#A7F3D0] shadow-sm">
                        <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto mb-3" />
                        <h4 className="text-base font-bold text-[#10142F]">All Clear!</h4>
                        <p className="text-xs text-[#69708A] mt-1">No credential issues detected. Your wallet is clean.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {intelReport.flags.map(flag => (
                          <div key={flag.id} className={`p-4 rounded-2xl glass-card bg-white border shadow-sm ${
                            flag.severity === "HIGH" ? "border-[#FECACA] bg-[#FEF2F2]/20" :
                            flag.severity === "MEDIUM" ? "border-[#FDE68A] bg-[#FFFBEB]/20" :
                            "border-[#DCD9FF]"
                          }`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                  flag.severity === "HIGH" ? "bg-[#FEF2F2] text-[#EF4444]" :
                                  flag.severity === "MEDIUM" ? "bg-[#FFFBEB] text-[#D97706]" :
                                  "bg-[#F0EEFF] text-[#5B5BEF]"
                                }`}>
                                  <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                                      flag.severity === "HIGH" ? "badge-rose" :
                                      flag.severity === "MEDIUM" ? "badge-amber" : "badge-indigo"
                                    }`}>{flag.flag_type.replace("_", " ")}</span>
                                    <span className="text-[10px] text-[#69708A] font-mono font-semibold">{flag.severity}</span>
                                  </div>
                                  <p className="text-xs font-semibold text-[#10142F] mt-1.5 leading-relaxed">{flag.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {flag.credential_id_b && (
                                  <button onClick={() => handleOpenCompare(flag.credential_id_a, flag.credential_id_b!)}
                                    disabled={comparingLoading}
                                    className="px-3 py-1.5 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] text-[11px] font-bold flex items-center gap-1 shadow-sm">
                                    <Scale className="w-3 h-3" /> Compare
                                  </button>
                                )}
                                <button onClick={() => handleResolveFlag(flag.id)}
                                  className="px-3 py-1.5 rounded-xl btn-secondary text-[11px] font-bold">
                                  Resolve
                                </button>
                              </div>
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
                  <h3 className="text-lg font-extrabold text-[#10142F] flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#5B5BEF]" />
                    <span>In-App Smart Camera & Document Digitizer</span>
                  </h3>
                  <p className="text-xs text-[#69708A] mt-1">
                    Capture a physical certificate with your camera → auto-extract key fields → ready for import.
                  </p>
                </div>

                <div className="p-6 rounded-3xl glass-card bg-white border-[#DCD9FF] shadow-sm space-y-4">
                  {!cameraStream && !capturedImage && (
                    <div className="space-y-3">
                      <div className="aspect-video rounded-2xl border-2 border-dashed border-[#DCD9FF] bg-[#F7F6FF] flex flex-col items-center justify-center gap-3">
                        <Camera className="w-12 h-12 text-[#69708A]" />
                        <p className="text-sm font-semibold text-[#69708A]">Camera preview will appear here</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={startCamera}
                          className="btn-primary py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md">
                          <Camera className="w-4 h-4" /> Open Camera
                        </button>
                        <label className="btn-secondary py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
                          <FileText className="w-4 h-4" /> Upload File
                          <input type="file" accept="image/*,application/pdf" className="sr-only"
                            onChange={() => simulateDigitize()} />
                        </label>
                      </div>
                    </div>
                  )}

                  {cameraStream && (
                    <div className="space-y-3">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-[#DCD9FF] relative shadow-lg">
                        <video autoPlay playsInline className="w-full h-full object-cover"
                          ref={el => { if (el && cameraStream) el.srcObject = cameraStream; }} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { stopCamera(); simulateDigitize(); }}
                          className="btn-primary py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2">
                          <ScanLine className="w-4 h-4" /> Capture & Digitize
                        </button>
                        <button onClick={stopCamera}
                          className="btn-secondary py-3 rounded-2xl text-xs font-bold">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {digitizerLoading && (
                    <div className="py-8 text-center space-y-3">
                      <div className="w-10 h-10 border-3 border-[#E8E6FF] border-t-[#5B5BEF] rounded-full animate-spin mx-auto" />
                      <p className="text-sm font-bold text-[#10142F]">Analysing document structure…</p>
                      <p className="text-xs text-[#69708A]">Extracting credential fields using OCR pipeline</p>
                    </div>
                  )}

                  {extractedData && !digitizerLoading && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[#059669] font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Extraction Complete — Review & Import
                      </div>
                      <div className="grid gap-2">
                        {Object.entries(extractedData).map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]">
                            <span className="text-[11px] font-mono text-[#69708A] font-bold uppercase">{key.replace(/_/g, " ")}</span>
                            <span className="text-xs font-bold text-[#10142F] max-w-[55%] text-right truncate">{val}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button className="flex-1 py-3 rounded-2xl btn-primary text-xs font-bold flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" /> Import to Wallet
                        </button>
                        <button onClick={() => setExtractedData(null)}
                          className="btn-secondary py-3 px-5 rounded-2xl text-xs font-bold">
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
                <h3 className="text-lg font-extrabold text-[#10142F] flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#5B5BEF]" />
                  <span>Consent Manager</span>
                </h3>
                <p className="text-xs text-[#69708A]">You control exactly what employers see.</p>
              </div>
              <div>
                {pendingConsents.length > 0 && (
                  <span className="text-[11px] font-mono px-3 py-1 rounded-full badge-amber font-bold shadow-sm">
                    {pendingConsents.length} pending
                  </span>
                )}
              </div>
            </div>

            {consents.length === 0 ? (
              <div className="p-8 text-center glass-card bg-white rounded-2xl border-[#DCD9FF] shadow-sm">
                <Share2 className="w-8 h-8 text-[#69708A] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#10142F]">No Requests Yet</h4>
                <p className="text-xs text-[#69708A] mt-1">Log in as an employer to send a verification request.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {consents.map(consent => (
                  <div key={consent.id} className={`p-5 rounded-2xl glass-card bg-white border shadow-sm ${
                    consent.status === "PENDING" && consent.overshare_warnings?.length
                      ? "border-[#FED7AA] bg-[#FFF7ED]/30"
                      : "border-[#DCD9FF]"
                  }`}>
                    {/* Over-Share Warning Banner */}
                    {consent.overshare_warnings && consent.overshare_warnings.length > 0 && (
                      <div className="mb-3 p-3 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-[#EA580C] mb-1">⚠ Anomalous Data Request</div>
                          {consent.overshare_warnings.slice(0, 2).map((w, i) => (
                            <p key={i} className="text-[11px] text-[#9A3412]">{w}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded badge-indigo font-bold">
                          FROM: {consent.requester_name}
                        </span>
                        <div className="text-[11px] text-[#69708A] mt-1 font-mono font-medium">
                          {new Date(consent.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                        consent.status === "APPROVED" ? "badge-lime" :
                        consent.status === "PENDING" ? "badge-amber" : "badge-rose"
                      }`}>{consent.status}</span>
                    </div>

                    {/* Purpose + Role Context */}
                    {(consent.role_context || consent.purpose) && (
                      <div className="mb-3 text-[11px] bg-[#F7F6FF] p-3 rounded-xl border border-[#DCD9FF] space-y-1">
                        {consent.role_context && (
                          <div><span className="text-[#69708A] font-bold">Role:</span> <span className="text-[#10142F] font-semibold">{consent.role_context}</span></div>
                        )}
                        {consent.purpose && (
                          <div><span className="text-[#69708A] font-bold">Purpose:</span> <span className="text-[#10142F]">{consent.purpose}</span></div>
                        )}
                      </div>
                    )}

                    {consent.message && (
                      <p className="text-xs text-[#69708A] bg-[#F7F6FF] p-3 rounded-xl border border-[#DCD9FF] italic mb-3">
                        &ldquo;{consent.message}&rdquo;
                      </p>
                    )}

                    {/* Requested Fields */}
                    <div className="mb-4">
                      <div className="text-[11px] font-bold text-[#10142F] mb-1.5 uppercase font-mono">Requested Fields:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {consent.requested_fields.map((field, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-md badge-indigo text-[11px] font-mono font-semibold">
                            ☑ {field}
                          </span>
                        ))}
                      </div>
                    </div>

                    {consent.status === "PENDING" ? (
                      <div className="flex gap-2 pt-2 border-t border-[#F0EEFF]">
                        <button onClick={() => handleConsentResponse(consent.id, true)}
                          className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => handleConsentResponse(consent.id, false)}
                          className="py-2.5 px-4 rounded-xl btn-secondary text-xs font-bold text-[#EF4444] border-[#FECACA] hover:bg-[#FEF2F2]">
                          <X className="w-3.5 h-3.5" /> Deny
                        </button>
                      </div>
                    ) : consent.status === "APPROVED" && consent.verification_token ? (
                      <div className="pt-2 border-t border-[#F0EEFF] flex items-center justify-between">
                        <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Token Active
                        </span>
                        <button onClick={() => setQrModalToken(consent.verification_token!)}
                          className="px-3.5 py-1.5 rounded-xl btn-secondary text-xs font-bold flex items-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5 text-[#5B5BEF]" /> Show QR
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="max-w-2xl w-full glass-card bg-white rounded-3xl p-6 sm:p-7 border-[#DCD9FF] shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EEFF]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F0EEFF] border border-[#DCD9FF] flex items-center justify-center text-[#5B5BEF]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-[#10142F]">Verifiable Credential Payload</h3>
              </div>
              <button onClick={() => setActiveModalCred(null)} className="p-1 rounded-lg text-[#69708A] hover:text-[#10142F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF] text-xs">
                <div className="text-[#69708A] font-mono font-bold mb-0.5">CREDENTIAL ID</div>
                <div className="text-[#10142F] font-mono font-bold">{activeModalCred.id}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF] text-xs">
                <div className="text-[#69708A] font-mono font-bold mb-0.5">SHA-256 HASH</div>
                <div className="text-[#5B5BEF] font-mono font-semibold break-all">{activeModalCred.credential_hash}</div>
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-[#10142F] mb-1.5 uppercase">CANONICAL CLAIMS JSON</div>
                <pre className="p-4 rounded-2xl bg-[#10142F] border border-[#DCD9FF] text-[11px] font-mono text-[#A7F3D0] overflow-x-auto shadow-inner">
                  {JSON.stringify(activeModalCred.credential_data, null, 2)}
                </pre>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F0EEFF] border border-[#DCD9FF] text-xs text-[#5B5BEF]">
                <strong>Signature:</strong> RSA-2048 PKCS#1 PSS. Verifiable without contacting the original issuer.
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                onClick={async () => {
                  try {
                    const rep = await api.getCredentialIntelligence(activeModalCred.id);
                    setQualityModalReport(rep);
                  } catch (err: any) {
                    alert(err.message || "Failed to run quality check");
                  }
                }}
                className="btn-primary px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Brain className="w-4 h-4" />
                <span>Credential Quality Report</span>
              </button>
              <button onClick={() => setActiveModalCred(null)}
                className="btn-secondary px-5 py-2.5 rounded-2xl text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: QR Code ───────────────────────────── */}
      {qrModalToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="max-w-sm w-full glass-card bg-white rounded-3xl p-6 text-center border-[#DCD9FF] shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
              <h3 className="text-sm font-extrabold text-[#10142F] flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#5B5BEF]" />
                <span>Verifiable Presentation QR</span>
              </h3>
              <button onClick={() => setQrModalToken(null)} className="p-1 rounded-lg text-[#69708A] hover:text-[#10142F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#69708A] mt-3">
              Present to the employer. Contains only a reference token — never raw credential data.
            </p>
            <div className="my-5 inline-block p-4 rounded-2xl bg-white shadow-xl border border-[#DCD9FF]">
              <QRCodeSVG value={`http://localhost:3000/verify/${qrModalToken}`} size={180} level="H" includeMargin />
            </div>
            <div className="text-[11px] font-mono text-[#69708A] break-all bg-[#F7F6FF] p-2.5 rounded-xl border border-[#DCD9FF]">
              {qrModalToken}
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Link href={`/verify/${qrModalToken}`} target="_blank"
                className="btn-primary px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                <ExternalLink className="w-3.5 h-3.5" /> Test Verify
              </Link>
              <button onClick={() => setQrModalToken(null)}
                className="btn-secondary px-4 py-2.5 rounded-2xl text-xs font-bold">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Credential Quality Report ───────── */}
      {qualityModalReport && (
        <CredentialQualityModal
          report={qualityModalReport}
          onClose={() => setQualityModalReport(null)}
          onOpenCompare={(comp) => {
            setComparisonModalData(comp);
          }}
        />
      )}

      {/* ── Modal: Side-by-Side Record Comparison ──── */}
      {comparisonModalData && (
        <CompareRecordsModal
          comparison={comparisonModalData}
          onClose={() => setComparisonModalData(null)}
          onAcknowledge={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
}
