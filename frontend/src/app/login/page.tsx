"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { api, DEMO_ACCOUNTS } from "@/lib/api";
import {
  GraduationCap,
  Building2,
  Briefcase,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  User,
  Eye,
  EyeOff,
  Stethoscope,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState(DEMO_ACCOUNTS.STUDENT.email);
  const [password, setPassword] = useState(DEMO_ACCOUNTS.STUDENT.password);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"STUDENT" | "INSTITUTION" | "EMPLOYER" | "DOCTOR">("STUDENT");
  const [organization, setOrganization] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1-Click Demo Portals with real authentication
  const fillDemo = async (demoKey: keyof typeof DEMO_ACCOUNTS) => {
    const demo = DEMO_ACCOUNTS[demoKey];
    setError(null);
    setLoading(true);
    setEmail(demo.email);
    setPassword(demo.password);
    setRole(demo.role);

    try {
      const res = await api.login(demo.email, demo.password);
      redirectUser(res.user.role);
    } catch (err: any) {
      setError(err.message || "Failed to login with demo credentials");
      setLoading(false);
    }
  };

  const redirectUser = (userRole: string) => {
    if (userRole === "STUDENT") router.push("/dashboard/student");
    else if (userRole === "INSTITUTION") router.push("/dashboard/institution");
    else if (userRole === "EMPLOYER") router.push("/dashboard/employer");
    else if (userRole === "DOCTOR") router.push("/dashboard/doctor");
    else router.push("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await api.login(email, password);
        redirectUser(res.user.role);
      } else {
        if (role === "DOCTOR") {
          router.push("/dashboard/doctor");
          return;
        }
        const res = await api.register({
          name,
          email,
          password,
          role,
          organization: role !== "STUDENT" ? organization : undefined,
        });
        redirectUser(res.user.role);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F7F8FC] relative overflow-hidden">
        {/* Soft Lavender Ambient Glow Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#E8E6FF]/60 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-lg glass-card p-7 sm:p-9 relative z-10 border-[#DCD9FF] shadow-2xl">
          {/* Header with LifeKey Mark */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F0EEFF] border border-[#DCD9FF] p-2 mb-3 shadow-sm">
              <Image
                src="/assets/brand/lifekey-mark.svg"
                alt="LifeKey Mark"
                width={32}
                height={32}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10142F] tracking-tight">
              {mode === "login" ? "Access LifeKey Network" : "Create LifeKey Identity"}
            </h1>
            <p className="text-xs sm:text-sm text-[#69708A] mt-1 font-normal">
              {mode === "login"
                ? "Sign in to access your wallet, issue credentials, or verify candidates"
                : "Register a sovereign student, institution, or employer node"}
            </p>
          </div>

          {/* Instant 1-Click Demo Buttons for Fast Evaluation */}
          <div className="mb-6 p-4 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono text-[#5B5BEF] uppercase tracking-wider font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#5B5BEF]" />
                <span>1-Click Demo Portals</span>
              </span>
              <span className="text-[10px] text-[#69708A] font-mono">Real API Login</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("STUDENT")}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white hover:bg-[#F0EEFF] border border-[#DCD9FF] text-[#10142F] hover:text-[#5B5BEF] transition-all text-center group disabled:opacity-50 shadow-sm"
              >
                <User className="w-4 h-4 mb-1 text-[#5B5BEF] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold leading-tight">User</span>
                <span className="text-[10px] text-[#69708A]">{DEMO_ACCOUNTS.STUDENT.name}</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo("INSTITUTION")}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white hover:bg-[#F0EEFF] border border-[#DCD9FF] text-[#10142F] hover:text-[#5B5BEF] transition-all text-center group disabled:opacity-50 shadow-sm"
              >
                <Building2 className="w-4 h-4 mb-1 text-[#5B5BEF] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold leading-tight">Institution</span>
                <span className="text-[10px] text-[#69708A]">ABC Poly</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo("EMPLOYER")}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white hover:bg-[#F0EEFF] border border-[#DCD9FF] text-[#10142F] hover:text-[#5B5BEF] transition-all text-center group disabled:opacity-50 shadow-sm"
              >
                <Briefcase className="w-4 h-4 mb-1 text-[#5B5BEF] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold leading-tight">Employer</span>
                <span className="text-[10px] text-[#69708A]">TechNova HR</span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard/doctor")}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white hover:bg-[#F0EEFF] border border-[#DCD9FF] text-[#10142F] hover:text-[#5B5BEF] transition-all text-center group disabled:opacity-50 shadow-sm"
              >
                <Stethoscope className="w-4 h-4 mb-1 text-[#5B5BEF] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold leading-tight">Doctor</span>
                <span className="text-[10px] text-[#69708A]">Dr. A. Mehta</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-[#F0EEFF] p-1 mb-6 border border-[#DCD9FF]">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === "login"
                  ? "bg-white text-[#10142F] shadow-sm"
                  : "text-[#69708A] hover:text-[#10142F]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === "register"
                  ? "bg-white text-[#10142F] shadow-sm"
                  : "text-[#69708A] hover:text-[#10142F]"
              }`}
            >
              Register New Identity
            </button>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#DC2626] flex items-start gap-2 shadow-sm animate-fade-down">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="font-semibold leading-relaxed">{error}</div>
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#69708A] pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ishika Sawant"
                      className="glass-input has-left-icon w-full text-sm font-semibold !pl-12 !pr-4"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1">
                    Account Role
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { r: "STUDENT", label: "User", icon: User },
                      { r: "INSTITUTION", label: "Institution", icon: Building2 },
                      { r: "EMPLOYER", label: "Employer", icon: Briefcase },
                      { r: "DOCTOR", label: "Doctor", icon: Stethoscope },
                    ].map(({ r, label, icon: Icon }) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                          role === r
                            ? "bg-[#F0EEFF] border-[#5B5BEF] text-[#5B5BEF]"
                            : "bg-white border-[#DCD9FF] text-[#69708A]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {role !== "STUDENT" && (
                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1">
                      {role === "DOCTOR" ? "Clinic / Hospital Name" : "Organization / University Name"}
                    </label>
                    <div className="relative">
                      {role === "INSTITUTION" ? (
                        <Building2 className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#69708A] pointer-events-none" />
                      ) : role === "DOCTOR" ? (
                        <Stethoscope className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#69708A] pointer-events-none" />
                      ) : (
                        <Briefcase className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#69708A] pointer-events-none" />
                      )}
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder={
                          role === "DOCTOR"
                            ? "e.g. Apollo Multi-Speciality Clinic"
                            : role === "INSTITUTION"
                            ? "e.g. Stanford University"
                            : "e.g. Google LLC"
                        }
                        className="glass-input has-left-icon w-full text-sm font-semibold !pl-12 !pr-4"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#69708A] pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="glass-input has-left-icon w-full text-sm font-semibold !pl-12 !pr-4"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#69708A] pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="glass-input has-left-icon has-right-icon w-full text-sm font-semibold !pl-12 !pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#69708A] hover:text-[#10142F] transition-colors p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-sm font-bold shadow-lg"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>{mode === "login" ? "Sign In to LifeKey" : "Create Account"}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-[#F0EEFF] text-center text-xs text-[#69708A]">
            <span>Need cryptographic verifier pass? </span>
            <Link href="/verify/lifekey_demo_token_xyz890" className="text-[#5B5BEF] font-bold hover:underline">
              Verify QR Token &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
