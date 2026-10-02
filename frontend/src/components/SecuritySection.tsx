"use client";

import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCheck2,
  RefreshCw,
  EyeOff,
  CheckCircle2,
  Hash,
  Binary,
} from "lucide-react";

export default function SecuritySection() {
  const securityFeatures = [
    {
      title: "SHA-256 Integrity",
      tag: "CANONICAL HASHING",
      desc: "Every credential payload is deterministically serialized and hashed. Modifying even a single character causes the mathematical digest to diverge instantly.",
      icon: "/assets/3d/shield.svg",
      highlight: "Tamper-Evident by Design",
    },
    {
      title: "RSA-PSS Signature",
      tag: "DIGITAL AUTHENTICITY",
      desc: "Accredited institutions sign credentials with RSA-PSS using SHA-256 digests. Proves origin, authenticity, and non-repudiation across any network.",
      icon: "/assets/3d/key.svg",
      highlight: "Cryptographic Attestation",
    },
    {
      title: "Revocation & Reinstatement",
      tag: "LIFECYCLE STATUS",
      desc: "Unlike printed certificates or static PDFs, LifeKey credentials query live status registries. Issuers can suspend, revoke, or reinstate records in real time.",
      icon: "/assets/3d/lock.svg",
      highlight: "Instant Network Revocation",
    },
    {
      title: "Selective Disclosure",
      tag: "PURPOSE-BOUND TOKENS",
      desc: "Share only required attributes (e.g., Degree and CGPA) while keeping sensitive personal identifiers such as Home Address, Phone, and DoB completely private.",
      icon: "/assets/3d/qr.svg",
      highlight: "Granular Candidate Consent",
    },
  ];

  return (
    <section id="security" className="py-24 bg-white relative overflow-hidden">
      {/* Background soft lavender accent glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#F0EEFF] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0EEFF] border border-[#DCD9FF] text-[11px] font-bold text-[#5B5BEF] uppercase tracking-wider shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographic Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#10142F] tracking-tight leading-tight">
            Verification you can trust. <br />
            Sharing you control.
          </h2>

          <p className="text-base sm:text-lg text-[#69708A] font-normal">
            LifeKey blends rigorous mathematical guarantees with citizen-centric privacy primitives so that credentials remain durable, authentic, and confidential.
          </p>
        </div>

        {/* 4 Security Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {securityFeatures.map((feat) => (
            <div
              key={feat.title}
              className="glass-card p-8 flex flex-col justify-between group hover:border-[#5B5BEF]/40"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF] flex items-center justify-center p-3 group-hover:scale-105 transition-transform shadow-sm">
                    <Image
                      src={feat.icon}
                      alt={feat.title}
                      width={44}
                      height={44}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-[#F0EEFF] text-[#5B5BEF] border border-[#DCD9FF]">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-[#10142F] tracking-tight group-hover:text-[#5B5BEF] transition-colors">
                  {feat.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#69708A] mt-2.5 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F0EEFF] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#10B981] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{feat.highlight}</span>
                </span>
                <span className="text-[11px] font-mono text-[#69708A]">RFC &amp; W3C Compliant</span>
              </div>
            </div>
          ))}
        </div>

        {/* Security Specs Micro-Strip */}
        <div className="p-6 rounded-3xl bg-[#F7F8FC] border border-[#DCD9FF] flex flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <span className="text-xs font-mono font-bold text-[#5B5BEF] block">CANONICAL HASH</span>
            <span className="text-sm font-bold text-[#10142F]">SHA-256 Digest</span>
          </div>
          <div className="w-px h-8 bg-[#DCD9FF] hidden sm:block" />
          <div>
            <span className="text-xs font-mono font-bold text-[#5B5BEF] block">ASYMMETRIC KEYS</span>
            <span className="text-sm font-bold text-[#10142F]">RSA-2048 with PSS Padding</span>
          </div>
          <div className="w-px h-8 bg-[#DCD9FF] hidden sm:block" />
          <div>
            <span className="text-xs font-mono font-bold text-[#5B5BEF] block">AUTHENTICATION</span>
            <span className="text-sm font-bold text-[#10142F]">JWT &amp; bcrypt Passwords</span>
          </div>
          <div className="w-px h-8 bg-[#DCD9FF] hidden sm:block" />
          <div>
            <span className="text-xs font-mono font-bold text-[#5B5BEF] block">REVOCATION MODEL</span>
            <span className="text-sm font-bold text-[#10142F]">Real-Time Registry Query</span>
          </div>
        </div>

      </div>
    </section>
  );
}
