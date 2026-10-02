"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  api, 
  getUser, 
  User, 
  CredentialOut,
  CredentialIntelReport,
  CredentialIntelFlag
} from "@/lib/api";
import { 
  Building2, 
  ShieldCheck, 
  PlusCircle, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  Sparkles,
  Lock,
  Layers,
  GraduationCap,
  Award,
  FileText,
  X,
  Brain,
  ShieldAlert,
  Filter,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Zap,
  Info,
  Scale,
  Play,
  FlaskConical,
} from "lucide-react";
import CompareRecordsModal from "@/components/CompareRecordsModal";
import CredentialQualityModal from "@/components/CredentialQualityModal";
import { CredentialQualityReport, RecordComparison } from "@/lib/api";

export default function InstitutionDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [issuedCreds, setIssuedCreds] = useState<CredentialOut[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab state
  const [activeTab, setActiveTab] = useState<"registry" | "intel">("registry");
  const [intelReport, setIntelReport] = useState<CredentialIntelReport | null>(null);
  const [intelLoading, setIntelLoading] = useState(false);
  const [resolvingFlagId, setResolvingFlagId] = useState<string | null>(null);

  // Issue Form state
  const [studentEmail, setStudentEmail] = useState("parth@lifekey.id");
  const [credType, setCredType] = useState<"DIPLOMA" | "DEGREE" | "SKILL" | "CERTIFICATE">("DIPLOMA");
  const [title, setTitle] = useState("Diploma in Artificial Intelligence & Machine Learning");
  const [major, setMajor] = useState("Computer Science & AI");
  const [cgpa, setCgpa] = useState("8.85");
  const [graduationYear, setGraduationYear] = useState("2026");
  const [skills, setSkills] = useState("Python, Machine Learning, Deep Learning, React");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issueSuccess, setIssueSuccess] = useState<string | null>(null);

  // Intelligence Quality & Comparison Modal state
  const [qualityModalReport, setQualityModalReport] = useState<CredentialQualityReport | null>(null);
  const [comparisonModalData, setComparisonModalData] = useState<RecordComparison | null>(null);
  const [comparingLoading, setComparingLoading] = useState(false);
  const [testScenarioLoading, setTestScenarioLoading] = useState<string | null>(null);

  // Revocation modal state
  const [revokingCredId, setRevokingCredId] = useState<string | null>(null);
  const [revocationReason, setRevocationReason] = useState("Credential withdrawn for academic review");

  useEffect(() => {
    const curUser = getUser();
    if (!curUser) {
      router.push("/login");
      return;
    }
    if (curUser.role !== "INSTITUTION") {
      if (curUser.role === "STUDENT") router.push("/dashboard/student");
      else if (curUser.role === "EMPLOYER") router.push("/dashboard/employer");
      return;
    }
    setUser(curUser);
    loadData();
    loadIntel();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [creds, studentList] = await Promise.all([
        api.getIssuedCredentials(),
        api.listStudents().catch(() => []),
      ]);
      setIssuedCreds(creds);
      setStudents(studentList);
    } catch (err: any) {
      console.error("Error loading institution data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadIntel = async () => {
    try {
      setIntelLoading(true);
      const report = await api.getIntelReport();
      setIntelReport(report);
    } catch (err: any) {
      console.error("Error loading intel report:", err);
    } finally {
      setIntelLoading(false);
    }
  };

  const handleResolveFlag = async (flagId: string) => {
    try {
      setResolvingFlagId(flagId);
      await api.resolveIntelFlag(flagId);
      await loadIntel();
    } catch (err: any) {
      alert(err.message || "Failed to resolve flag");
    } finally {
      setResolvingFlagId(null);
    }
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIssueSuccess(null);

    const credentialData: Record<string, any> = {
      title,
      graduation_year: graduationYear,
    };

    if (credType === "DIPLOMA" || credType === "DEGREE") {
      credentialData.major = major;
      credentialData.cgpa = cgpa;
      credentialData.scale = "10.0";
      credentialData.status = "First Class with Distinction";
    }

    if (skills.trim()) {
      credentialData.skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    try {
      const res = await api.issueCredential({
        holder_email: studentEmail,
        credential_type: credType,
        credential_data: credentialData,
      });

      setIssueSuccess(`Successfully issued ${res.credential_type} to ${studentEmail}! Cryptographically signed with RSA-2048.`);
      loadData();
      loadIntel();
      if (res.quality_check) {
        setQualityModalReport(res.quality_check);
      }
      setTimeout(() => setIssueSuccess(null), 5000);
    } catch (err: any) {
      alert(err.message || "Failed to issue credential");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenCompare = async (credAId: string, credBId: string) => {
    try {
      setComparingLoading(true);
      const comp = await api.compareRecords(credAId, credBId);
      setComparisonModalData(comp);
    } catch (err: any) {
      alert(err.message || "Failed to generate comparison table");
    } finally {
      setComparingLoading(false);
    }
  };

  const handleRunScenarioTest = async (scenarioKey: string) => {
    try {
      setTestScenarioLoading(scenarioKey);
      let payload: any = {};

      if (scenarioKey === "A") {
        payload = {
          credential_type: "DIPLOMA",
          holder_email: "parth@lifekey.id",
          credential_data: {
            title: "Advanced Cloud Architecture & Systems",
            major: "Cloud Infrastructure",
            cgpa: "9.20",
            graduation_year: "2026",
            institution: user?.organization || "ABC Polytechnic Institute",
          },
        };
      } else if (scenarioKey === "B") {
        payload = {
          credential_type: "DIPLOMA",
          holder_email: "parth@lifekey.id",
          credential_data: {
            title: "diploma in artificial intelligence & machine learning",
            major: "Computer Science & AI",
            cgpa: "8.85",
            graduation_year: "2026",
            institution: user?.organization || "ABC Polytechnic Institute",
          },
        };
      } else if (scenarioKey === "C") {
        payload = {
          credential_type: "DIPLOMA",
          holder_email: "parth@lifekey.id",
          credential_data: {
            title: "Bachelor of Technology - AIML",
            major: "Artificial Intelligence",
            cgpa: "8.75",
            graduation_year: "2026",
            institution: user?.organization || "ABC Polytechnic Institute",
          },
        };
      } else if (scenarioKey === "D") {
        payload = {
          credential_type: "DIPLOMA",
          holder_email: "parth@lifekey.id",
          credential_data: {
            title: "Diploma in AI & Machine Learning",
            major: "Computer Science & AI",
            cgpa: "8.85",
            graduation_year: "2024",
            institution: user?.organization || "ABC Polytechnic Institute",
          },
        };
      } else if (scenarioKey === "E") {
        payload = {
          credential_type: "DIPLOMA",
          holder_email: "parth@lifekey.id",
          credential_data: {
            title: "Diploma in Mechanical Engineering",
            major: "Mechanical Engineering",
            cgpa: "8.10",
            institution: user?.organization || "ABC Polytechnic Institute",
          },
        };
      } else if (scenarioKey === "F") {
        payload = {
          credential_type: "CERTIFICATE",
          holder_email: "parth@lifekey.id",
          expires_at: "2025-01-01T00:00:00Z",
          credential_data: {
            title: "Cloud Infrastructure Professional",
            valid_until: "2025-01-01",
            institution: user?.organization || "ABC Polytechnic Institute",
          },
        };
      } else if (scenarioKey === "G") {
        payload = {
          credential_type: "CERTIFICATE",
          holder_email: "parth@lifekey.id",
          credential_data: {
            title: "Certificate in Quantum Computing",
            institution: "Unregistered External University",
            _meta: { issuer_name: "Unregistered External University" },
          },
        };
      } else if (scenarioKey === "H") {
        payload = {
          credential_type: "DIPLOMA",
          holder_email: "parth@lifekey.id",
          expires_at: "2024-12-31T00:00:00Z",
          credential_data: {
            title: "Bachelor of Technology - AIML",
            major: "AI & ML",
            graduation_year: "2023",
            institution: "Different Technical College",
            valid_until: "2024-12-31",
          },
        };
      }

      const report = await api.checkIntelligence(payload);
      setQualityModalReport(report);
    } catch (err: any) {
      alert(err.message || "Failed to run scenario check");
    } finally {
      setTestScenarioLoading(null);
    }
  };

  const handleRevoke = async () => {
    if (!revokingCredId) return;
    try {
      await api.revokeCredential(revokingCredId, revocationReason);
      setRevokingCredId(null);
      loadData();
      loadIntel();
    } catch (err: any) {
      alert(err.message || "Failed to revoke credential");
    }
  };

  const handleReinstate = async (credentialId: string) => {
    try {
      await api.reinstateCredential(credentialId);
      loadData();
      loadIntel();
    } catch (err: any) {
      alert(err.message || "Failed to reinstate credential");
    }
  };

  const flagCount = intelReport?.flags?.length || 0;

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white relative overflow-hidden">
      <Navbar />

      {/* Soft Ambient Glow Orbs */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#E8E6FF]/50 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#DCD9FF]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase px-3 py-1 rounded-full badge-indigo font-bold tracking-wider">
                ACCREDITED ISSUER NODE
              </span>
              <span className="text-xs text-[#69708A] font-semibold">
                {user?.organization || "ABC Polytechnic Institute"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10142F] tracking-tight mt-1.5">
              Institution <span className="gradient-text-indigo">Credential Center</span>
            </h1>
            <p className="text-sm text-[#69708A] mt-1 font-normal">
              Issue W3C Verifiable Credentials with RSA-2048 signatures, manage instant revocation, and run automated Credential Intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white border border-[#DCD9FF] text-xs font-bold text-[#10142F] flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>✓ RSA-2048 Active Key</span>
            </div>
            <button
              onClick={() => { loadData(); loadIntel(); }}
              className="p-2.5 rounded-2xl bg-white hover:bg-[#F0EEFF] text-[#69708A] hover:text-[#10142F] border border-[#DCD9FF] shadow-sm transition-all"
              title="Refresh Registry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {issueSuccess && (
          <div className="mt-4 p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-sm flex items-center gap-2 shadow-sm animate-fade-up">
            <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
            <span className="font-semibold">{issueSuccess}</span>
          </div>
        )}

        {/* Tab Controls */}
        <div className="mt-6 flex items-center gap-2 border-b border-[#DCD9FF] pb-4">
          <button
            onClick={() => setActiveTab("registry")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "registry"
                ? "btn-primary shadow-md"
                : "bg-white text-[#69708A] border border-[#DCD9FF] hover:bg-[#F0EEFF] hover:text-[#10142F]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Registry & Issuance</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "registry" ? "bg-white/20 text-white" : "bg-[#F0EEFF] text-[#5B5BEF]"
            }`}>
              {issuedCreds.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab("intel"); loadIntel(); }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "intel"
                ? "btn-primary shadow-md"
                : "bg-white text-[#69708A] border border-[#DCD9FF] hover:bg-[#F0EEFF] hover:text-[#10142F]"
            }`}
          >
            <Brain className="w-4 h-4 text-[#5B5BEF]" />
            <span>Credential Intelligence QA</span>
            {flagCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]">
                {flagCount} Flags
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">
                100% QA Clean
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: REGISTRY & ISSUANCE */}
        {activeTab === "registry" && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-up">
            {/* Left Column: Issue Verifiable Credential Form (Blue/Indigo Accented Card) */}
            <div className="lg:col-span-5">
              <div className="glass-card p-6 sm:p-7 border-[#DCD9FF] shadow-lg relative bg-white">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#F0EEFF]">
                  <div className="w-10 h-10 rounded-2xl bg-[#F0EEFF] border border-[#DCD9FF] flex items-center justify-center text-[#5B5BEF] shadow-sm">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#10142F]">
                      Issue Verifiable Credential
                    </h3>
                    <p className="text-xs text-[#69708A]">
                      Signs directly to candidate wallet with W3C JSON-LD spec
                    </p>
                  </div>
                </div>

                <form onSubmit={handleIssue} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">
                      Student Recipient
                    </label>
                    <select
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]"
                    >
                      {students.length > 0 ? (
                        students.map((s) => (
                          <option key={s.id} value={s.email}>
                            {s.name} ({s.email})
                          </option>
                        ))
                      ) : (
                        <option value="parth@lifekey.id">Parth Patil (parth@lifekey.id)</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">
                      Credential Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(["DIPLOMA", "DEGREE", "SKILL", "CERTIFICATE"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setCredType(t)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                            credType === t
                              ? "bg-[#5B5BEF] text-white border-[#5B5BEF] shadow-sm"
                              : "bg-white text-[#69708A] border-[#DCD9FF] hover:bg-[#F0EEFF] hover:text-[#10142F]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">
                      Award Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Diploma in Artificial Intelligence"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]"
                    />
                  </div>

                  {(credType === "DIPLOMA" || credType === "DEGREE") && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">
                          Major / Discipline
                        </label>
                        <input
                          type="text"
                          value={major}
                          onChange={(e) => setMajor(e.target.value)}
                          placeholder="e.g. Computer Science & AI"
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">
                          CGPA (Scale 10.0)
                        </label>
                        <input
                          type="text"
                          value={cgpa}
                          onChange={(e) => setCgpa(e.target.value)}
                          placeholder="e.g. 8.85"
                          className="w-full px-3 py-2 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">
                      Verified Competencies & Skills
                    </label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Python, Machine Learning, React, SQL"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">
                      Graduation / Award Year
                    </label>
                    <input
                      type="text"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F0EEFF] border border-[#DCD9FF] text-xs text-[#5B5BEF] leading-relaxed">
                    <span className="font-bold">Cryptographic Action:</span> Clicking &ldquo;Sign & Issue&rdquo; computes a SHA-256 canonical hash of the claims and attaches an RSA-2048 PSS signature directly to the student&apos;s vault.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3.5 text-sm font-bold shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <FileCheck2 className="w-4 h-4" />
                        <span>Sign & Issue Verifiable Credential</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Issued Credentials Registry & Revocation Controls */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-[#10142F] flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#5B5BEF]" />
                    <span>Issued Credentials Registry</span>
                  </h3>
                  <p className="text-xs text-[#69708A]">
                    Cryptographic ledger of all awards issued by {user?.organization || "this institution"}.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full badge-indigo font-bold">
                  {issuedCreds.length} Records
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-[#69708A] text-sm glass-card rounded-2xl bg-white border-[#DCD9FF]">
                  Loading registry...
                </div>
              ) : issuedCreds.length === 0 ? (
                <div className="p-10 text-center glass-card rounded-2xl border-[#DCD9FF] bg-white">
                  <Building2 className="w-10 h-10 text-[#69708A] mx-auto mb-2" />
                  <h4 className="text-base font-bold text-[#10142F]">No Credentials Issued Yet</h4>
                  <p className="text-xs text-[#69708A] mt-1">
                    Use the issuance form on the left to sign your first student credential.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {issuedCreds.map((cred) => {
                    const data = cred.credential_data;
                    const isRevoked = cred.status === "REVOKED";

                    return (
                      <div
                        key={cred.id}
                        className={`p-5 rounded-2xl glass-card bg-white border transition-all ${
                          isRevoked 
                            ? "border-[#FECACA] bg-[#FEF2F2]/30" 
                            : "border-[#DCD9FF] hover:border-[#5B5BEF]/50 shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded badge-indigo font-bold">
                                {cred.credential_type}
                              </span>
                              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded font-bold ${
                                !isRevoked ? "badge-lime" : "badge-rose"
                              }`}>
                                {cred.status}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-[#10142F] mt-1.5">
                              {data.title || "Academic Credential"}
                            </h4>
                            <p className="text-xs text-[#69708A] mt-0.5">
                              Holder: <strong className="text-[#10142F]">{cred.holder_name || "Student"}</strong>
                            </p>
                          </div>

                          <div>
                            {!isRevoked ? (
                              <button
                                onClick={() => setRevokingCredId(cred.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#EF4444] border border-[#FECACA] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Revoke Award</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReinstate(cred.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#10B981] border border-[#A7F3D0] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reinstate</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Revocation Notice */}
                        {isRevoked && (
                          <div className="mt-3 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#DC2626]">
                            <strong>Revocation Reason:</strong> {cred.revocation_reason || "Revoked by Institution"}
                          </div>
                        )}

                        {/* Hash snippet */}
                        <div className="mt-3 pt-3 border-t border-[#F0EEFF] flex items-center justify-between text-[11px] font-mono text-[#69708A]">
                          <div className="truncate max-w-sm">
                            SHA-256: {cred.credential_hash}
                          </div>
                          <span>Issued: {new Date(cred.issued_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CREDENTIAL INTELLIGENCE & INTEGRITY QA */}
        {activeTab === "intel" && (
          <div className="mt-6 space-y-6 animate-fade-up">
            {/* Top Score Banner */}
            <div className="glass-card rounded-3xl p-6 sm:p-7 border-[#DCD9FF] bg-white shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#F0EEFF] border border-[#DCD9FF] flex items-center justify-center text-[#5B5BEF] shadow-sm">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#10142F]">
                      Automated Credential Intelligence & Duplicate QA
                    </h3>
                    <p className="text-xs text-[#69708A] mt-0.5">
                      Continuous background analysis for duplicate degrees, conflicting dates, and schema anomalies.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#F7F6FF] px-5 py-3 rounded-2xl border border-[#DCD9FF]">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-[#69708A] font-bold block">QA Cleanliness Score</span>
                    <span className={`text-2xl font-black font-mono ${
                      (intelReport?.quality_score ?? 100) >= 90 ? "text-[#10B981]" :
                      (intelReport?.quality_score ?? 100) >= 70 ? "text-[#F59E0B]" : "text-[#EF4444]"
                    }`}>
                      {intelReport?.quality_score ?? 100}%
                    </span>
                  </div>
                  <div className="h-8 w-px bg-[#DCD9FF]" />
                  <div className="text-left">
                    <span className="text-[10px] font-mono uppercase text-[#69708A] font-bold block">Active Flags</span>
                    <span className="text-2xl font-black font-mono text-[#10142F]">
                      {flagCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Badges */}
              <div className="mt-6 pt-4 border-t border-[#F0EEFF] flex flex-wrap items-center gap-3 text-xs">
                <span className="text-[#69708A] font-bold">Issue Breakdown:</span>
                {intelReport?.summary && Object.keys(intelReport.summary).length > 0 ? (
                  Object.entries(intelReport.summary).map(([k, v]) => (
                    <span key={k} className="px-3 py-1 rounded-xl bg-white border border-[#DCD9FF] text-[#10142F] font-mono shadow-sm">
                      {k}: <strong className="text-[#5B5BEF]">{v}</strong>
                    </span>
                  ))
                ) : (
                  <span className="text-[#10B981] font-mono font-bold">✓ Zero structural issues detected</span>
                )}
              </div>
            </div>

            {/* Scenario Testing Lab */}
            <div className="p-6 rounded-3xl glass-card bg-white border-[#DCD9FF] shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF] mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F0EEFF] border border-[#DCD9FF] flex items-center justify-center text-[#5B5BEF]">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#10142F]">
                      Live Scenario Testing Lab
                    </h4>
                    <p className="text-xs text-[#69708A]">
                      Run pre-configured test cases (Scenarios A through H) through the Credential Intelligence engine.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded badge-indigo font-bold">
                  8 TEST SCENARIOS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { key: "A", label: "A. Perfect Credential", desc: "No issues, 100% QA score", badge: "badge-lime" },
                  { key: "B", label: "B. Exact Duplicate", desc: "Matches canonical record", badge: "badge-amber" },
                  { key: "C", label: "C. Similar Credential", desc: "B.Tech IT vs B.Tech AIML", badge: "badge-indigo" },
                  { key: "D", label: "D. Conflicting Year", desc: "2024 vs 2026 mismatch", badge: "badge-rose" },
                  { key: "E", label: "E. Missing Field", desc: "Omitted graduation year", badge: "badge-amber" },
                  { key: "F", label: "F. Expired Credential", desc: "Validity date in past", badge: "badge-rose" },
                  { key: "G", label: "G. Issuer Mismatch", desc: "Unregistered authority name", badge: "badge-amber" },
                  { key: "H", label: "H. Compound Multi-Issue", desc: "Similar + Conflict + Missing + Expired", badge: "badge-rose" },
                ].map((sc) => (
                  <button
                    key={sc.key}
                    onClick={() => handleRunScenarioTest(sc.key)}
                    disabled={testScenarioLoading !== null}
                    className="p-3.5 rounded-2xl bg-white hover:bg-[#F0EEFF] border border-[#DCD9FF] hover:border-[#5B5BEF]/50 text-left transition-all group disabled:opacity-50 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${sc.badge}`}>
                        {sc.key}
                      </span>
                      {testScenarioLoading === sc.key ? (
                        <div className="w-3.5 h-3.5 border-2 border-[#5B5BEF]/20 border-t-[#5B5BEF] rounded-full animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-[#69708A] group-hover:text-[#5B5BEF] transition-colors" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-[#10142F] group-hover:text-[#5B5BEF] transition-colors">
                      {sc.label}
                    </div>
                    <div className="text-[11px] text-[#69708A] mt-0.5 line-clamp-1">
                      {sc.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Flags List */}
            {intelLoading ? (
              <div className="p-12 text-center text-[#69708A] text-sm glass-card rounded-2xl bg-white border-[#DCD9FF]">
                Running neural QA checks...
              </div>
            ) : flagCount === 0 ? (
              <div className="p-12 text-center glass-card rounded-3xl border-[#A7F3D0] bg-[#ECFDF5]/30">
                <CheckCircle className="w-12 h-12 text-[#10B981] mx-auto mb-3" />
                <h4 className="text-lg font-bold text-[#10142F]">All Registry Records Cryptographically Clean</h4>
                <p className="text-xs text-[#69708A] max-w-md mx-auto mt-1">
                  The intelligence engine verified all issued credentials. No duplicate awards, conflicting graduation dates, or missing required fields were found across active students.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#10142F] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                    <span>Flags Requiring Institutional Review ({flagCount})</span>
                  </h4>
                  <span className="text-xs text-[#69708A]">
                    Resolving a flag marks the record as audited
                  </span>
                </div>

                {intelReport?.flags.map((flag) => {
                  const isHigh = flag.severity === "HIGH";
                  const isMed = flag.severity === "MEDIUM";

                  return (
                    <div
                      key={flag.id}
                      className={`p-5 rounded-2xl glass-card bg-white border transition-all ${
                        isHigh ? "border-[#FECACA] bg-[#FEF2F2]/20" :
                        isMed ? "border-[#FDE68A] bg-[#FFFBEB]/20" :
                        "border-[#DCD9FF]"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 max-w-2xl">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              isHigh ? "badge-rose" : isMed ? "badge-amber" : "badge-indigo"
                            }`}>
                              {flag.flag_type}
                            </span>
                            <span className="text-[10px] font-mono text-[#69708A]">
                              Severity: <strong className={isHigh ? "text-[#EF4444]" : isMed ? "text-[#F59E0B]" : "text-[#5B5BEF]"}>{flag.severity}</strong>
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-[#10142F]">
                            {flag.description}
                          </p>

                          <div className="text-[11px] font-mono text-[#69708A] flex items-center gap-3">
                            <span>Detected: {new Date(flag.created_at).toLocaleString()}</span>
                            <span>Record ID: {flag.credential_id_a.slice(0, 8)}...</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {flag.credential_id_b && (
                            <button
                              onClick={() => handleOpenCompare(flag.credential_id_a, flag.credential_id_b!)}
                              disabled={comparingLoading}
                              className="px-3.5 py-2 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                            >
                              <Scale className="w-3.5 h-3.5" />
                              <span>Compare Records</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleResolveFlag(flag.id)}
                            disabled={resolvingFlagId === flag.id}
                            className="px-4 py-2 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                          >
                            {resolvingFlagId === flag.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark Audited</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal: Revocation Confirmation */}
        {revokingCredId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <div className="max-w-md w-full glass-card bg-white rounded-3xl p-6 border-[#FECACA] text-left shadow-2xl animate-fade-up">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
                <h3 className="text-base font-bold text-[#DC2626] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                  <span>Revoke Verifiable Credential</span>
                </h3>
                <button
                  onClick={() => setRevokingCredId(null)}
                  className="p-1 rounded-lg text-[#69708A] hover:text-[#10142F]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[#69708A] mt-3 leading-relaxed">
                Revoking this credential will immediately update the live revocation registry. Any employer scanning this credential will see an immediate rejection.
              </p>

              <div className="mt-4">
                <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1.5">
                  Revocation Reason
                </label>
                <input
                  type="text"
                  value={revocationReason}
                  onChange={(e) => setRevocationReason(e.target.value)}
                  placeholder="e.g. Academic record superseded or error corrected"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm font-semibold bg-white text-[#10142F] border-[#DCD9FF]"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setRevokingCredId(null)}
                  className="px-4 py-2 rounded-xl btn-secondary text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevoke}
                  className="px-4 py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold shadow-md transition-all"
                >
                  Confirm Revocation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quality Check Result Modal */}
        {qualityModalReport && (
          <CredentialQualityModal
            report={qualityModalReport}
            onClose={() => setQualityModalReport(null)}
            onOpenCompare={(comp) => {
              setComparisonModalData(comp);
            }}
          />
        )}

        {/* Side-by-Side Record Comparison Modal */}
        {comparisonModalData && (
          <CompareRecordsModal
            comparison={comparisonModalData}
            onClose={() => setComparisonModalData(null)}
            onAcknowledge={() => {
              loadIntel();
            }}
          />
        )}
      </main>
    </div>
  );
}
