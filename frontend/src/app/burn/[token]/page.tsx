"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, BurnVerifyResult } from "@/lib/api";
import {
  Flame, ShieldCheck, XCircle, AlertTriangle, CheckCircle2,
  Home, RefreshCw, Lock, Shield
} from "lucide-react";

export default function BurnVerifyPage() {
  const params = useParams();
  const token = params?.token as string;

  const [result, setResult] = useState<BurnVerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api.verifyBurnToken(token)
      .then(setResult)
      .catch(err => setError(err.message || "Verification failed"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-[#06050f] text-[#e2e0f0] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-teal-400 p-[1.5px] shadow-lg shadow-violet-500/30">
              <div className="w-full h-full bg-[#08060f] rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <span className="font-extrabold text-xl text-white">
              LIFE<span className="gradient-text-violet">KEY</span>
            </span>
          </div>
          <p className="text-xs text-[#7c78a0] font-mono uppercase tracking-widest">Burn-After-Reading Token Verifier</p>
        </div>

        {loading ? (
          <div className="glass-panel rounded-3xl p-10 border border-white/[0.07] text-center space-y-4">
            <div className="w-16 h-16 border-2 border-orange-500/30 border-t-orange-400 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#8d8aab]">Consuming token…</p>
            <p className="text-xs text-[#5c5880]">This link will self-destruct after this verification.</p>
          </div>
        ) : error ? (
          <div className="glass-panel-danger rounded-3xl p-8 border border-rose-500/30 text-center space-y-4">
            <XCircle className="w-16 h-16 text-rose-400 mx-auto" />
            <h1 className="text-xl font-black text-white">Verification Failed</h1>
            <p className="text-sm text-rose-300">{error}</p>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-ghost text-sm font-medium border border-white/[0.09] mt-4">
              <Home className="w-4 h-4" /> Go Home
            </Link>
          </div>
        ) : result ? (
          result.reuse_attempt ? (
            /* ── REPLAY BLOCKED ──────────────────────────── */
            <div className="glass-panel-danger rounded-3xl p-8 border border-rose-500/30 space-y-5">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-rose-500/15 flex items-center justify-center mx-auto">
                  <Shield className="w-10 h-10 text-rose-400" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                  ACCESS DENIED — TOKEN ALREADY CONSUMED
                </div>
                <h1 className="text-2xl font-black text-white">Unauthorized Replay Detected</h1>
              </div>
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-sm text-rose-200 text-center leading-relaxed">
                {result.message}
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs text-[#8d8aab] text-center">
                This unauthorized access attempt has been logged on the credential holder&apos;s dashboard.
              </div>
              <div className="flex justify-center">
                <Link href="/" className="px-4 py-2 rounded-xl btn-ghost text-sm font-medium border border-white/[0.09]">
                  <Home className="w-4 h-4 inline mr-1.5" /> Go Home
                </Link>
              </div>
            </div>
          ) : result.success && result.verification ? (
            /* ── VALID BURN ──────────────────────────────── */
            <div className="glass-panel-teal rounded-3xl p-8 border border-teal-500/25 space-y-6">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-teal-500/15 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-teal-400" />
                </div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-teal-400 font-bold">
                  TOKEN CONSUMED · VERIFICATION COMPLETE
                </div>
                <h1 className="text-2xl font-black text-white">Credential Verified</h1>
                <p className="text-sm text-[#8d8aab]">{result.message}</p>
              </div>

              {/* Verification Details */}
              <div className="p-5 rounded-2xl glass-panel border border-white/[0.07] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold badge-lime`}>
                      {result.verification.overall_status}
                    </span>
                    <h2 className="text-lg font-bold text-white mt-1.5">
                      {result.verification.candidate_name || "Verified Candidate"}
                    </h2>
                    <p className="text-xs text-[#8d8aab]">Issuer: {result.verification.institution_name}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600/20 to-violet-500/20 border border-teal-500/25 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-teal-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: "Signature", val: result.verification.signature_valid ? "✓ RSA-2048 Valid" : "❌ Invalid", ok: result.verification.signature_valid },
                    { label: "Integrity", val: result.verification.integrity_valid ? "✓ SHA-256 Match" : "❌ Tampered", ok: result.verification.integrity_valid },
                    { label: "Revocation", val: result.verification.revocation_status === "ACTIVE" ? "✓ Active" : "❌ Revoked", ok: result.verification.revocation_status === "ACTIVE" },
                    { label: "Consent", val: result.verification.consent_valid ? "✓ Granted" : "❌ Denied", ok: result.verification.consent_valid },
                  ].map((item, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="text-[10px] text-[#7c78a0] font-mono">{item.label}</div>
                      <div className={`text-xs font-bold mt-0.5 ${item.ok ? "text-emerald-400" : "text-rose-400"}`}>{item.val}</div>
                    </div>
                  ))}
                </div>

                {result.verification.credential_type && (
                  <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
                    <span className="text-[11px] font-mono badge-violet px-2 py-0.5 rounded">
                      {result.verification.credential_type}
                    </span>
                    <span className="text-[11px] text-[#7c78a0]">
                      Issued: {result.verification.issued_at ? new Date(result.verification.issued_at).toLocaleDateString() : "—"}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 text-center flex items-center gap-2 justify-center">
                <Flame className="w-3.5 h-3.5 shrink-0" />
                This link has been permanently deactivated. Any future access attempt will be blocked and logged.
              </div>

              <div className="flex justify-center">
                <Link href="/" className="px-4 py-2 rounded-xl btn-ghost text-sm font-medium border border-white/[0.09]">
                  <Home className="w-4 h-4 inline mr-1.5" /> Go Home
                </Link>
              </div>
            </div>
          ) : (
            /* ── EXPIRED ─────────────────────────────────── */
            <div className="glass-panel rounded-3xl p-8 border border-amber-500/25 text-center space-y-4">
              <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto" />
              <h1 className="text-xl font-black text-white">Token Expired</h1>
              <p className="text-sm text-[#8d8aab]">{result.message}</p>
              <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-ghost text-sm font-medium border border-white/[0.09] mt-4">
                <Home className="w-4 h-4" /> Go Home
              </Link>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
