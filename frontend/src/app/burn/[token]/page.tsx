"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api, BurnVerifyResult } from "@/lib/api";
import {
  Flame,
  ShieldCheck,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Home,
  RefreshCw,
  Lock,
  Shield,
} from "lucide-react";

export default function BurnVerifyPage() {
  const params = useParams();
  const token = params?.token as string;

  const [result, setResult] = useState<BurnVerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api
      .verifyBurnToken(token)
      .then(setResult)
      .catch((err) => setError(err.message || "Verification failed"))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#11152E] flex flex-col items-center justify-center p-6 selection:bg-[#5B5BEF] selection:text-white">
      <div className="w-full max-w-lg animate-fade-up">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#F0EEFF] border border-[#DCD9FF] p-2 shadow-sm">
              <Image
                src="/assets/brand/lifekey-mark.svg"
                alt="LifeKey Mark"
                width={28}
                height={28}
              />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#10142F]">
              Life<span className="text-[#5B5BEF]">Key</span>
            </span>
          </Link>
          <p className="text-xs text-[#69708A] font-mono uppercase tracking-wider">
            Burn-After-Reading Token Verifier
          </p>
        </div>

        {loading ? (
          <div className="glass-card p-10 border-[#DCD9FF] text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 border-4 border-[#F0EEFF] border-t-[#F97316] rounded-full animate-spin mx-auto" />
            <h2 className="text-base font-bold text-[#10142F]">Consuming Ephemeral Token...</h2>
            <p className="text-xs text-[#69708A]">
              This link will self-destruct after this verification.
            </p>
          </div>
        ) : error ? (
          <div className="glass-card p-8 border-[#FECACA] bg-[#FEF2F2] text-center space-y-4 shadow-xl">
            <XCircle className="w-16 h-16 text-[#EF4444] mx-auto" />
            <h1 className="text-xl font-extrabold text-[#DC2626]">Verification Failed</h1>
            <p className="text-sm text-[#B91C1C]">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#FECACA] text-xs font-bold text-[#10142F] hover:bg-[#FEF2F2] mt-2 shadow-sm"
            >
              <Home className="w-4 h-4" /> Go Home
            </Link>
          </div>
        ) : result ? (
          result.reuse_attempt ? (
            /* REPLAY BLOCKED */
            <div className="glass-card p-8 border-[#FECACA] bg-[#FEF2F2] space-y-5 shadow-xl">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto text-[#EF4444]">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#DC2626] font-bold">
                  ACCESS DENIED — TOKEN ALREADY CONSUMED
                </div>
                <h1 className="text-2xl font-black text-[#991B1B]">Unauthorized Replay Detected</h1>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#FECACA] text-xs text-[#B91C1C] text-center leading-relaxed">
                {result.message}
              </div>
              <div className="p-3 rounded-xl bg-white/70 border border-[#FECACA] text-[11px] text-[#69708A] text-center">
                This unauthorized access attempt has been logged on the credential holder&apos;s audit trail.
              </div>
              <div className="flex justify-center">
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#DCD9FF] text-xs font-bold text-[#10142F] shadow-sm hover:bg-[#F7F6FF]"
                >
                  <Home className="w-4 h-4 inline mr-1.5" /> Return Home
                </Link>
              </div>
            </div>
          ) : result.success && result.verification ? (
            /* VALID BURN */
            <div className="glass-card p-8 border-[#A7F3D0] space-y-6 shadow-xl">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto text-[#10B981]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#059669] font-bold">
                  TOKEN CONSUMED • VERIFICATION COMPLETE
                </div>
                <h1 className="text-2xl font-black text-[#10142F]">Credential Verified</h1>
                <p className="text-xs text-[#69708A]">{result.message}</p>
              </div>

              {/* Verification Details */}
              <div className="p-5 rounded-2xl bg-[#F7F8FC] border border-[#E8E6FF] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
                      {result.verification.overall_status}
                    </span>
                    <h2 className="text-lg font-bold text-[#10142F] mt-1.5">
                      {result.verification.candidate_name || "Verified Candidate"}
                    </h2>
                    <p className="text-xs text-[#69708A]">
                      Issuer: {result.verification.institution_name}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F0EEFF] border border-[#DCD9FF] flex items-center justify-center text-[#5B5BEF]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    {
                      label: "Signature",
                      val: result.verification.signature_valid ? "✓ RSA-2048 Valid" : "❌ Invalid",
                      ok: result.verification.signature_valid,
                    },
                    {
                      label: "Integrity",
                      val: result.verification.integrity_valid ? "✓ SHA-256 Match" : "❌ Tampered",
                      ok: result.verification.integrity_valid,
                    },
                    {
                      label: "Revocation",
                      val: result.verification.revocation_status === "ACTIVE" ? "✓ Active" : "❌ Revoked",
                      ok: result.verification.revocation_status === "ACTIVE",
                    },
                    {
                      label: "Consent",
                      val: result.verification.consent_valid ? "✓ Granted" : "❌ Denied",
                      ok: result.verification.consent_valid,
                    },
                  ].map((item, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white border border-[#E8E6FF]">
                      <div className="text-[10px] text-[#69708A] font-mono">{item.label}</div>
                      <div className={`text-xs font-bold mt-0.5 ${item.ok ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                        {item.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] text-xs text-[#EA580C] text-center flex items-center gap-2 justify-center font-medium">
                <Flame className="w-4 h-4 shrink-0 text-[#F97316]" />
                <span>This link has been permanently burned. Any future replay attempt will be blocked.</span>
              </div>

              <div className="flex justify-center">
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#DCD9FF] text-xs font-bold text-[#10142F] shadow-sm hover:bg-[#F7F6FF]"
                >
                  <Home className="w-4 h-4 inline mr-1.5" /> Return Home
                </Link>
              </div>
            </div>
          ) : (
            /* EXPIRED */
            <div className="glass-card p-8 border-[#FDE68A] bg-[#FFFBEB] text-center space-y-4 shadow-xl">
              <AlertTriangle className="w-16 h-16 text-[#F59E0B] mx-auto" />
              <h1 className="text-xl font-black text-[#92400E]">Token Expired</h1>
              <p className="text-xs text-[#B45309]">{result.message}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#FDE68A] text-xs font-bold text-[#10142F] mt-2 shadow-sm"
              >
                <Home className="w-4 h-4" /> Go Home
              </Link>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
