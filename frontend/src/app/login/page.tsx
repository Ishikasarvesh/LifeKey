"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { 
  KeyRound, 
  GraduationCap, 
  Building2, 
  Briefcase, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("parth@lifekey.id");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"STUDENT" | "INSTITUTION" | "EMPLOYER">("STUDENT");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick 1-click Demo Fillers
  const fillDemo = async (demoRole: "STUDENT" | "INSTITUTION" | "EMPLOYER") => {
    setError(null);
    setLoading(true);
    let demoEmail = "";
    if (demoRole === "STUDENT") demoEmail = "parth@lifekey.id";
    if (demoRole === "INSTITUTION") demoEmail = "admin@abcpoly.edu.in";
    if (demoRole === "EMPLOYER") demoEmail = "hr@technova.com";

    setEmail(demoEmail);
    setPassword("password123");

    try {
      const res = await api.login(demoEmail, "password123");
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
    <div className="min-h-screen bg-[#06050f] text-[#e2e0f0] flex flex-col selection:bg-violet-700 selection:text-white">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-grid-pattern relative">
        {/* Glow */}
        <div className="absolute w-96 h-96 bg-violet-600/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="w-full max-w-lg glass-panel-glow rounded-3xl p-6 sm:p-8 relative z-10 border border-violet-500/25">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-teal-400 mb-3 shadow-lg shadow-violet-500/20">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">
              {mode === "login" ? "Access LIFEKEY Network" : "Create LIFEKEY Identity"}
            </h1>
            <p className="text-xs text-[#8d8aab] mt-1">
              {mode === "login" 
                ? "Sign in to access your wallet, issue credentials, or verify candidates" 
                : "Register a student, institution, or employer node"}
            </p>
          </div>

          {/* Instant 1-Click Demo Buttons for Judges */}
          <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-mono text-teal-300 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" /> 1-Click Judge Demo Access
              </span>
              <span className="text-[10px] text-[#7c78a0] font-mono">Pre-seeded</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("STUDENT")}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 transition-all text-center group disabled:opacity-50"
              >
                <GraduationCap className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform text-teal-400" />
                <span className="text-xs font-bold leading-tight">Student</span>
                <span className="text-[10px] text-[#8d8aab]">Parth Patil</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo("INSTITUTION")}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-300 transition-all text-center group disabled:opacity-50"
              >
                <Building2 className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform text-violet-400" />
                <span className="text-xs font-bold leading-tight">Institution</span>
                <span className="text-[10px] text-[#8d8aab]">ABC Poly</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemo("EMPLOYER")}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 transition-all text-center group disabled:opacity-50"
              >
                <Briefcase className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform text-orange-400" />
                <span className="text-xs font-bold leading-tight">Employer</span>
                <span className="text-[10px] text-[#8d8aab]">TechNova</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-black/40 p-1 mb-5 border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === "login" 
                  ? "btn-violet text-white shadow" 
                  : "text-[#8d8aab] hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === "register" 
                  ? "btn-violet text-white shadow" 
                  : "text-[#8d8aab] hover:text-white"
              }`}
            >
              Register New Actor
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Parth Patil / Dr. Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Actor Role</label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm bg-[#0a0a1a]"
                  >
                    <option value="STUDENT">Student (Holder)</option>
                    <option value="INSTITUTION">Institution (Issuer)</option>
                    <option value="EMPLOYER">Employer (Verifier)</option>
                  </select>
                </div>

                {role !== "STUDENT" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Organization Name</label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. ABC Polytechnic Institute or TechNova"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7c78a0] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7c78a0] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl btn-violet text-white font-bold text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === "login" ? "Enter Network" : "Complete Registration"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
