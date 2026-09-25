"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, removeToken, User } from "@/lib/api";
import {
  KeyRound,
  GraduationCap,
  Building2,
  Briefcase,
  ShieldCheck,
  LogOut,
  LogIn,
  Sparkles,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUserState(getUser());
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    setUserState(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-violet-500/10 bg-[#06050f]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-500 to-teal-400 p-[1.5px] shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/45 transition-all duration-300">
              <div className="w-full h-full bg-[#08060f] rounded-[10px] flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  LIFE<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-300">KEY</span>
                </span>
              </div>
              <p className="text-[11px] text-[#7c78a0] hidden sm:block">
                Interoperability &amp; Consent Layer
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${pathname === "/"
                  ? "text-violet-400 bg-white/[0.04]"
                  : "text-[#a8a4c8] hover:text-white hover:bg-white/[0.03]"
                }`}>
              Overview
            </Link>
            <Link href="/dashboard/student"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${pathname.startsWith("/dashboard/student")
                  ? "text-teal-400 bg-white/[0.04] border border-teal-500/20"
                  : "text-[#a8a4c8] hover:text-white hover:bg-white/[0.03]"
                }`}>
              <GraduationCap className="w-4 h-4 text-teal-400" />
              Student Wallet
            </Link>
            <Link href="/dashboard/institution"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${pathname.startsWith("/dashboard/institution")
                  ? "text-violet-400 bg-white/[0.04] border border-violet-500/20"
                  : "text-[#a8a4c8] hover:text-white hover:bg-white/[0.03]"
                }`}>
              <Building2 className="w-4 h-4 text-violet-400" />
              Institution
            </Link>
            <Link href="/dashboard/employer"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${pathname.startsWith("/dashboard/employer")
                  ? "text-orange-400 bg-white/[0.04] border border-orange-500/20"
                  : "text-[#a8a4c8] hover:text-white hover:bg-white/[0.03]"
                }`}>
              <Briefcase className="w-4 h-4 text-orange-400" />
              Employer
            </Link>
            <Link href="/verify/lifekey_demo_token_xyz890"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${pathname.startsWith("/verify") || pathname.startsWith("/burn")
                  ? "text-teal-400 bg-teal-500/10 border border-teal-500/25"
                  : "text-[#7c78a0] hover:text-teal-300 hover:bg-teal-500/5"
                }`}>
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              QR Verify
            </Link>
          </nav>

          {/* User Status */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-white/[0.07]">
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">{user.name}</div>
                  <div className="text-[10px] font-mono text-teal-400 uppercase tracking-wider">
                    {user.role}{user.organization ? ` · ${user.organization}` : ""}
                  </div>
                </div>
                <button onClick={handleLogout} title="Logout"
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg btn-violet text-white text-sm font-medium">
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.05]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-violet-500/10 bg-[#06050f] px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-white/[0.05]"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/student"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-emerald-500/10"
          >
            <GraduationCap className="w-5 h-5" /> Student Wallet
          </Link>
          <Link
            href="/dashboard/institution"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-blue-400 hover:bg-blue-500/10"
          >
            <Building2 className="w-5 h-5" /> Institution Portal
          </Link>
          <Link
            href="/dashboard/employer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-purple-400 hover:bg-purple-500/10"
          >
            <Briefcase className="w-5 h-5" /> Employer Verification
          </Link>
          <Link
            href="/verify/lifekey_demo_token_xyz890"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-amber-400 hover:bg-amber-500/10"
          >
            <ShieldCheck className="w-5 h-5" /> QR Public Verifier
          </Link>
          <div className="pt-4 border-t border-white/[0.08]">
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20"
              >
                <LogOut className="w-4 h-4" /> Sign Out ({user.name})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium"
              >
                <LogIn className="w-4 h-4" /> Sign In / Demo Portals
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
