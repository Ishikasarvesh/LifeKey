"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E8E6FF] py-14 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-[#F0EEFF]">
          
          {/* Brand Logo & Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B5BEF] to-[#E8E6FF] p-[1.5px]">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1">
                <Image
                  src="/assets/brand/lifekey-mark.svg"
                  alt="LifeKey Mark"
                  width={24}
                  height={24}
                />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-[#10142F]">
                Life<span className="text-[#5B5BEF]">Key</span>
              </span>
              <p className="text-[10px] text-[#69708A]">
                Unified Life-Stage Digital Identity &amp; Record Network
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-[#69708A]">
            <Link href="/#product" className="hover:text-[#10142F] transition-colors">
              Product
            </Link>
            <Link href="/#security" className="hover:text-[#10142F] transition-colors">
              Security
            </Link>
            <Link href="/#how-it-works" className="hover:text-[#10142F] transition-colors">
              How It Works
            </Link>
            <Link href="/#intelligence" className="hover:text-[#10142F] transition-colors">
              Credential Intelligence
            </Link>
            <Link href="/verify/lifekey_demo_token_xyz890" className="hover:text-[#5B5BEF] transition-colors">
              Verify
            </Link>
            <Link href="/login" className="hover:text-[#10142F] transition-colors">
              Portals
            </Link>
          </nav>

          {/* Right Trust Badge */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Secured for your future. ✓</span>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#69708A] gap-4">
          <p>© {new Date().getFullYear()} LifeKey. All rights reserved.</p>

          <div className="flex items-center gap-6 text-[11px]">
            <span className="hover:text-[#10142F] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#10142F] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#10142F] cursor-pointer">Security Whitepaper</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
