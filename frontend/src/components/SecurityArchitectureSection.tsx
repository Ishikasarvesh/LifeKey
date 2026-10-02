"use client";

import { Shield, Lock, Key, ArrowRight, UserCheck, CheckCircle2, Building2, User } from "lucide-react";

export default function SecurityArchitectureSection() {
  const NODES = [
    { title: "ISSUER", subtitle: "Accredited Authority", icon: <Building2 className="w-5 h-5 text-[#5B5BEF]" />, desc: "Originates & binds claims" },
    { title: "SIGN", subtitle: "RSA-2048 / Ed25519", icon: <Key className="w-5 h-5 text-[#7167F6]" />, desc: "Cryptographic digital seal" },
    { title: "CREDENTIAL", subtitle: "W3C JSON-LD Proof", icon: <Lock className="w-5 h-5 text-indigo-600" />, desc: "Tamper-evident canonical claim" },
    { title: "HOLDER", subtitle: "Citizen Identity Vault", icon: <User className="w-5 h-5 text-[#10B981]" />, desc: "100% self-sovereign custody" },
    { title: "CONSENT", subtitle: "Purpose-Bound Scope", icon: <Shield className="w-5 h-5 text-amber-500" />, desc: "Selective minimal disclosure" },
    { title: "VERIFIER", subtitle: "Instant Trust Node", icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, desc: "Zero-knowledge verification" },
  ];

  return (
    <section className="py-20 bg-[#FAFAFE] border-t border-b border-[#DCD9FF] relative overflow-hidden" id="architecture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-indigo text-xs font-bold font-mono uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-[#5B5BEF]" />
            DECENTRALIZED TRUST ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#10142F] tracking-tight">
            The Trust Boundary Chain
          </h2>
          <p className="text-sm sm:text-base text-[#69708A]">
            Verifiable credentials separate the creator of a record from its verifier. The holder retains complete sovereign custody between transitions.
          </p>
        </div>

        {/* 6-Node Chain */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {NODES.map((node, i) => (
            <div
              key={node.title}
              className="glass-card bg-white p-4 rounded-2xl border border-[#DCD9FF] shadow-sm flex flex-col justify-between space-y-3 hover:border-[#5B5BEF] transition-all relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#69708A] font-bold">0{i + 1}</span>
                <div className="w-9 h-9 rounded-xl bg-[#F0EEFF] flex items-center justify-center shadow-xs">
                  {node.icon}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black tracking-wider text-[#10142F] uppercase font-mono">
                  {node.title}
                </h4>
                <div className="text-[11px] font-bold text-[#5B5BEF] mt-0.5">
                  {node.subtitle}
                </div>
                <p className="text-[10.5px] text-[#69708A] mt-1 leading-snug">
                  {node.desc}
                </p>
              </div>

              {i < NODES.length - 1 && (
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-white border border-[#DCD9FF] text-[#5B5BEF] shadow-xs flex items-center justify-center text-[10px]">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Core Principle Callout */}
        <div className="mt-10 p-6 rounded-3xl bg-white border border-[#DCD9FF] shadow-sm text-center max-w-3xl mx-auto">
          <p className="text-sm sm:text-base font-bold text-[#10142F] leading-relaxed">
            &ldquo;LIFEKEY does not become the ultimate authority. The issuer remains the authority for the credential.&rdquo;
          </p>
          <p className="text-xs text-[#69708A] mt-2">
            LIFEKEY facilitates mathematical integrity proofs and purpose-bound citizen consent without acting as a centralized arbiter of truth.
          </p>
        </div>

      </div>
    </section>
  );
}
