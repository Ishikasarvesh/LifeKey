"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert,
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  FileCheck2, 
  Share2, 
  RefreshCw, 
  EyeOff, 
  ChevronRight,
  Fingerprint,
  QrCode,
  Layers,
  Database,
  ArrowDownRight,
  AlertTriangle,
  Flame,
  Brain,
  Shield,
  Zap,
  Info,
  Check,
  XCircle
} from "lucide-react";

export default function Home() {
  const [activeWowTab, setActiveWowTab] = useState<"valid" | "tampered" | "revoked" | "zk" | "burn">("valid");

  return (
    <div className="min-h-screen bg-[#06050f] text-[#e2e0f0] flex flex-col selection:bg-violet-700 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden bg-grid-pattern">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-violet-600/25 via-teal-500/15 to-orange-500/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-violet-500/20 text-xs font-mono text-teal-300 mb-6 backdrop-blur-md shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>UNIFIED LIFE-STAGE DIGITAL IDENTITY & RECORD NETWORK</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.12]">
              One Trusted Identity. <br />
              <span className="gradient-text-violet">
                Every Life-Stage Transition.
              </span>
            </h1>

            {/* Strategic Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-[#b4b0d0] max-w-3xl mx-auto font-light leading-relaxed">
              We do not build another DigiLocker. We build the <strong className="text-white font-semibold">citizen-controlled interoperability + selective consent layer</strong> that carries cryptographically verified proof from <span className="text-teal-400 font-medium">Education</span> to <span className="text-violet-400 font-medium">Employment</span> and beyond.
            </p>

            {/* Key distinction badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="font-mono px-3 py-1 rounded-full badge-violet font-semibold">W3C VC 2.0</span>
              <span className="font-mono px-3 py-1 rounded-full badge-teal font-semibold">Zero-Knowledge Proofs</span>
              <span className="font-mono px-3 py-1 rounded-full badge-coral font-semibold">Burn-After-Reading QR</span>
              <span className="font-mono px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#a09cb8] font-semibold">RSA-2048 Digital Signatures</span>
            </div>

            {/* Quick Demo Launchers */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl btn-violet text-white font-bold shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/verify/lifekey_demo_token_xyz890"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-200 border border-white/[0.12] font-semibold transition-all duration-300"
              >
                <QrCode className="w-4 h-4 text-teal-400" />
                <span>Verify Demo Presentation Token</span>
              </Link>
            </div>

            {/* Instant Role Jump Cards for Judges */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
              <Link
                href="/login"
                className="p-5 rounded-2xl glass-panel hover:border-teal-500/40 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded badge-teal font-bold">
                    HOLD & CONSENT
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                  1. Student Wallet
                </h3>
                <p className="text-xs text-[#8d8aab] mt-1">
                  Parth Patil • ZK Attribute Proofs, Burn Tokens, Over-Share Alerts, OCR Digitizer & Life Transition Passport.
                </p>
                <div className="mt-3 flex items-center text-xs text-teal-400 font-medium">
                  Enter Wallet <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>

              <Link
                href="/login"
                className="p-5 rounded-2xl glass-panel hover:border-violet-500/40 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded badge-violet font-bold">
                    ISSUE & QA
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                  2. Institution Portal
                </h3>
                <p className="text-xs text-[#8d8aab] mt-1">
                  ABC Polytechnic • Issue RSA-signed credentials, manage live revocation, and run Credential Intelligence QA.
                </p>
                <div className="mt-3 flex items-center text-xs text-violet-400 font-medium">
                  Enter Issuer <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>

              <Link
                href="/login"
                className="p-5 rounded-2xl glass-panel hover:border-amber-500/40 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded badge-coral font-bold">
                    VERIFY & AUDIT
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  3. Employer Verifier
                </h3>
                <p className="text-xs text-[#8d8aab] mt-1">
                  TechNova HR • Request purpose-bound consent, verify burn tokens, live Tamper Detection Lab & audit ledger.
                </p>
                <div className="mt-3 flex items-center text-xs text-amber-400 font-medium">
                  Enter Verifier <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Breakthrough Features Grid */}
      <section className="py-20 border-y border-white/[0.08] bg-[#0c0b1a]/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-2">
              Next-Generation Cryptographic Primitives
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Built for Real-World Transition Security
            </h3>
            <p className="text-[#8d8aab] mt-3 text-sm sm:text-base">
              Moving beyond static PDFs to privacy-preserving claims, ephemeral consent tokens, and neural audit safeguards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl glass-panel border border-violet-500/20 hover:border-violet-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Zero-Knowledge Proofs</h4>
              <p className="text-xs text-[#8d8aab] mt-2 leading-relaxed">
                Prove &ldquo;CGPA &gt; 8.0&rdquo; or &ldquo;Age &gt; 18&rdquo; with mathematical certainty without revealing actual GPA transcripts or exact birth dates.
              </p>
              <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] font-mono text-violet-300">
                • Attribute Range Guarantees<br />
                • Zero Raw Data Exposure<br />
                • W3C ZK Digest Compliant
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl glass-panel border border-coral-500/20 hover:border-coral-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Burn-After-Reading</h4>
              <p className="text-xs text-[#8d8aab] mt-2 leading-relaxed">
                Self-destructing QR codes and presentation URLs that instantly burn after 1 successful verification or strict 5-minute TTL.
              </p>
              <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] font-mono text-orange-300">
                • Single-Use Replay Defense<br />
                • Active Lockout on Scan #2<br />
                • Live Candidate Alert Log
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl glass-panel border border-teal-500/20 hover:border-teal-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Over-Share Shield</h4>
              <p className="text-xs text-[#8d8aab] mt-2 leading-relaxed">
                Logic engine compares requested fields against stated role purpose. Flags anomalous data requests before the candidate approves.
              </p>
              <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] font-mono text-teal-300">
                • Purpose-Bound Filtering<br />
                • Anomalous Request Flagging<br />
                • Candidate Privacy Coaching
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl glass-panel border border-violet-500/20 hover:border-violet-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Credential Intelligence QA</h4>
              <p className="text-xs text-[#8d8aab] mt-2 leading-relaxed">
                Automated registry audit detecting duplicate awards, conflicting graduation dates, and schema anomalies across institutional issuers.
              </p>
              <div className="mt-4 pt-3 border-t border-white/[0.08] text-[11px] font-mono text-violet-300">
                • Duplicate Award Detection<br />
                • Date Conflict Auditing<br />
                • Institutional Quality Score
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Judge WOW Moments Live Simulator */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-2">
              Cryptographic Defensibility
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              The 5 Judge &ldquo;WOW&rdquo; Moments
            </h3>
            <p className="text-[#8d8aab] mt-3 text-sm sm:text-base">
              Instead of telling judges &ldquo;we use cryptography&rdquo;, LIFEKEY makes trust visible, tamper-evident, and revocable in real time.
            </p>
          </div>

          {/* 5-Tab Selector */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
              <button
                onClick={() => setActiveWowTab("valid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeWowTab === "valid"
                    ? "btn-teal text-white shadow-lg"
                    : "text-[#8d8aab] hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>1. Authentic VC</span>
              </button>

              <button
                onClick={() => setActiveWowTab("tampered")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeWowTab === "tampered"
                    ? "bg-rose-600 text-white shadow-lg"
                    : "text-[#8d8aab] hover:text-white"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>2. Tamper Alert</span>
              </button>

              <button
                onClick={() => setActiveWowTab("revoked")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeWowTab === "revoked"
                    ? "bg-amber-600 text-white shadow-lg"
                    : "text-[#8d8aab] hover:text-white"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>3. Live Revocation</span>
              </button>

              <button
                onClick={() => setActiveWowTab("zk")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeWowTab === "zk"
                    ? "btn-violet text-white shadow-lg"
                    : "text-[#8d8aab] hover:text-white"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>4. Zero-Knowledge</span>
              </button>

              <button
                onClick={() => setActiveWowTab("burn")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeWowTab === "burn"
                    ? "btn-coral text-white shadow-lg"
                    : "text-[#8d8aab] hover:text-white"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>5. Burn Token</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulator Screen */}
          <div className="max-w-4xl mx-auto">
            {activeWowTab === "valid" && (
              <div className="glass-panel rounded-3xl p-8 border border-teal-500/30 transition-all duration-300 animate-fade-up">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full badge-lime font-bold">
                      ✓ STATUS: VALID & AUTHENTIC
                    </span>
                    <h4 className="text-2xl font-bold text-white mt-2">
                      Diploma in Artificial Intelligence & Machine Learning
                    </h4>
                    <p className="text-xs text-[#8d8aab] mt-1">
                      Holder: Parth Patil • Issuer: ABC Polytechnic Institute • Year: 2026
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 font-mono text-xs">
                    SHA-256 Match: 100%
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-xs text-[#8d8aab]">Digital Signature Verification</div>
                    <div className="text-sm font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> RSA-2048 PSS Signature VALID
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-xs text-[#8d8aab]">Cryptographic Hash (SHA-256)</div>
                    <div className="text-sm font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Payload Integrity VERIFIED
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-xs text-[#8d8aab]">Issuer Status Registry</div>
                    <div className="text-sm font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> ABC Polytechnic (Accredited Issuer)
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-xs text-[#8d8aab]">Candidate Consent Verification</div>
                    <div className="text-sm font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Explicit Selective Consent GRANTED
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-teal-500/[0.08] border border-teal-500/20 text-xs text-teal-200 flex items-center justify-between">
                  <span>Standard W3C Verifiable Credential verified in <strong>21ms</strong>. Zero central point of failure.</span>
                  <Link href="/verify/lifekey_demo_token_xyz890" className="underline font-semibold hover:text-white">
                    Inspect Real QR Result &rarr;
                  </Link>
                </div>
              </div>
            )}

            {activeWowTab === "tampered" && (
              <div className="glass-panel rounded-3xl p-8 border border-rose-500/40 transition-all duration-300 animate-fade-up">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full badge-rose font-bold">
                      ❌ INTEGRITY CHECK FAILED: BIT-FLIP TAMPERING DETECTED
                    </span>
                    <h4 className="text-2xl font-bold text-white mt-2">
                      Local Client Modification Blocked
                    </h4>
                    <p className="text-xs text-[#8d8aab] mt-1">
                      Simulated alteration: Candidate edited CGPA from 8.85 &rarr; <span className="text-rose-400 font-bold">9.95</span>
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs">
                    Hash Divergence: 100%
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                    <div className="text-xs text-[#8d8aab]">Issuer Signed SHA-256 Digest</div>
                    <div className="text-xs font-mono text-gray-300 mt-1 truncate">
                      e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
                    <div className="text-xs text-rose-300 font-semibold">Calculated Tampered Hash</div>
                    <div className="text-xs font-mono text-rose-400 mt-1 truncate">
                      a14f923b72c918a240899fcde11598f8a846171891b92019842bf92801481b92
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-200">
                  <strong className="block mb-1 text-sm">Judge Takeaway:</strong>
                  Even if a student modifies a single character on their client side, the canonical SHA-256 hash immediately diverges from the issuer&apos;s RSA signature. The employer verification fails instantly.
                </div>
              </div>
            )}

            {activeWowTab === "revoked" && (
              <div className="glass-panel rounded-3xl p-8 border border-amber-500/40 transition-all duration-300 animate-fade-up">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full badge-coral font-bold">
                      ⚠️ CREDENTIAL WITHDRAWN: REVOKED BY ISSUER
                    </span>
                    <h4 className="text-2xl font-bold text-white mt-2">
                      Real-Time Lifecycle Revocation
                    </h4>
                    <p className="text-xs text-[#8d8aab] mt-1">
                      Reason: Academic record superseded / disciplinary retraction by ABC Polytechnic
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs">
                    Status: REVOKED
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-xs text-[#8d8aab]">Cryptographic Signature</div>
                    <div className="text-sm font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Signature Still Mathematically Valid
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <div className="text-xs text-amber-300 font-semibold">Live Status Registry Check</div>
                    <div className="text-sm font-mono text-amber-400 mt-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Revocation Active on Network
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200">
                  <strong className="block mb-1 text-sm">Judge Takeaway:</strong>
                  Static QR codes and paper PDFs cannot be revoked once printed. LIFEKEY queries a live cryptographic revocation registry so revoked or suspended credentials fail immediately.
                </div>
              </div>
            )}

            {activeWowTab === "zk" && (
              <div className="glass-panel-glow rounded-3xl p-8 border border-violet-500/40 transition-all duration-300 animate-fade-up">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full badge-violet font-bold">
                      ⚡ ZERO-KNOWLEDGE ATTRIBUTE PROOF
                    </span>
                    <h4 className="text-2xl font-bold text-white mt-2">
                      Mathematical Range Claim: CGPA &gt; 8.0
                    </h4>
                    <p className="text-xs text-[#8d8aab] mt-1">
                      Verifier receives cryptographic confirmation that candidate exceeds cut-off without knowing exact GPA or transcripts.
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 font-mono text-xs">
                    Result: TRUE ✓
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                    <div className="text-xs text-[#8d8aab]">Underlying Raw Data (Secret)</div>
                    <div className="text-sm font-mono text-violet-300 mt-1 flex items-center gap-1.5">
                      <Lock className="w-4 h-4" /> [PROTECTED IN STUDENT VAULT]
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
                    <div className="text-xs text-violet-300 font-semibold">Verifier Guarantee</div>
                    <div className="text-sm font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Predicate (CGPA &gt; 8.0) Cryptographically Proven
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-violet-500/15 border border-violet-500/30 text-xs text-violet-200">
                  <strong className="block mb-1 text-sm">Judge Takeaway:</strong>
                  Instead of violating privacy by forcing candidates to upload full academic transcripts, employers obtain mathematically guaranteed boolean attestations.
                </div>
              </div>
            )}

            {activeWowTab === "burn" && (
              <div className="glass-panel-coral rounded-3xl p-8 border border-orange-500/40 transition-all duration-300 animate-fade-up">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
                  <div>
                    <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full badge-coral font-bold">
                      🔥 BURN-AFTER-READING CONSENT TOKEN
                    </span>
                    <h4 className="text-2xl font-bold text-white mt-2">
                      Single-Use Ephemeral Verification Link
                    </h4>
                    <p className="text-xs text-[#8d8aab] mt-1">
                      Token auto-destructs the millisecond an employer completes verification. Replay attempts trigger active intrusion warnings.
                    </p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 font-mono text-xs">
                    State: CONSUMED / BURNED
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="text-xs text-[#8d8aab]">First Scan (Legitimate HR)</div>
                    <div className="text-sm font-mono text-emerald-400 mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Granted Access &amp; Token Deactivated
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                    <div className="text-xs text-orange-300 font-semibold">Second Scan (Replay Attack)</div>
                    <div className="text-sm font-mono text-rose-400 mt-1 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> BLOCKED &bull; Intrusion Logged to Student
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-orange-500/15 border border-orange-500/30 text-xs text-orange-200">
                  <strong className="block mb-1 text-sm">Judge Takeaway:</strong>
                  Prevents employers or third parties from bookmarking, sharing, or indefinitely harvesting a student&apos;s credential verification link.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Comparison with DigiLocker / NAD */}
      <section className="py-20 border-t border-white/[0.08] bg-[#0c0b1a]/40 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-2">
              Strategic Value Differentiation
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Why Not Just DigiLocker?
            </h3>
            <p className="text-[#8d8aab] mt-3 text-sm">
              DigiLocker is a secure document vault. LIFEKEY is the cross-domain interoperability &amp; selective consent engine.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse rounded-3xl overflow-hidden glass-panel">
              <thead>
                <tr className="border-b border-white/[0.1] bg-white/[0.03]">
                  <th className="p-4 sm:p-5 font-semibold text-gray-300">Capability</th>
                  <th className="p-4 sm:p-5 font-semibold text-[#7c78a0]">Static PDFs / Physical</th>
                  <th className="p-4 sm:p-5 font-semibold text-violet-300">DigiLocker / NAD</th>
                  <th className="p-4 sm:p-5 font-bold text-teal-300 bg-teal-500/10">LIFEKEY (Our Layer)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-[#b4b0d0]">
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">System Architecture</td>
                  <td className="p-4 sm:p-5 text-[#7c78a0]">Paper / Unstructured PDF</td>
                  <td className="p-4 sm:p-5">Centralized Document Repository</td>
                  <td className="p-4 sm:p-5 font-bold text-teal-300 bg-teal-500/5">Citizen-Controlled Interoperability Layer</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Selective Disclosure</td>
                  <td className="p-4 sm:p-5 text-rose-400">None (Exposes entire document)</td>
                  <td className="p-4 sm:p-5 text-amber-300">Coarse all-or-nothing document grant</td>
                  <td className="p-4 sm:p-5 font-bold text-teal-300 bg-teal-500/5">Granular field-level consent + ZK Proofs</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Zero-Knowledge Proofs</td>
                  <td className="p-4 sm:p-5 text-rose-400">Not possible</td>
                  <td className="p-4 sm:p-5 text-[#7c78a0]">Not supported</td>
                  <td className="p-4 sm:p-5 font-bold text-teal-300 bg-teal-500/5">Built-in: Prove CGPA &gt; 8.0 without transcript</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Consent Expiration</td>
                  <td className="p-4 sm:p-5 text-rose-400">Permanent copy retained</td>
                  <td className="p-4 sm:p-5 text-[#7c78a0]">Indefinite link sharing</td>
                  <td className="p-4 sm:p-5 font-bold text-teal-300 bg-teal-500/5">Burn-After-Reading 1-time auto-destruct</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Tamper Detection</td>
                  <td className="p-4 sm:p-5 text-rose-400">Manual phone call</td>
                  <td className="p-4 sm:p-5 text-emerald-400">Issuer re-download</td>
                  <td className="p-4 sm:p-5 font-bold text-teal-300 bg-teal-500/5">Real-time SHA-256 + RSA-2048 verification</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Over-Share Coaching</td>
                  <td className="p-4 sm:p-5 text-rose-400">None</td>
                  <td className="p-4 sm:p-5 text-[#7c78a0]">None</td>
                  <td className="p-4 sm:p-5 font-bold text-teal-300 bg-teal-500/5">Neural check flags excessive employer requests</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-bold text-white">Transition Passport</td>
                  <td className="p-4 sm:p-5 text-rose-400">Manual checklist</td>
                  <td className="p-4 sm:p-5 text-[#7c78a0]">Not supported</td>
                  <td className="p-4 sm:p-5 font-bold text-teal-300 bg-teal-500/5">Integrated Education &rarr; Employment engine</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-white/[0.08] py-12 bg-[#05040d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-teal-400" />
            <span className="font-black text-white text-lg">
              LIFE<span className="gradient-text-violet">KEY</span>
            </span>
            <span className="text-xs text-[#7c78a0]">
              • Xavier Competition Finalist
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#8d8aab]">
            <Link href="/login" className="hover:text-white transition-colors">Portals</Link>
            <Link href="/dashboard/student" className="hover:text-white transition-colors">Student</Link>
            <Link href="/dashboard/institution" className="hover:text-white transition-colors">Institution</Link>
            <Link href="/dashboard/employer" className="hover:text-white transition-colors">Employer</Link>
            <Link href="/verify/lifekey_demo_token_xyz890" className="hover:text-white transition-colors">QR Verifier</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
