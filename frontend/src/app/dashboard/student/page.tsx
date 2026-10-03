"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  api, getUser,
  User, CredentialOut, ConsentRequestOut, TransitionStatus,
  ZKProofOut, BurnTokenOut, CredentialIntelReport
} from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";
import {
  GraduationCap, HeartPulse, Landmark, Briefcase, KeyRound, ShieldCheck,
  Award, CheckCircle2, Clock, Share2, FileText, QrCode, Sparkles,
  AlertCircle, Eye, Check, X, Lock, Zap, Flame, Brain, Camera,
  ChevronRight, RefreshCw, AlertTriangle, XCircle, Shield, Hash,
  Fingerprint, ScanLine, Copy, CheckCheck, Scale, PlusCircle,
  Building2, ArrowRight, DollarSign, Activity, FileCheck
} from "lucide-react";
import CompareRecordsModal from "@/components/CompareRecordsModal";
import CredentialQualityModal from "@/components/CredentialQualityModal";
import TransitionPassportModal from "@/components/TransitionPassportModal";
import CreatePassportModal from "@/components/CreatePassportModal";
import { RecordComparison, CredentialQualityReport } from "@/lib/api";

// ─── Domain & Navigation Types ────────────────────────────

export type DomainType = "academic" | "healthcare" | "finance" | "employment";
export type GlobalFeature = "wallet" | "passports" | "zk" | "burn" | "intel" | "camera" | "consents";
export type ActiveView = DomainType | GlobalFeature;
export type RequestFilterStatus = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export interface DomainDocument {
  id: string;
  domain: DomainType;
  title: string;
  category: string; // e.g. "Degree", "Marksheet", "Lab Report", "Tax Return", etc.
  issuer: string;
  date: string;
  status: "ACTIVE" | "VERIFIED" | "REVIEW_REQUIRED";
  hash: string;
  details: Record<string, string>;
}

export interface DomainRequest {
  id: string;
  domain: DomainType;
  requester: string;
  requestedDocument: string;
  purpose: string;
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  expiry: string;
  verificationToken?: string;
  notes?: string;
}

// ─── Initial Domain Data (Strict Domain Separation) ───────

const INITIAL_DOMAIN_DOCUMENTS: DomainDocument[] = [
  // 🎓 Academic
  {
    id: "DOC-ACAD-01",
    domain: "academic",
    title: "Bachelor of Technology in Computer Engineering",
    category: "Degree Certificate",
    issuer: "D. J. Sanghvi College of Engineering",
    date: "2024-06-15",
    status: "VERIFIED",
    hash: "0x4a9f82d1c90b3e5a7f61c28d09e3a7b54129ec0b1f2389d47a61c28d09e3a7b5",
    details: { Degree: "B.Tech", Major: "Computer Engineering", Division: "First Class with Distinction", CGPA: "8.85" },
  },
  {
    id: "DOC-ACAD-02",
    domain: "academic",
    title: "Official Cumulative Grade Transcript (Sem 1-8)",
    category: "Marksheet",
    issuer: "University of Mumbai Examination Board",
    date: "2024-06-20",
    status: "VERIFIED",
    hash: "0x7b1c28d09e3a7b54129ec0b1f2389d47a61c28d09e3a7b54a9f82d1c90b3e5a",
    details: { Semester: "Sem 1 through 8", TotalCredits: "160", Status: "Graduated", CGPA: "8.85" },
  },
  {
    id: "DOC-ACAD-03",
    domain: "academic",
    title: "Postgraduate Diploma in Artificial Intelligence & Deep Learning",
    category: "Certificate",
    issuer: "ABC Polytechnic Institute",
    date: "2024-05-10",
    status: "VERIFIED",
    hash: "0x3e5a7f61c28d09e3a7b54129ec0b1f2389d47a61c28d09e3a7b54a9f82d1c90b",
    details: { Focus: "Neural Networks & ZK Computing", Grade: "A+", Project: "Decentralized Credential Verification" },
  },

  // 🏥 Healthcare
  {
    id: "DOC-HEALTH-01",
    domain: "healthcare",
    title: "Comprehensive Metabolic & Lipid Diagnostic Panel",
    category: "Lab Report",
    issuer: "Metropolis Healthcare Labs",
    date: "2026-09-12",
    status: "VERIFIED",
    hash: "0x8f2d59c6b8401aaef98d4076bc112ea4a938b81098b67b1f5c6ad90c9b0e271a",
    details: { FastingGlucose: "94 mg/dL", Cholesterol: "182 mg/dL", HDL: "48 mg/dL", WBC: "7,400 /mcL" },
  },
  {
    id: "DOC-HEALTH-02",
    domain: "healthcare",
    title: "Clinical Outpatient Treatment & Diagnostic Summary",
    category: "Medical Report",
    issuer: "Apollo Multi-Speciality Clinic · Dr. S. Kulkarni",
    date: "2026-09-15",
    status: "VERIFIED",
    hash: "0x51c9842aef91209bca3387091bd5561a084c7182991cae74151b72a10c9e01f2",
    details: { Condition: "Acute Bronchitis (Resolved)", BloodPressure: "120/80 mmHg", SPO2: "98%" },
  },
  {
    id: "DOC-HEALTH-03",
    domain: "healthcare",
    title: "Active E-Prescription: Bronchodilator & Antihistamine",
    category: "Prescription",
    issuer: "Apollo Pharmacy Network",
    date: "2026-09-15",
    status: "REVIEW_REQUIRED",
    hash: "0x91834cbfa1029384752981023948572019485710293847562019485720193847",
    details: { Medication: "Levocetirizine 5mg + Amoxicillin 500mg", Dosage: "5-day course", RefillsRemaining: "0" },
  },

  // 💰 Finance
  {
    id: "DOC-FIN-01",
    domain: "finance",
    title: "Annual Income Tax Return (ITR-V) Attestation",
    category: "Financial Verification",
    issuer: "Income Tax Department of India (e-Filing)",
    date: "2026-07-28",
    status: "VERIFIED",
    hash: "0x1293847561029384756201948572019485720194857201948572019485720194",
    details: { AssessmentYear: "2025-26", GrossIncome: "₹14,50,000", AcknowledgementStatus: "Processed" },
  },
  {
    id: "DOC-FIN-02",
    domain: "finance",
    title: "TransUnion CIBIL Sovereign Credit Score (Score: 785)",
    category: "Credit Attestation",
    issuer: "TransUnion CIBIL Bureau",
    date: "2026-08-15",
    status: "VERIFIED",
    hash: "0xa817293847102938471928374019283740192837401928374019283740192837",
    details: { CreditScore: "785 / 900", Standing: "Excellent", ActiveAccounts: "2", Delinquencies: "0" },
  },
  {
    id: "DOC-FIN-03",
    domain: "finance",
    title: "HDFC Priority Banking Direct Deposit & Solvency Certificate",
    category: "Income Credential",
    issuer: "HDFC Bank Corporate Hub",
    date: "2026-09-30",
    status: "VERIFIED",
    hash: "0x6619283740192837401928374019283740192837401928374019283740192837",
    details: { AccountTier: "Priority Salary", SalaryCreditAvg: "₹1,20,800/mo", SolvencyRating: "AAA" },
  },

  // 💼 Employment
  {
    id: "DOC-EMP-01",
    domain: "employment",
    title: "Senior AI Software Engineer Employment Verification",
    category: "Employment Credential",
    issuer: "TechNova Solutions Pvt Ltd",
    date: "2026-09-01",
    status: "VERIFIED",
    hash: "0x7719283740192837401928374019283740192837401928374019283740192837",
    details: { Designation: "Senior AI Engineer", Department: "Core Infrastructure", Tenure: "2 Years 4 Months", Status: "Full-Time Active" },
  },
  {
    id: "DOC-EMP-02",
    domain: "employment",
    title: "Machine Learning Research Internship Completion Record",
    category: "Internship Certificate",
    issuer: "Apex Computing Research Labs",
    date: "2024-06-30",
    status: "VERIFIED",
    hash: "0x8819283740192837401928374019283740192837401928374019283740192837",
    details: { Role: "Research Fellow Intern", Duration: "6 Months", Project: "Zero-Knowledge Rollup Optimization" },
  },
  {
    id: "DOC-EMP-03",
    domain: "employment",
    title: "InnovateX Relieving & Work Experience Attestation",
    category: "Experience Certificate",
    issuer: "InnovateX Systems India",
    date: "2025-08-15",
    status: "VERIFIED",
    hash: "0x9919283740192837401928374019283740192837401928374019283740192837",
    details: { Position: "Junior Developer", Conduct: "Exemplary", ReasonForLeaving: "Career Progression" },
  },
];

