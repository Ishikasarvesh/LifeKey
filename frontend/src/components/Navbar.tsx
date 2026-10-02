"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getUser, removeToken, User } from "@/lib/api";
import {
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Building2,
  Briefcase,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setUserState(getUser());
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    removeToken();
    setUserState(null);
    router.push("/");
  };

  const navLinks = [
    { name: "Product", href: "/#product" },
    { name: "Transitions", href: "/transitions" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Security", href: "/#security" },
    { name: "Credential Intelligence", href: "/#intelligence" },
    { name: "Verify", href: "/#verify" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-[#DCD9FF]/80 shadow-[0_4px_24px_rgba(91,91,239,0.06)] py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: LifeKey Brand Logo + Wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5B5BEF] via-[#7167F6] to-[#E8E6FF] p-[1.5px] shadow-md shadow-[#5B5BEF]/20 group-hover:shadow-[#5B5BEF]/40 transition-all duration-300">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center p-1.5">
                <Image
                  src="/assets/brand/lifekey-mark.svg"
                  alt="LifeKey Mark"
                  width={28}
                  height={28}
                  className="group-hover:scale-105 transition-transform"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#10142F] leading-tight">
                Life<span className="text-[#5B5BEF]">Key</span>
              </span>
              <span className="text-[9.5px] font-semibold text-[#69708A] tracking-wider uppercase">
                Digital Identity
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F7F6FF]/80 border border-[#DCD9FF]/70 px-3 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-full text-[13.5px] font-semibold text-[#69708A] hover:text-[#10142F] hover:bg-white transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={
                    user.role === "STUDENT"
                      ? "/dashboard/student"
                      : user.role === "INSTITUTION"
                      ? "/dashboard/institution"
                      : "/dashboard/employer"
                  }
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#F0EEFF] hover:bg-[#E8E6FF] text-[#5B5BEF] border border-[#DCD9FF] text-xs font-bold transition-all"
                >
                  {user.role === "STUDENT" && <GraduationCap className="w-4 h-4" />}
                  {user.role === "INSTITUTION" && <Building2 className="w-4 h-4" />}
                  {user.role === "EMPLOYER" && <Briefcase className="w-4 h-4" />}
                  <span>{user.name.split(" ")[0]} ({user.role})</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-2xl text-[#69708A] hover:text-[#EF4444] hover:bg-[#FEF2F2] border border-transparent hover:border-[#FECACA] transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-[13.5px] font-bold text-[#10142F] hover:text-[#5B5BEF] transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/login"
                  className="btn-primary text-xs"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF] text-[#10142F] hover:bg-[#E8E6FF] transition-all"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-5 rounded-3xl bg-white/95 backdrop-blur-2xl border border-[#DCD9FF] shadow-xl animate-fade-down space-y-4">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#10142F] hover:bg-[#F0EEFF] hover:text-[#5B5BEF] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-3 border-t border-[#E8E6FF] flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href={
                      user.role === "STUDENT"
                        ? "/dashboard/student"
                        : user.role === "INSTITUTION"
                        ? "/dashboard/institution"
                        : "/dashboard/employer"
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#F0EEFF] text-[#5B5BEF] font-bold text-xs"
                  >
                    <span>Open Dashboard ({user.role})</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 p-2.5 text-xs text-[#EF4444] font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center text-sm font-bold text-[#10142F] bg-[#F7F6FF] rounded-2xl"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-[#6964F2] to-[#5B5BEF] rounded-2xl shadow-md shadow-[#5B5BEF]/25"
                  >
                    Get Started →
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