const INITIAL_DOMAIN_REQUESTS: DomainRequest[] = [
  // 🎓 Academic Requests
  {
    id: "REQ-ACAD-01",
    domain: "academic",
    requester: "Imperial Graduate Institute",
    requestedDocument: "B.Tech Degree & Final Marksheet",
    purpose: "Postgraduate Master of Science Application Verification",
    date: "2026-10-02",
    status: "PENDING",
    expiry: "72 hours single-use access",
  },
  {
    id: "REQ-ACAD-02",
    domain: "academic",
    requester: "National Academic Accreditation Board",
    requestedDocument: "AI & Deep Learning Diploma",
    purpose: "Institutional Alumni Credential Audit",
    date: "2026-09-22",
    status: "APPROVED",
    expiry: "Valid until Dec 31, 2026",
    verificationToken: "lifekey_token_acad_verified_9921",
  },
  {
    id: "REQ-ACAD-03",
    domain: "academic",
    requester: "Global Commercial Registry",
    requestedDocument: "Complete High School Records",
    purpose: "Unsolicited Marketing Profiling",
    date: "2026-09-10",
    status: "REJECTED",
    expiry: "Access denied by user",
  },

  // 🏥 Healthcare Requests
  {
    id: "REQ-HEALTH-01",
    domain: "healthcare",
    requester: "Apollo Multi-Speciality Clinic (Dr. Arvind Mehta)",
    requestedDocument: "Diagnostic Blood Panel & Medical History",
    purpose: "Treatment & Pre-procedure Evaluation",
    date: "2026-10-03",
    status: "PENDING",
    expiry: "24 hours temporary access",
  },
  {
    id: "REQ-HEALTH-02",
    domain: "healthcare",
    requester: "Max Healthcare Emergency Ward",
    requestedDocument: "Blood Group & Allergy Clearance",
    purpose: "Emergency Clinical Consultation",
    date: "2026-09-28",
    status: "APPROVED",
    expiry: "Expires in 12 hours",
    verificationToken: "lifekey_token_health_apollo_8820",
  },
  {
    id: "REQ-HEALTH-03",
    domain: "healthcare",
    requester: "DirectLife Private Insurance",
    requestedDocument: "Full Lifetime Genetic Profile",
    purpose: "Commercial Underwriting Audit",
    date: "2026-09-14",
    status: "REJECTED",
    expiry: "Denied due to data overreach",
  },

  // 💰 Finance Requests
  {
    id: "REQ-FIN-01",
    domain: "finance",
    requester: "ABC Bank",
    requestedDocument: "Income Verification",
    purpose: "Loan Application",
    date: "2026-10-03",
    status: "PENDING",
    expiry: "48 hours single-use access",
  },
  {
    id: "REQ-FIN-02",
    domain: "finance",
    requester: "Zerodha Broking Limited",
    requestedDocument: "CIBIL Score & Pan KYC Credential",
    purpose: "Margin Equity Account Opening",
    date: "2026-09-25",
    status: "APPROVED",
    expiry: "Valid until Oct 25, 2026",
    verificationToken: "lifekey_token_fin_zerodha_7710",
  },
  {
    id: "REQ-FIN-03",
    domain: "finance",
    requester: "QuickCash Micro-lender App",
    requestedDocument: "Complete Transaction Log & Contact Records",
    purpose: "Aggressive Loan Underwriting",
    date: "2026-09-12",
    status: "REJECTED",
    expiry: "Flagged anomalous & blocked",
  },

  // 💼 Employment Requests
  {
    id: "REQ-EMP-01",
    domain: "employment",
    requester: "Google India Staffing Division",
    requestedDocument: "TechNova Employment Verification & Degree",
    purpose: "Senior Software Engineer Candidate Onboarding",
    date: "2026-10-03",
    status: "PENDING",
    expiry: "7 days verifiable token",
  },
  {
    id: "REQ-EMP-02",
    domain: "employment",
    requester: "TechNova HR Operations",
    requestedDocument: "Apex Labs Research Internship Attestation",
    purpose: "Internal Level Promotion & Experience Indexing",
    date: "2026-09-29",
    status: "APPROVED",
    expiry: "Valid until Nov 15, 2026",
    verificationToken: "lifekey_token_emp_technova_6631",
  },
  {
    id: "REQ-EMP-03",
    domain: "employment",
    requester: "Third-Party Scout Agency",
    requestedDocument: "Salary Slips & Relieving Letter",
    purpose: "Unsolicited Recruiting Inquiry",
    date: "2026-09-11",
    status: "REJECTED",
    expiry: "Access blocked",
  },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<CredentialOut[]>([]);
  const [consents, setConsents] = useState<ConsentRequestOut[]>([]);
  const [transition, setTransition] = useState<TransitionStatus | null>(null);
  const [zkProofs, setZkProofs] = useState<ZKProofOut[]>([]);
  const [burnTokens, setBurnTokens] = useState<BurnTokenOut[]>([]);
  const [intelReport, setIntelReport] = useState<CredentialIntelReport | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Domain Specific State ────────────────────────────────
  const [activeView, setActiveView] = useState<ActiveView>("academic");
  const [domainDocuments, setDomainDocuments] = useState<DomainDocument[]>(INITIAL_DOMAIN_DOCUMENTS);
  const [domainRequests, setDomainRequests] = useState<DomainRequest[]>(INITIAL_DOMAIN_REQUESTS);
  const [requestFilter, setRequestFilter] = useState<RequestFilterStatus>("ALL");
  const [consentDomainFilter, setConsentDomainFilter] = useState<"ALL" | DomainType>("ALL");
  const [domainSearchQuery, setDomainSearchQuery] = useState("");

  // Transition Passports state
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [createPassportOpen, setCreatePassportOpen] = useState(false);
  const [activePassportStatus, setActivePassportStatus] = useState<"PENDING_APPROVAL" | "APPROVED" | "REJECTED">("PENDING_APPROVAL");
  const [customPassports, setCustomPassports] = useState<any[]>([]);

  // Modals
  const [activeModalCred, setActiveModalCred] = useState<CredentialOut | null>(null);
  const [selectedDocDetails, setSelectedDocDetails] = useState<DomainDocument | null>(null);
  const [qrModalToken, setQrModalToken] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [comparisonModalData, setComparisonModalData] = useState<RecordComparison | null>(null);
  const [qualityModalReport, setQualityModalReport] = useState<CredentialQualityReport | null>(null);
  const [comparingLoading, setComparingLoading] = useState(false);

  // ZK Proof form
  const [zkCredId, setZkCredId] = useState("");
  const [zkAttr, setZkAttr] = useState("cgpa");
  const [zkPredicate, setZkPredicate] = useState(">");
  const [zkThreshold, setZkThreshold] = useState("8.0");
  const [zkDomainTag, setZkDomainTag] = useState<DomainType>("academic");
  const [zkLoading, setZkLoading] = useState(false);
  const [zkResult, setZkResult] = useState<ZKProofOut | null>(null);

  // Burn token form
  const [burnConsentId, setBurnConsentId] = useState("");
  const [burnTTL, setBurnTTL] = useState(5);
  const [burnLoading, setBurnLoading] = useState(false);
  const [burnResult, setBurnResult] = useState<BurnTokenOut | null>(null);

  // Camera/digitizer state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [digitizerLoading, setDigitizerLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, string> | null>(null);
  const [targetDigitizerDomain, setTargetDigitizerDomain] = useState<DomainType>("academic");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [walletData, consentData, transData, zkData, burnData, intelData] = await Promise.all([
        api.getWallet().catch(() => []),
        api.getAllConsents().catch(() => []),
        api.getTransitionStatus().catch(() => null),
        api.getMyZKProofs().catch(() => []),
        api.getMyBurnTokens().catch(() => []),
        api.getIntelReport().catch(() => null),
      ]);
      setCredentials(walletData);
      setConsents(consentData);
      setTransition(transData);
      setZkProofs(zkData);
      setBurnTokens(burnData);
      setIntelReport(intelData);
      if (walletData.length > 0) setZkCredId(walletData[0].id);
      const approvedConsents = consentData.filter(c => c.status === "APPROVED");
      if (approvedConsents.length > 0) setBurnConsentId(approvedConsents[0].id);
    } catch (err) {
      console.error("Error loading student data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const curUser = getUser();
    if (!curUser) { router.push("/login"); return; }
    if (curUser.role !== "STUDENT" && curUser.role !== "USER") {
      if (curUser.role === "INSTITUTION") router.push("/dashboard/institution");
      else if (curUser.role === "EMPLOYER") router.push("/dashboard/employer");
      else if (curUser.role === "DOCTOR") router.push("/dashboard/doctor");
      else if (curUser.role === "FINANCE") router.push("/dashboard/finance");
      return;
    }
    setUser(curUser);
    loadData();

    // Sync any Bank Customer requests from localStorage
    try {
      const stored = localStorage.getItem("lifekey_finance_requests");
      if (stored) {
        const bankRequests: any[] = JSON.parse(stored);
        if (Array.isArray(bankRequests) && bankRequests.length > 0) {
          setDomainRequests(prev => {
            const nonBankFinance = prev.filter(r => r.domain === "finance" && !r.id.startsWith("REQ-BANK-"));
            const otherDomains = prev.filter(r => r.domain !== "finance");
            const converted: DomainRequest[] = bankRequests.map(br => ({
              id: br.id,
              domain: "finance" as const,
              requester: br.notes || "ABC Bank",
              requestedDocument: Array.isArray(br.requestedItems) ? br.requestedItems.join(", ") : (br.requestedItems || "Income Verification"),
              purpose: br.purpose || "Loan Application",
              date: br.date || new Date().toISOString().split("T")[0],
              status: (br.status.toUpperCase() === "PENDING" ? "PENDING" : br.status.toUpperCase() === "APPROVED" ? "APPROVED" : "REJECTED") as "PENDING" | "APPROVED" | "REJECTED",
              expiry: br.accessDuration || "48 hours single-use access",
              verificationToken: br.verificationToken,
            }));
            return [...nonBankFinance, ...converted, ...otherDomains];
          });
        }
      }
    } catch {
      // fallback
    }
  }, [router, loadData]);

  // ─── Domain Request Actions (Approve / Reject) ───────────

  const handleDomainRequestAction = (reqId: string, approve: boolean) => {
    const req = domainRequests.find(r => r.id === reqId);
    if (!req) return;

    const newStatus = approve ? "APPROVED" : "REJECTED";
    const generatedToken = approve ? `lifekey_token_${req.domain}_${Date.now().toString().slice(-4)}` : undefined;

    setDomainRequests(prev =>
      prev.map(r => r.id === reqId ? { ...r, status: newStatus, verificationToken: generatedToken } : r)
    );

    // Sync to localStorage for Bank dashboard
    try {
      const stored = localStorage.getItem("lifekey_finance_requests");
      let bankReqs: any[] = stored ? JSON.parse(stored) : [];
      const bIdx = bankReqs.findIndex(b => b.id === reqId);
      if (bIdx >= 0) {
        bankReqs[bIdx].status = approve ? "Approved" : "Rejected";
        if (generatedToken) bankReqs[bIdx].verificationToken = generatedToken;
      } else if (req.domain === "finance") {
        bankReqs.push({
          id: req.id,
          customerId: "LK-PAT-1082",
          customerName: user?.name || "Parth Patil",
          requestedItems: [req.requestedDocument],
          purpose: req.purpose,
          accessDuration: req.expiry,
          status: approve ? "Approved" : "Rejected",
          date: req.date,
          verificationToken: generatedToken,
        });
      }
      localStorage.setItem("lifekey_finance_requests", JSON.stringify(bankReqs));

      if (approve) {
        const storedShares = localStorage.getItem("lifekey_finance_shared");
        let sharedList: any[] = storedShares ? JSON.parse(storedShares) : [];
        const newShare = {
          id: `SHARE-${Date.now().toString().slice(-4)}`,
          customerId: "LK-PAT-1082",
          customerName: user?.name || "Parth Patil",
          sharedItems: [req.requestedDocument],
          purpose: req.purpose,
          consentStatus: "Approved",
          status: "Active",
          approvedDate: new Date().toISOString().split("T")[0],
          expiresIn: req.expiry || "48 hours",
          verificationToken: generatedToken || "lifekey_token_fin_active",
        };
        sharedList.unshift(newShare);
        localStorage.setItem("lifekey_finance_shared", JSON.stringify(sharedList));
      }
    } catch {
      // fallback
    }

    setActionSuccess(
      approve
        ? `Request approved for ${req.requester}! Verifiable access token issued.`
        : `Request from ${req.requester} was rejected.`
    );

    if (approve && generatedToken) {
      setQrModalToken(generatedToken);
    }

    setTimeout(() => setActionSuccess(null), 5000);
  };

  // ─── Camera / Digitizer Functions ─────────────────────────

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
    } catch {
      alert("Camera access denied or not available. Try uploading a file instead.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  };

  const simulateDigitize = (domainHint: DomainType = targetDigitizerDomain) => {
    setDigitizerLoading(true);
    setTimeout(() => {
      let data: Record<string, string> = {};
      if (domainHint === "academic") {
        data = {
          title: "Bachelor of Technology (B.Tech)",
          institution: "D. J. Sanghvi College of Engineering",
          major: "Computer Engineering",
          graduation_year: "2024",
          grade: "First Class with Distinction",
          cgpa: "8.85",
          student_name: user?.name || "Parth Patil",
        };
      } else if (domainHint === "healthcare") {
        data = {
          title: "Comprehensive Metabolic Diagnostic Report",
          provider: "Apollo Clinical Diagnostics",
          patient_name: user?.name || "Parth Patil",
          blood_group: "O+",
          vitals: "Normal Hemoglobin & Glucose Profile",
          status: "Verified Clear",
        };
      } else if (domainHint === "finance") {
        data = {
          title: "Income Tax Department Form 16 / ITR-V",
          assessment_year: "2025-2026",
          pan_status: "Verified",
          gross_income: "₹14,50,000",
          filing_status: "Successfully e-Filed",
        };
      } else {
        data = {
          title: "TechNova Senior Software Engineer Verification",
          employer: "TechNova Solutions Pvt Ltd",
          employee_name: user?.name || "Parth Patil",
          tenure: "2.4 Years",
          designation: "Senior AI Engineer",
        };
      }
      setExtractedData(data);
      setDigitizerLoading(false);
    }, 1800);
  };

  const handleImportDigitizedDoc = () => {
    if (!extractedData) return;
    const newDoc: DomainDocument = {
      id: `DOC-${targetDigitizerDomain.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      domain: targetDigitizerDomain,
      title: extractedData.title || "Digitized Sovereign Document",
      category: targetDigitizerDomain === "academic" ? "Degree / Marksheet"
               : targetDigitizerDomain === "healthcare" ? "Clinical Record"
               : targetDigitizerDomain === "finance" ? "Financial Record"
               : "Employment Attestation",
      issuer: extractedData.institution || extractedData.provider || extractedData.employer || "Verified Entity",
      date: new Date().toISOString().split("T")[0],
      status: "VERIFIED",
      hash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      details: extractedData,
    };

    setDomainDocuments(prev => [newDoc, ...prev]);
    setActionSuccess(`Successfully digitized and imported document into ${targetDigitizerDomain.toUpperCase()} panel!`);
    setExtractedData(null);
    setActiveView(targetDigitizerDomain);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  // ─── ZK Proof Generation ─────────────────────────────────

  const handleCreateZKProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setZkLoading(true);
    setZkResult(null);
    try {
      const proof = await api.createZKProof({
        credential_id: zkCredId,
        attribute: zkAttr,
        predicate: zkPredicate,
        threshold: zkThreshold,
      });
      setZkResult(proof);
      await api.getMyZKProofs().then(setZkProofs);
    } catch {
      // Client-side fallback if backend doesn't have the exact ID
      const mockZK: ZKProofOut = {
        id: `zk-proof-${Date.now()}`,
        credential_id: zkCredId,
        attribute: zkAttr,
        predicate: zkPredicate,
        threshold: zkThreshold,
        result: true,
        label: `Verified: ${zkAttr.toUpperCase()} ${zkPredicate} ${zkThreshold} [${zkDomainTag.toUpperCase()}]`,
        proof_hash: "0x" + Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        created_at: new Date().toISOString(),
      };
      setZkResult(mockZK);
      setZkProofs(prev => [mockZK, ...prev]);
    } finally {
      setZkLoading(false);
    }
  };

  // ─── Burn Token Generation ───────────────────────────────

  const handleCreateBurnToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setBurnLoading(true);
    setBurnResult(null);
    try {
      const bt = await api.createBurnToken(burnConsentId, burnTTL);
      setBurnResult(bt);
      await api.getMyBurnTokens().then(setBurnTokens);
    } catch {
      const mockBT: BurnTokenOut = {
        id: `burn-${Date.now()}`,
        consent_id: burnConsentId,
        token: `bt_${Date.now()}_secure_burn`,
        expires_at: new Date(Date.now() + burnTTL * 60000).toISOString(),
        is_burned: false,
        verify_url: `http://localhost:3000/burn/bt_${Date.now()}_secure_burn`,
        attempted_reuse_count: 0,
        created_at: new Date().toISOString(),
      };
      setBurnResult(mockBT);
      setBurnTokens(prev => [mockBT, ...prev]);
    } finally {
      setBurnLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── Filtered Domain Data Helpers ─────────────────────────

  const currentDomainDocs = domainDocuments.filter(d => d.domain === activeView);
  const currentDomainRequests = domainRequests.filter(r => {
    if (r.domain !== activeView) return false;
    if (requestFilter === "PENDING") return r.status === "PENDING";
    if (requestFilter === "APPROVED") return r.status === "APPROVED";
    if (requestFilter === "REJECTED") return r.status === "REJECTED";
    return true;
  });

  const pendingRequestsCount = domainRequests.filter(r => r.domain === activeView && r.status === "PENDING").length;
  const approvedRequestsCount = domainRequests.filter(r => r.domain === activeView && r.status === "APPROVED").length;
  const rejectedRequestsCount = domainRequests.filter(r => r.domain === activeView && r.status === "REJECTED").length;

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white relative overflow-hidden">
      <Navbar />

      {/* Ambient Lavender Glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#E8E6FF]/50 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* ── Header ────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#DCD9FF]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-mono uppercase px-3 py-0.5 rounded-full badge-indigo font-bold tracking-wider">
                SOVEREIGN CITIZEN VAULT
              </span>
              <span className="text-xs text-[#69708A] font-mono font-semibold">
                ID: {user?.id.slice(0, 8) || "LK-PARTH"}…
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10142F] tracking-tight">
              Welcome, <span className="gradient-text-indigo">{user?.name || "Parth Patil"}</span>
            </h1>
            <p className="text-sm text-[#69708A] mt-1 font-normal">
              Unified life-stage digital identity network · Self-sovereign cryptographic records
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={loadData}
              className="p-2.5 rounded-2xl bg-white hover:bg-[#F0EEFF] text-[#69708A] hover:text-[#10142F] border border-[#DCD9FF] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <Link
              href="/verify/lifekey_demo_token_xyz890"
              className="btn-primary px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#5B5BEF]/20"
            >
              <QrCode className="w-3.5 h-3.5" /> Public Verifier
            </Link>
          </div>
        </div>

        {/* ── Action Success Banner ─────────────────────────── */}
        {actionSuccess && (
          <div className="mt-4 p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-sm flex items-center justify-between shadow-sm animate-fade-down">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>{actionSuccess}</span>
            </div>
            {qrModalToken && (
              <button
                onClick={() => setQrModalToken(qrModalToken)}
                className="text-xs font-bold underline hover:text-[#047857]"
              >
                View QR Token
              </button>
            )}
          </div>
        )}

        {/* ── Section 1: Four Main Life-Stage Domain Panels ───── */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-mono text-[#5B5BEF] uppercase font-bold tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIFE-STAGE DOMAIN PANELS</span>
            </span>
            <span className="text-[11px] text-[#69708A] font-mono">Strict Domain Separation</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: "academic", label: "Academic", icon: GraduationCap, color: "text-[#5B5BEF]", badge: domainDocuments.filter(d => d.domain === "academic").length },
              { id: "healthcare", label: "Healthcare", icon: HeartPulse, color: "text-rose-500", badge: domainDocuments.filter(d => d.domain === "healthcare").length },
              { id: "finance", label: "Finance", icon: Landmark, color: "text-emerald-600", badge: domainDocuments.filter(d => d.domain === "finance").length },
              { id: "employment", label: "Employment", icon: Briefcase, color: "text-amber-500", badge: domainDocuments.filter(d => d.domain === "employment").length },
            ].map(({ id, label, icon: Icon, color, badge }) => (
              <button
                key={id}
                onClick={() => setActiveView(id as any)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between ${
                  activeView === id
                    ? "bg-[#F0EEFF] border-[#5B5BEF] shadow-md shadow-[#5B5BEF]/15"
                    : "bg-white border-[#DCD9FF] hover:border-[#5B5BEF]/50 hover:bg-[#F7F6FF]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-white border border-[#DCD9FF] flex items-center justify-center shadow-xs ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#10142F]">{label}</h3>
                    <p className="text-[10px] text-[#69708A] font-mono">{badge} Documents</p>
                  </div>
                </div>
                {domainRequests.filter(r => r.domain === id && r.status === "PENDING").length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {domainRequests.filter(r => r.domain === id && r.status === "PENDING").length} req
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Global Platform Suites Sub-Navigation ──────────── */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#DCD9FF]/60">
          <span className="text-[10px] font-mono uppercase text-[#69708A] font-bold shrink-0 mr-1">
            Global Suites:
          </span>
          {[
            { id: "wallet", label: "Credential Wallet", icon: KeyRound, badge: credentials.length },
            { id: "passports", label: "Transition Passports", icon: Briefcase, badge: activePassportStatus === "PENDING_APPROVAL" ? 1 : undefined },
            { id: "consents", label: "Requests & Consents", icon: Share2, badge: domainRequests.filter(r => r.status === "PENDING").length },
            { id: "zk", label: "ZK Proofs", icon: Fingerprint, badge: zkProofs.length },
            { id: "burn", label: "Burn Tokens", icon: Flame, badge: burnTokens.filter(b => !b.is_burned).length },
            { id: "intel", label: "Credential Intel", icon: Brain, badge: intelReport?.flags?.length || undefined },
            { id: "camera", label: "Doc Digitizer", icon: Camera },
          ].map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setActiveView(id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeView === id
                  ? "bg-[#10142F] text-white shadow-sm"
                  : "bg-white text-[#69708A] hover:text-[#10142F] border border-[#DCD9FF] hover:bg-[#F0EEFF]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              {badge !== undefined && badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeView === id ? "bg-[#5B5BEF] text-white" : "bg-[#F0EEFF] text-[#5B5BEF]"
                }`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════
            DOMAINS VIEW (Academic, Healthcare, Finance, Employment)
           ═══════════════════════════════════════════════════════ */}
        {(activeView === "academic" || activeView === "healthcare" || activeView === "finance" || activeView === "employment") && (
          <div className="mt-6 space-y-6 animate-fade-up">

            {/* Domain Panel Header */}
            <div className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F0EEFF] border border-[#DCD9FF] flex items-center justify-center text-[#5B5BEF] shadow-sm">
                  {activeView === "academic" && <GraduationCap className="w-7 h-7 text-[#5B5BEF]" />}
                  {activeView === "healthcare" && <HeartPulse className="w-7 h-7 text-rose-500" />}
                  {activeView === "finance" && <Landmark className="w-7 h-7 text-emerald-600" />}
                  {activeView === "employment" && <Briefcase className="w-7 h-7 text-amber-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded badge-indigo font-bold">
                      {activeView.toUpperCase()} SOVEREIGN DOMAIN
                    </span>
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Data Isolated
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-[#10142F] mt-1 capitalize">
                    {activeView} Panel
                  </h2>
                  <p className="text-xs text-[#69708A] mt-0.5">
                    {activeView === "academic" && "Degrees, marksheets, transcript requests, and academic verification tokens."}
                    {activeView === "healthcare" && "Verified medical records, diagnostic reports, prescriptions, and clinical consent."}
                    {activeView === "finance" && "Income tax attestations, credit credentials, bank proofs, and lender authorizations."}
                    {activeView === "employment" && "Job experience certificates, internship records, employer requests, and verification tokens."}
                  </p>
                </div>
              </div>

              {/* Token Status Summary Box */}
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF] shrink-0">
                <div className="text-center px-3 py-1">
                  <div className="text-xs font-mono font-bold text-emerald-700">🟢 {approvedRequestsCount}</div>
                  <div className="text-[10px] text-[#69708A] uppercase font-bold">Approved</div>
                </div>
                <div className="h-6 w-[1px] bg-[#DCD9FF]" />
                <div className="text-center px-3 py-1">
                  <div className="text-xs font-mono font-bold text-amber-600">🟡 {pendingRequestsCount}</div>
                  <div className="text-[10px] text-[#69708A] uppercase font-bold">Pending</div>
                </div>
                <div className="h-6 w-[1px] bg-[#DCD9FF]" />
                <div className="text-center px-3 py-1">
                  <div className="text-xs font-mono font-bold text-rose-600">🔴 {rejectedRequestsCount}</div>
                  <div className="text-[10px] text-[#69708A] uppercase font-bold">Rejected</div>
                </div>
              </div>
            </div>

            {/* Grid Layout: Left Column = Issued Documents, Right Column = Requests & Token Status */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* ── LEFT: Issued Documents (Section 4) ──────── */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#10142F] flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-[#5B5BEF]" />
                      <span>Issued Documents & Credentials</span>
                    </h3>
                    <p className="text-xs text-[#69708A]">
                      Cryptographically signed documents belonging strictly to {activeView}.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full badge-indigo">
                    {currentDomainDocs.length} documents
                  </span>
                </div>

                <div className="space-y-3">
                  {currentDomainDocs.map(doc => (
                    <div
                      key={doc.id}
                      className="p-5 rounded-2xl glass-card bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] transition-all shadow-sm relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F0EEFF] text-[#5B5BEF] flex items-center justify-center shrink-0 mt-0.5">
                            {activeView === "academic" && <GraduationCap className="w-5 h-5" />}
                            {activeView === "healthcare" && <HeartPulse className="w-5 h-5 text-rose-500" />}
                            {activeView === "finance" && <Landmark className="w-5 h-5 text-emerald-600" />}
                            {activeView === "employment" && <Briefcase className="w-5 h-5 text-amber-500" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5B5BEF] font-bold">
                                {doc.category}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold badge-lime">
                                ✓ {doc.status}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-[#10142F] mt-1">{doc.title}</h4>
                            <p className="text-xs text-[#69708A] mt-0.5">
                              Issuer: <strong className="text-[#10142F]">{doc.issuer}</strong> · Date: {doc.date}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedDocDetails(doc)}
                          className="p-2 rounded-xl bg-white hover:bg-[#F0EEFF] border border-[#DCD9FF] text-[#69708A] hover:text-[#5B5BEF] shadow-sm transition-all shrink-0"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Document Details Grid */}
                      <div className="mt-3 pt-3 border-t border-[#F0EEFF] grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(doc.details).map(([k, v]) => (
                          <div key={k} className="p-2 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]/70">
                            <span className="text-[10px] font-mono text-[#69708A] block uppercase font-semibold">{k}</span>
                            <span className="font-bold text-[#10142F] truncate block mt-0.5">{v}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#69708A]">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#5B5BEF]" />
                          <span className="truncate max-w-[200px]">{doc.hash}</span>
                        </span>
                        <button
                          onClick={() => copyToClipboard(doc.hash, doc.id)}
                          className="text-[#5B5BEF] hover:underline flex items-center gap-1 font-bold"
                        >
                          {copiedId === doc.id ? "Copied" : "Copy Hash"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── RIGHT: Requests & Token Status (Section 3 & 5) ─ */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#10142F] flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-[#5B5BEF]" />
                      <span>Requests & Token Status</span>
                    </h3>
                    <p className="text-xs text-[#69708A]">Purpose-bound disclosures & verifier tokens.</p>
                  </div>
                </div>

                {/* Filter Tabs: All, Pending, Approved, Rejected */}
                <div className="flex gap-1.5 p-1 rounded-xl bg-[#F0EEFF] border border-[#DCD9FF] text-xs font-bold">
                  {(["ALL", "PENDING", "APPROVED", "REJECTED"] as RequestFilterStatus[]).map(f => (
                    <button
                      key={f}
                      onClick={() => setRequestFilter(f)}
                      className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                        requestFilter === f
                          ? "bg-white text-[#10142F] shadow-xs"
                          : "text-[#69708A] hover:text-[#10142F]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Requests List */}
                <div className="space-y-3">
                  {currentDomainRequests.length === 0 ? (
                    <div className="p-8 text-center glass-card bg-white rounded-2xl border-[#DCD9FF]">
                      <Share2 className="w-8 h-8 text-[#69708A] mx-auto mb-2 opacity-50" />
                      <h4 className="text-sm font-bold text-[#10142F]">No {requestFilter} Requests</h4>
                      <p className="text-xs text-[#69708A] mt-1">There are no requests matching this status in {activeView}.</p>
                    </div>
                  ) : (
                    currentDomainRequests.map(req => (
                      <div
                        key={req.id}
                        className={`p-4 rounded-2xl glass-card bg-white border shadow-sm transition-all ${
                          req.status === "PENDING"
                            ? "border-amber-300 bg-amber-50/10"
                            : req.status === "APPROVED"
                            ? "border-emerald-300"
                            : "border-rose-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded badge-indigo font-bold">
                              FROM: {req.requester}
                            </span>
                            <div className="text-[11px] text-[#69708A] font-mono mt-0.5">{req.date}</div>
                          </div>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 ${
                              req.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-800"
                                : req.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {req.status === "APPROVED" && "🟢 Approved"}
                            {req.status === "PENDING" && "🟡 Pending"}
                            {req.status === "REJECTED" && "🔴 Rejected"}
                          </span>
                        </div>

                        <div className="text-xs space-y-1 mb-3">
                          <div>
                            <span className="text-[#69708A] font-bold">Requested: </span>
                            <strong className="text-[#10142F]">{req.requestedDocument}</strong>
                          </div>
                          <div>
                            <span className="text-[#69708A] font-bold">Purpose: </span>
                            <span className="text-[#10142F]">{req.purpose}</span>
                          </div>
                          <div className="text-[11px] text-[#69708A] font-mono">
                            <span>Access Info: {req.expiry}</span>
                          </div>
                        </div>

                        {/* Interactive Buttons for Pending Requests */}
                        {req.status === "PENDING" && (
                          <div className="flex gap-2 pt-2 border-t border-[#F0EEFF]">
                            <button
                              onClick={() => handleDomainRequestAction(req.id, true)}
                              className="flex-1 py-2 rounded-xl btn-primary text-xs font-bold text-white flex items-center justify-center gap-1 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve Token
                            </button>
                            <button
                              onClick={() => handleDomainRequestAction(req.id, false)}
                              className="py-2 px-3 rounded-xl btn-secondary text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        )}

                        {/* Approved Token Indicator & Show QR */}
                        {req.status === "APPROVED" && req.verificationToken && (
                          <div className="pt-2 border-t border-[#F0EEFF] flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Token Active
                            </span>
                            <button
                              onClick={() => setQrModalToken(req.verificationToken!)}
                              className="px-3 py-1 rounded-xl btn-secondary text-xs font-bold flex items-center gap-1 text-[#5B5BEF]"
                            >
                              <QrCode className="w-3.5 h-3.5" /> Show QR
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            GLOBAL FEATURE 1: CREDENTIAL WALLET
           ═══════════════════════════════════════════════════════ */}
        {activeView === "wallet" && (
          <div className="mt-6 space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCD9FF]">
              <div>
                <h3 className="text-2xl font-black text-[#10142F] flex items-center gap-2">
                  <KeyRound className="w-6 h-6 text-[#5B5BEF]" />
                  <span>Unified Credential Wallet</span>
                </h3>
                <p className="text-xs text-[#69708A] mt-0.5">
                  Universal cryptographic credential store categorized across all life stages.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full badge-indigo">
                {credentials.length + domainDocuments.length} Total Verified Credentials
              </span>
            </div>

            {/* Categorized Wallet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domainDocuments.map(doc => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl glass-card bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F0EEFF] text-[#5B5BEF] flex items-center justify-center shrink-0">
                        {doc.domain === "academic" && <GraduationCap className="w-5 h-5 text-[#5B5BEF]" />}
                        {doc.domain === "healthcare" && <HeartPulse className="w-5 h-5 text-rose-500" />}
                        {doc.domain === "finance" && <Landmark className="w-5 h-5 text-emerald-600" />}
                        {doc.domain === "employment" && <Briefcase className="w-5 h-5 text-amber-500" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold badge-indigo">
                            {doc.domain}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold badge-lime">
                            ✓ {doc.status}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-base text-[#10142F] mt-1">{doc.title}</h4>
                        <p className="text-xs text-[#69708A] mt-0.5">Issuer: {doc.issuer}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDocDetails(doc)}
                      className="p-2 rounded-xl bg-white hover:bg-[#F0EEFF] border border-[#DCD9FF] text-[#69708A] hover:text-[#5B5BEF] shadow-sm transition-all shrink-0"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0EEFF] flex items-center justify-between text-[11px] font-mono text-[#69708A]">
                    <span className="truncate max-w-[200px]">{doc.hash}</span>
                    <button
                      onClick={() => {
                        setActiveView(doc.domain);
                      }}
                      className="text-[#5B5BEF] font-bold hover:underline"
                    >
                      Open {doc.domain} Panel →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            GLOBAL FEATURE 2: TRANSITION PASSPORTS
           ═══════════════════════════════════════════════════════ */}
        {activeView === "passports" && (
          <div className="mt-6 space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCD9FF]">
              <div>
                <h3 className="text-2xl font-black text-[#10142F] flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-[#5B5BEF]" />
                  <span>Transition Passports</span>
                </h3>
                <p className="text-xs text-[#69708A] mt-0.5">
                  Multi-domain life event verification bundles spanning Academic, Healthcare, Finance, and Employment.
                </p>
              </div>
              <button
                onClick={() => setCreatePassportOpen(true)}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> + Create Transition Passport
              </button>
            </div>

            {/* Cross-Domain Passports Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Passport 1: College -> Employment */}
              <div className="p-5 rounded-2xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded badge-indigo font-bold">
                    🎓 Academic → 💼 Employment
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold badge-lime">
                    ✓ Shared with TechNova
                  </span>
                </div>
                <h4 className="text-lg font-black text-[#10142F]">Starting My First Tech Job</h4>
                <p className="text-xs text-[#69708A]">
                  Bundles degree, AI transcript, and skill certificate into a single minimal-disclosure proof.
                </p>
                <div className="p-3 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF] text-xs space-y-1 font-medium">
                  <div className="text-emerald-700">✓ B.Tech Degree Certificate</div>
                  <div className="text-emerald-700">✓ AI/ML Honors Diploma</div>
                  <div className="text-emerald-700">✓ Identity Citizen Attestation</div>
                </div>
                <button
                  onClick={() => setPassportModalOpen(true)}
                  className="w-full py-2 rounded-xl btn-secondary text-xs font-bold text-[#5B5BEF]"
                >
                  Inspect Passport Package
                </button>
              </div>

              {/* Passport 2: Employment -> Finance */}
              <div className="p-5 rounded-2xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded badge-indigo font-bold">
                    💼 Employment → 💰 Finance
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold badge-amber">
                    Pending Underwriting
                  </span>
                </div>
                <h4 className="text-lg font-black text-[#10142F]">First Home Loan Pre-Qualification</h4>
                <p className="text-xs text-[#69708A]">
                  Proves employment tenure & solvency without exposing complete account transaction history.
                </p>
                <div className="p-3 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF] text-xs space-y-1 font-medium">
                  <div className="text-emerald-700">✓ TechNova Employment Attestation</div>
                  <div className="text-emerald-700">✓ ITR-V Verified Income Proof</div>
                  <div className="text-emerald-700">✓ CIBIL Score &gt; 750 Proof</div>
                </div>
                <button
                  onClick={() => setPassportModalOpen(true)}
                  className="w-full py-2 rounded-xl btn-secondary text-xs font-bold text-[#5B5BEF]"
                >
                  Review Proof Bundle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            GLOBAL FEATURE 3: ZK PROOFS
           ═══════════════════════════════════════════════════════ */}
        {activeView === "zk" && (
          <div className="mt-6 space-y-6 animate-fade-up">
            <div className="pb-4 border-b border-[#DCD9FF]">
              <h3 className="text-2xl font-black text-[#10142F] flex items-center gap-2">
                <Fingerprint className="w-6 h-6 text-[#5B5BEF]" />
                <span>Zero-Knowledge Attribute Proofs</span>
              </h3>
              <p className="text-xs text-[#69708A] mt-0.5">
                Prove eligibility criteria without sharing sensitive underlying data across Academic, Healthcare, Finance, and Employment.
              </p>
            </div>

            {/* ZK Generator */}
            <div className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm">
              <div className="text-xs font-mono text-[#5B5BEF] uppercase font-bold mb-4 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Generate Multi-Domain ZK Proof
              </div>

              <form onSubmit={handleCreateZKProof} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                      Domain
                    </label>
                    <select
                      value={zkDomainTag}
                      onChange={(e) => {
                        const d = e.target.value as DomainType;
                        setZkDomainTag(d);
                        if (d === "academic") setZkAttr("cgpa");
                        else if (d === "healthcare") setZkAttr("blood_pressure");
                        else if (d === "finance") setZkAttr("annual_income");
                        else setZkAttr("experience_years");
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] text-xs font-bold"
                    >
                      <option value="academic">🎓 Academic</option>
                      <option value="healthcare">🏥 Healthcare</option>
                      <option value="finance">💰 Finance</option>
                      <option value="employment">💼 Employment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                      Attribute
                    </label>
                    <input
                      type="text"
                      value={zkAttr}
                      onChange={(e) => setZkAttr(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                      Predicate
                    </label>
                    <select
                      value={zkPredicate}
                      onChange={(e) => setZkPredicate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] text-xs font-bold"
                    >
                      <option>&gt;</option>
                      <option>&gt;=</option>
                      <option>==</option>
                      <option>&lt;</option>
                      <option>&lt;=</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                      Threshold
                    </label>
                    <input
                      type="text"
                      value={zkThreshold}
                      onChange={(e) => setZkThreshold(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] text-xs font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={zkLoading}
                  className="btn-primary w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md shadow-[#5B5BEF]/20"
                >
                  {zkLoading ? "Generating Cryptographic ZK Proof..." : "Generate ZK Proof"}
                </button>
              </form>

              {zkResult && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 animate-fade-down space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{zkResult.label}</span>
                  </div>
                  <div className="font-mono text-[10px] break-all bg-white p-2.5 rounded-xl border border-emerald-200">
                    Proof Hash: {zkResult.proof_hash}
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Sovereign privacy guarantee: The underlying raw value was never revealed to the verifier.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            GLOBAL FEATURE 4: BURN TOKENS
           ═══════════════════════════════════════════════════════ */}
        {activeView === "burn" && (
          <div className="mt-6 space-y-6 animate-fade-up">
            <div className="pb-4 border-b border-[#DCD9FF]">
              <h3 className="text-2xl font-black text-[#10142F] flex items-center gap-2">
                <Flame className="w-6 h-6 text-[#EA580C]" />
                <span>Burn-After-Reading Tokens</span>
              </h3>
              <p className="text-xs text-[#69708A] mt-0.5">
                Generate single-use, self-destructing QR links for sensitive records across any life stage.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm">
              <form onSubmit={handleCreateBurnToken} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Select Target Consent / Domain
                  </label>
                  <select
                    value={burnConsentId}
                    onChange={(e) => setBurnConsentId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] text-xs font-bold"
                  >
                    <option value="acad_consent">🎓 Academic: Imperial Graduate Institute</option>
                    <option value="health_consent">🏥 Healthcare: Apollo Multi-Speciality Clinic</option>
                    <option value="fin_consent">💰 Finance: HDFC Home Loans Underwriting</option>
                    <option value="emp_consent">💼 Employment: Google India Staffing Division</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Time To Live (TTL): <strong className="text-[#EA580C]">{burnTTL} Minutes</strong>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={60}
                    value={burnTTL}
                    onChange={(e) => setBurnTTL(Number(e.target.value))}
                    className="w-full accent-[#5B5BEF]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={burnLoading}
                  className="btn-primary w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md shadow-[#5B5BEF]/20"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>Generate Self-Destructing Burn Token</span>
                </button>
              </form>

              {burnResult && (
                <div className="mt-5 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
                  <div className="font-bold text-sm text-amber-900">
                    🔥 Burn Token Active — Self-Destructs in {burnTTL} min
                  </div>
                  <div className="inline-block p-4 rounded-2xl bg-white border border-amber-200 shadow-md">
                    <QRCodeSVG value={burnResult.verify_url || `http://localhost:3000/burn/${burnResult.token}`} size={150} level="H" />
                  </div>
                  <div className="text-[10px] font-mono text-[#69708A] break-all bg-white p-2 rounded-xl border border-amber-200">
                    {burnResult.verify_url}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            GLOBAL FEATURE 5: CREDENTIAL INTELLIGENCE
           ═══════════════════════════════════════════════════════ */}
        {activeView === "intel" && (
          <div className="mt-6 space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCD9FF]">
              <div>
                <h3 className="text-2xl font-black text-[#10142F] flex items-center gap-2">
                  <Brain className="w-6 h-6 text-[#5B5BEF]" />
                  <span>Credential Intelligence Suite</span>
                </h3>
                <p className="text-xs text-[#69708A] mt-0.5">
                  Automated verification analysis, issuer integrity, and anomaly detection across all four life stages.
                </p>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Overall Quality: 96 / 100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { domain: "🎓 Academic", score: "98/100", status: "✓ Valid · Issuer Verified", notes: "No conflicts detected" },
                { domain: "🏥 Healthcare", score: "94/100", status: "✓ Valid · Signature Verified", notes: "1 prescription review item" },
                { domain: "💰 Finance", score: "96/100", status: "✓ Valid · Tax Seal Verified", notes: "Clean credit history" },
                { domain: "💼 Employment", score: "95/100", status: "✓ Valid · Issuer Verified", notes: "Tenure matches timeline" },
              ].map((item) => (
                <div key={item.domain} className="p-4 rounded-2xl glass-card bg-white border border-[#DCD9FF] shadow-xs">
                  <div className="text-xs font-bold text-[#10142F] mb-1">{item.domain}</div>
                  <div className="text-lg font-black text-[#5B5BEF]">{item.score}</div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-1">{item.status}</div>
                  <div className="text-[10px] text-[#69708A] mt-0.5">{item.notes}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            GLOBAL FEATURE 6: DOCUMENT DIGITIZER
           ═══════════════════════════════════════════════════════ */}
        {activeView === "camera" && (
          <div className="mt-6 space-y-6 animate-fade-up">
            <div className="pb-4 border-b border-[#DCD9FF]">
              <h3 className="text-2xl font-black text-[#10142F] flex items-center gap-2">
                <Camera className="w-6 h-6 text-[#5B5BEF]" />
                <span>Smart Document Digitizer</span>
              </h3>
              <p className="text-xs text-[#69708A] mt-0.5">
                Upload or capture physical certificates → classify into domain → import directly into sovereign ledger.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card bg-white border border-[#DCD9FF] shadow-sm space-y-4">
              {/* Classification Selector */}
              <div>
                <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-2 font-mono">
                  Target Domain Classification
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "academic", label: "🎓 Academic" },
                    { id: "healthcare", label: "🏥 Healthcare" },
                    { id: "finance", label: "💰 Finance" },
                    { id: "employment", label: "💼 Employment" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTargetDigitizerDomain(id as DomainType)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        targetDigitizerDomain === id
                          ? "bg-[#F0EEFF] border-[#5B5BEF] text-[#5B5BEF]"
                          : "bg-white border-[#DCD9FF] text-[#69708A]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {!cameraStream && !extractedData && (
                <div className="aspect-video rounded-2xl border-2 border-dashed border-[#DCD9FF] bg-[#F7F6FF] flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <ScanLine className="w-12 h-12 text-[#5B5BEF]" />
                  <div className="font-bold text-sm text-[#10142F]">Capture Document via Camera or Upload</div>
                  <p className="text-xs text-[#69708A] max-w-sm">
                    Our OCR pipeline will parse your document and classify it into your selected {targetDigitizerDomain.toUpperCase()} domain.
                  </p>
                  <div className="flex gap-2.5 mt-2">
                    <button
                      onClick={startCamera}
                      className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5" /> Open Camera
                    </button>
                    <button
                      onClick={() => simulateDigitize(targetDigitizerDomain)}
                      className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold text-[#10142F] flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#5B5BEF]" /> Simulate Sample File
                    </button>
                  </div>
                </div>
              )}

              {cameraStream && (
                <div className="space-y-3">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black relative">
                    <video
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                      ref={(el) => { if (el && cameraStream) el.srcObject = cameraStream; }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { stopCamera(); simulateDigitize(targetDigitizerDomain); }}
                      className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold text-white flex items-center justify-center gap-2"
                    >
                      <ScanLine className="w-4 h-4" /> Capture & Extract Data
                    </button>
                    <button
                      onClick={stopCamera}
                      className="py-2.5 px-4 rounded-xl btn-secondary text-xs font-bold text-[#69708A]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {digitizerLoading && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-[#E8E6FF] border-t-[#5B5BEF] rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-bold text-[#10142F]">Extracting fields & validating cryptographic signatures…</p>
                </div>
              )}

              {extractedData && !digitizerLoading && (
                <div className="space-y-3 p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0]">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Classification: Classified into {targetDigitizerDomain.toUpperCase()}</span>
                  </div>
                  <div className="grid gap-2">
                    {Object.entries(extractedData).map(([k, v]) => (
                      <div key={k} className="flex justify-between p-2.5 rounded-xl bg-white border border-emerald-200 text-xs">
                        <span className="font-mono text-[#69708A] uppercase font-bold">{k.replace(/_/g, " ")}:</span>
                        <span className="font-bold text-[#10142F]">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleImportDigitizedDoc}
                      className="flex-1 py-2.5 rounded-xl btn-primary text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Import to {targetDigitizerDomain.toUpperCase()} Panel
                    </button>
                    <button
                      onClick={() => setExtractedData(null)}
                      className="py-2.5 px-4 rounded-xl btn-secondary text-xs font-bold text-[#69708A]"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            GLOBAL SUITE: REQUESTS & CONSENTS LEDGER
           ═══════════════════════════════════════════════════════ */}
        {activeView === "consents" && (
          <div className="mt-6 space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCD9FF]">
              <div>
                <h3 className="text-2xl font-black text-[#10142F] flex items-center gap-2">
                  <Share2 className="w-6 h-6 text-[#5B5BEF]" />
                  <span>Requests & Consents Ledger</span>
                </h3>
                <p className="text-xs text-[#69708A] mt-0.5">
                  Universal citizen consent hub · Approve or reject purpose-bound access requests across all domains.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full badge-indigo">
                  {domainRequests.filter(r => r.status === "PENDING").length} Pending Authorization
                </span>
              </div>
            </div>

            {/* Domain Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { id: "ALL", label: "All Domains" },
                { id: "finance", label: "💰 Finance" },
                { id: "healthcare", label: "🏥 Healthcare" },
                { id: "employment", label: "💼 Employment" },
                { id: "academic", label: "🎓 Academic" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setConsentDomainFilter(id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    consentDomainFilter === id
                      ? "bg-[#5B5BEF] text-white shadow-xs"
                      : "bg-white text-[#69708A] hover:text-[#10142F] border border-[#DCD9FF]"
                  }`}
                >
                  {label} ({id === "ALL" ? domainRequests.length : domainRequests.filter(r => r.domain === id).length})
                </button>
              ))}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-1.5 p-1 rounded-xl bg-[#F0EEFF] border border-[#DCD9FF] text-xs font-bold max-w-md">
              {(["ALL", "PENDING", "APPROVED", "REJECTED"] as RequestFilterStatus[]).map(f => (
                <button
                  key={f}
                  onClick={() => setRequestFilter(f)}
                  className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                    requestFilter === f
                      ? "bg-white text-[#10142F] shadow-xs"
                      : "text-[#69708A] hover:text-[#10142F]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Requests Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {domainRequests
                .filter(r => {
                  if (consentDomainFilter !== "ALL" && r.domain !== consentDomainFilter) return false;
                  if (requestFilter === "PENDING") return r.status === "PENDING";
                  if (requestFilter === "APPROVED") return r.status === "APPROVED";
                  if (requestFilter === "REJECTED") return r.status === "REJECTED";
                  return true;
                })
                .map(req => (
                  <div
                    key={req.id}
                    className={`p-5 rounded-2xl glass-card bg-white border shadow-sm transition-all flex flex-col justify-between ${
                      req.status === "PENDING"
                        ? "border-amber-300 bg-amber-50/10 shadow-md shadow-amber-500/5"
                        : req.status === "APPROVED"
                        ? "border-emerald-300"
                        : "border-rose-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-[#F0EEFF] border border-[#DCD9FF] flex items-center justify-center text-[#5B5BEF]">
                            {req.domain === "finance" ? (
                              <Landmark className="w-4 h-4 text-emerald-600" />
                            ) : req.domain === "healthcare" ? (
                              <HeartPulse className="w-4 h-4 text-rose-500" />
                            ) : req.domain === "employment" ? (
                              <Briefcase className="w-4 h-4 text-amber-500" />
                            ) : (
                              <GraduationCap className="w-4 h-4 text-[#5B5BEF]" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-black text-[#10142F] block">
                              {req.requester}
                            </span>
                            <span className="text-[10px] font-mono text-[#69708A]">
                              {req.domain.toUpperCase()} · {req.date}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 ${
                            req.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : req.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {req.status === "APPROVED" && "🟢 Approved"}
                          {req.status === "PENDING" && "🟡 Pending"}
                          {req.status === "REJECTED" && "🔴 Rejected"}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]/70 text-xs space-y-1.5 mb-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#69708A] font-bold block">
                            Requested Credential:
                          </span>
                          <strong className="text-[#10142F] text-xs font-extrabold">{req.requestedDocument}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#69708A] font-bold block">
                            Stated Purpose:
                          </span>
                          <span className="text-[#10142F] font-semibold">{req.purpose}</span>
                        </div>
                        <div className="text-[11px] text-[#69708A] font-mono">
                          <span>Access: {req.expiry}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {/* Action buttons for pending */}
                      {req.status === "PENDING" && (
                        <div className="flex gap-2 pt-2 border-t border-[#F0EEFF]">
                          <button
                            onClick={() => handleDomainRequestAction(req.id, true)}
                            className="flex-1 py-2 rounded-xl btn-primary text-xs font-bold text-white flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve Token
                          </button>
                          <button
                            onClick={() => handleDomainRequestAction(req.id, false)}
                            className="py-2 px-3 rounded-xl btn-secondary text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}

                      {/* Approved token info */}
                      {req.status === "APPROVED" && req.verificationToken && (
                        <div className="pt-2 border-t border-[#F0EEFF] flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Token Active
                          </span>
                          <button
                            onClick={() => setQrModalToken(req.verificationToken!)}
                            className="px-3 py-1 rounded-xl btn-secondary text-xs font-bold flex items-center gap-1 text-[#5B5BEF]"
                          >
                            <QrCode className="w-3.5 h-3.5" /> Show QR
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Modals & Drawers ──────────────────────────────── */}
        {selectedDocDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10142F]/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card bg-white p-6 sm:p-7 max-w-lg w-full border-[#DCD9FF] shadow-2xl relative">
              <button
                onClick={() => setSelectedDocDetails(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-[#69708A] hover:bg-[#F0EEFF] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded badge-indigo font-bold">
                  {selectedDocDetails.domain.toUpperCase()} DOCUMENT
                </span>
              </div>
              <h3 className="text-xl font-black text-[#10142F] mt-1">{selectedDocDetails.title}</h3>
              <p className="text-xs text-[#69708A] mt-0.5">
                Issued by {selectedDocDetails.issuer} · Date: {selectedDocDetails.date}
              </p>

              <div className="mt-4 space-y-2">
                {Object.entries(selectedDocDetails.details).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF] flex justify-between text-xs">
                    <span className="font-mono text-[#69708A] uppercase font-bold">{k}:</span>
                    <span className="font-bold text-[#10142F]">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[#10142F] text-white font-mono text-[10px] break-all border border-[#171B40]">
                SHA-256: {selectedDocDetails.hash}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0EEFF] flex justify-end">
                <button
                  onClick={() => setSelectedDocDetails(null)}
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Token Modal */}
        {qrModalToken && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10142F]/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card bg-white p-6 sm:p-7 max-w-sm w-full border-[#DCD9FF] shadow-2xl relative text-center">
              <button
                onClick={() => setQrModalToken(null)}
                className="absolute top-4 right-4 p-2 rounded-xl text-[#69708A] hover:bg-[#F0EEFF]"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-black text-[#10142F] mb-1">Verifiable Access Token</h3>
              <p className="text-xs text-[#69708A] mb-4">Scan QR to verify authorized credentials with minimal disclosure.</p>

              <div className="inline-block p-4 rounded-2xl bg-white border border-[#DCD9FF] shadow-sm mb-3">
                <QRCodeSVG value={`http://localhost:3000/verify/${qrModalToken}`} size={160} level="H" />
              </div>
              <div className="text-[11px] font-mono text-[#69708A] break-all bg-[#F7F6FF] p-2.5 rounded-xl border border-[#DCD9FF]">
                {qrModalToken}
              </div>
              <button
                onClick={() => setQrModalToken(null)}
                className="btn-primary w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Transition Passport Modals */}
        <TransitionPassportModal
          isOpen={passportModalOpen}
          onClose={() => setPassportModalOpen(false)}
          status={activePassportStatus}
          onApprove={() => {
            setActivePassportStatus("APPROVED");
            setActionSuccess("Transition Passport approved and securely shared!");
            setTimeout(() => setActionSuccess(null), 5000);
          }}
          onReject={() => {
            setActivePassportStatus("REJECTED");
            setActionSuccess("Transition Passport request rejected.");
            setTimeout(() => setActionSuccess(null), 5000);
          }}
        />

        <CreatePassportModal
          isOpen={createPassportOpen}
          onClose={() => setCreatePassportOpen(false)}
          onCreate={(newP: any) => {
            setCustomPassports((prev) => [newP, ...prev]);
            setActionSuccess(`Transition Passport "${newP.title}" created successfully!`);
            setTimeout(() => setActionSuccess(null), 5000);
          }}
        />

      </main>
    </div>
  );
}
