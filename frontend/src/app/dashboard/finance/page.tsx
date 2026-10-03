"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { QRCodeSVG } from "qrcode.react";
import {
  Landmark,
  Users,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Plus,
  Search,
  Upload,
  Eye,
  RefreshCw,
  Lock,
  Calendar,
  ArrowRight,
  ChevronRight,
  Filter,
  Sparkles,
  Share2,
  Check,
  Shield,
  AlertCircle,
  FileCheck,
  Copy,
  CheckCheck,
  X,
  Send,
  Building2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Scale,
  Award,
  KeyRound,
  FileSpreadsheet,
  QrCode,
  ShieldAlert,
} from "lucide-react";

// ─── Data Types ──────────────────────────────────────────

export type FinancialVerificationStatus = "Verified" | "Review Required" | "Verification Failed";
export type FinanceRequestStatus = "Pending" | "Approved" | "Rejected" | "Expired";

export interface Customer {
  id: string;
  name: string;
  panMasked: string;
  email: string;
  phone: string;
  kycStatus: "Verified" | "Under Review";
  requestsCount: number;
  sharedDataCount: number;
  lastActivity: string;
}

export interface FinancialCredential {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  credentialType: "Income Verification" | "Employment / Income Proof" | "Credit Attestation" | "Solvency Certificate";
  issuer: string;
  issuedDate: string;
  status: FinancialVerificationStatus;
  hash: string;
  details: Record<string, string>;
  isApproved: boolean;
}

export interface FinancialDocument {
  id: string;
  customerId: string;
  customerName: string;
  documentType: string;
  title: string;
  issuer: string;
  date: string;
  status: FinancialVerificationStatus;
  hash: string;
  details: Record<string, string>;
  isApproved: boolean;
}

export interface BankCustomerRequest {
  id: string;
  customerId: string;
  customerName: string;
  requestedItems: string[];
  purpose: string;
  accessDuration: string;
  status: FinanceRequestStatus;
  date: string;
  verificationToken?: string;
  notes?: string;
}

export interface SharedDataItem {
  id: string;
  customerId: string;
  customerName: string;
  sharedItems: string[];
  purpose: string;
  consentStatus: "Approved" | "Rejected" | "Expired";
  status: "Active" | "Inactive / Revoked";
  approvedDate: string;
  expiresIn: string;
  verificationToken: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  text: string;
  type: "request" | "approval" | "verify" | "reject";
  badge: string;
}

// ─── Initial Mock Data ────────────────────────────────────

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "LK-PAT-1082",
    name: "Parth Patil",
    panMasked: "ABCDE****F",
    email: "parth@lifekey.id",
    phone: "+91 98112-99882",
    kycStatus: "Verified",
    requestsCount: 2,
    sharedDataCount: 2,
    lastActivity: "Today, 11:45 AM",
  },
  {
    id: "LK-PAT-9021",
    name: "Rahul Sharma",
    panMasked: "FGHIJ****K",
    email: "rahul.sharma@lifekey.id",
    phone: "+91 98765-43210",
    kycStatus: "Verified",
    requestsCount: 1,
    sharedDataCount: 1,
    lastActivity: "Yesterday",
  },
  {
    id: "LK-PAT-4412",
    name: "Ananya Iyer",
    panMasked: "KLMNO****P",
    email: "ananya.iyer@lifekey.id",
    phone: "+91 98231-10294",
    kycStatus: "Verified",
    requestsCount: 1,
    sharedDataCount: 1,
    lastActivity: "2 days ago",
  },
  {
    id: "LK-PAT-5531",
    name: "Maya Sharma",
    panMasked: "PQRST****U",
    email: "maya.sharma@lifekey.id",
    phone: "+91 97654-32109",
    kycStatus: "Under Review",
    requestsCount: 1,
    sharedDataCount: 0,
    lastActivity: "Sep 28, 2026",
  },
];

const INITIAL_FINANCIAL_CREDENTIALS: FinancialCredential[] = [
  {
    id: "CRED-FIN-01",
    customerId: "LK-PAT-1082",
    customerName: "Parth Patil",
    title: "Annual Income Tax Return (ITR-V) Attestation",
    credentialType: "Income Verification",
    issuer: "Income Tax Department of India (e-Filing)",
    issuedDate: "2026-07-28",
    status: "Verified",
    hash: "0x1293847561029384756201948572019485720194857201948572019485720194",
    details: {
      "Assessment Year": "2025-26",
      "Gross Annual Income": "₹14,50,000",
      "Filing Status": "Processed & Tax Fully Paid",
      "Cryptographic Seal": "Valid CBDT Digital Signature",
    },
    isApproved: true,
  },
  {
    id: "CRED-FIN-02",
    customerId: "LK-PAT-1082",
    customerName: "Parth Patil",
    title: "TechNova Senior AI Engineer Verified Salary Deposit",
    credentialType: "Employment / Income Proof",
    issuer: "TechNova Solutions Pvt Ltd / HDFC Corporate",
    issuedDate: "2026-09-01",
    status: "Verified",
    hash: "0x7719283740192837401928374019283740192837401928374019283740192837",
    details: {
      "Designation": "Senior AI Software Engineer",
      "Net Monthly Salary": "₹1,20,800",
      "Tenure": "2.4 Years Active",
      "Direct Deposit": "HDFC Priority Salary Hub",
    },
    isApproved: true,
  },
  {
    id: "CRED-FIN-03",
    customerId: "LK-PAT-9021",
    customerName: "Rahul Sharma",
    title: "TransUnion CIBIL Sovereign Credit Score",
    credentialType: "Credit Attestation",
    issuer: "TransUnion CIBIL Bureau",
    issuedDate: "2026-08-15",
    status: "Verified",
    hash: "0xa817293847102938471928374019283740192837401928374019283740192837",
    details: {
      "Credit Score": "785 / 900",
      "Standing": "Tier-1 Prime",
      "Active Facilities": "1 Car Loan (Regular), 1 Credit Card",
      "Defaults / Overdues": "0",
    },
    isApproved: true,
  },
  {
    id: "CRED-FIN-04",
    customerId: "LK-PAT-4412",
    customerName: "Ananya Iyer",
    title: "Form 16 Annual Withholding Certificate",
    credentialType: "Income Verification",
    issuer: "Max Healthcare Corporate Payroll",
    issuedDate: "2026-08-20",
    status: "Review Required",
    hash: "0x6619283740192837401928374019283740192837401928374019283740192837",
    details: {
      "Assessment Year": "2025-26",
      "Gross Emoluments": "₹11,20,000",
      "TDS Deducted": "₹1,18,000",
      "Status": "Pending Secondary Issuer Seal",
    },
    isApproved: true,
  },
];

const INITIAL_FINANCIAL_DOCUMENTS: FinancialDocument[] = [
  {
    id: "DOC-FIN-01",
    customerId: "LK-PAT-1082",
    customerName: "Parth Patil",
    documentType: "Income Proof",
    title: "Official ITR-V Assessment Order & Tax Computation",
    issuer: "Income Tax Department of India",
    date: "2026-07-28",
    status: "Verified",
    hash: "0x1293847561029384756201948572019485720194857201948572019485720194",
    details: {
      "Assessment Year": "2025-26",
      "Verified Income": "₹14,50,000",
      "Filing Acknowledgment": "ACK-ITR-99210-2026",
    },
    isApproved: true,
  },
  {
    id: "DOC-FIN-02",
    customerId: "LK-PAT-1082",
    customerName: "Parth Patil",
    documentType: "Employment Proof",
    title: "TechNova Employment & Salary Structure Certificate",
    issuer: "TechNova Solutions Pvt Ltd",
    date: "2026-09-01",
    status: "Verified",
    hash: "0x7719283740192837401928374019283740192837401928374019283740192837",
    details: {
      "Role": "Senior AI Engineer",
      "Employment Type": "Permanent Full-Time",
      "Direct Salary Credit": "Verified HDFC Account",
    },
    isApproved: true,
  },
  {
    id: "DOC-FIN-03",
    customerId: "LK-PAT-9021",
    customerName: "Rahul Sharma",
    documentType: "Credit Attestation",
    title: "CIBIL CIR Credit Information Report",
    issuer: "TransUnion CIBIL",
    date: "2026-08-15",
    status: "Verified",
    hash: "0xa817293847102938471928374019283740192837401928374019283740192837",
    details: {
      "Score": "785",
      "Inquiries (Past 6M)": "1",
      "Delinquencies": "None",
    },
    isApproved: true,
  },
  {
    id: "DOC-FIN-04",
    customerId: "LK-PAT-5531",
    customerName: "Maya Sharma",
    documentType: "Solvency Certificate",
    title: "Unverified Liquid Asset Self-Declaration",
    issuer: "Independent Chartered Accountant",
    date: "2026-09-10",
    status: "Verification Failed",
    hash: "0x3319283740192837401928374019283740192837401928374019283740192837",
    details: {
      "Discrepancy": "Issuer digital certificate revoked",
      "Integrity Check": "Signature mismatch detected",
    },
    isApproved: false,
  },
];

const INITIAL_REQUESTS_TO_CUSTOMERS: BankCustomerRequest[] = [
  {
    id: "REQ-BANK-01",
    customerId: "LK-PAT-1082",
    customerName: "Parth Patil",
    requestedItems: ["Income Verification (ITR-V)", "Employment / Income Proof"],
    purpose: "Home Loan Application & Pre-Sanction Underwriting",
    accessDuration: "48 hours single-use access",
    status: "Pending",
    date: "2026-10-02",
  },
  {
    id: "REQ-BANK-02",
    customerId: "LK-PAT-9021",
    customerName: "Rahul Sharma",
    requestedItems: ["Employment / Income Proof", "Credit Score Attestation"],
    purpose: "Auto Loan Loan Application",
    accessDuration: "24 hours",
    status: "Approved",
    date: "2026-09-25",
    verificationToken: "lifekey_token_fin_hdfc_rahul_9910",
  },
  {
    id: "REQ-BANK-03",
    customerId: "LK-PAT-4412",
    customerName: "Ananya Iyer",
    requestedItems: ["Income Verification (Form 16)"],
    purpose: "Priority Credit Card Application",
    accessDuration: "72 hours",
    status: "Approved",
    date: "2026-09-20",
    verificationToken: "lifekey_token_fin_hdfc_ananya_8812",
  },
  {
    id: "REQ-BANK-04",
    customerId: "LK-PAT-5531",
    customerName: "Maya Sharma",
    requestedItems: ["Solvency Certificate", "Income Verification"],
    purpose: "Commercial Equipment Finance Application",
    accessDuration: "48 hours",
    status: "Rejected",
    date: "2026-09-12",
  },
];

const INITIAL_SHARED_DATA: SharedDataItem[] = [
  {
    id: "SHARE-01",
    customerId: "LK-PAT-9021",
    customerName: "Rahul Sharma",
    sharedItems: ["Employment Verification", "Income Proof (ITR-V)", "CIBIL Score: 785"],
    purpose: "Auto Loan Application",
    consentStatus: "Approved",
    status: "Active",
    approvedDate: "2026-09-25",
    expiresIn: "18 days remaining",
    verificationToken: "lifekey_token_fin_hdfc_rahul_9910",
  },
  {
    id: "SHARE-02",
    customerId: "LK-PAT-4412",
    customerName: "Ananya Iyer",
    sharedItems: ["Form 16 Annual Income Proof", "Direct Deposit Attestation"],
    purpose: "Priority Credit Card Application",
    consentStatus: "Approved",
    status: "Active",
    approvedDate: "2026-09-20",
    expiresIn: "12 days remaining",
    verificationToken: "lifekey_token_fin_hdfc_ananya_8812",
  },
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "ACT-FIN-1",
    timestamp: "15 mins ago",
    text: "Verified Income Proof (ITR-V): Gross ₹14,50,000 for Parth Patil",
    type: "verify",
    badge: "Verified",
  },
  {
    id: "ACT-FIN-2",
    timestamp: "1 hour ago",
    text: "Customer approved disclosure: Rahul Sharma granted access for Auto Loan Application",
    type: "approval",
    badge: "Approved",
  },
  {
    id: "ACT-FIN-3",
    timestamp: "3 hours ago",
    text: "Sent purpose-bound request for Income & Employment Proof to Parth Patil",
    type: "request",
    badge: "Requested",
  },
  {
    id: "ACT-FIN-4",
    timestamp: "Yesterday",
    text: "Verification failed for Solvency Declaration (Maya Sharma): Invalid digital seal",
    type: "reject",
    badge: "Failed",
  },
];

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "customers" | "credentials" | "documents" | "verification" | "requests" | "shared" | "profile"
  >("dashboard");

  // State Management
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [credentials, setCredentials] = useState<FinancialCredential[]>(INITIAL_FINANCIAL_CREDENTIALS);
  const [documents, setDocuments] = useState<FinancialDocument[]>(INITIAL_FINANCIAL_DOCUMENTS);
  const [requests, setRequests] = useState<BankCustomerRequest[]>(INITIAL_REQUESTS_TO_CUSTOMERS);
  const [sharedData, setSharedData] = useState<SharedDataItem[]>(INITIAL_SHARED_DATA);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  // Selected Customer for Profile View
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("LK-PAT-1082");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  // Verification Hub State
  const [selectedVerifyCred, setSelectedVerifyCred] = useState<FinancialCredential | null>(INITIAL_FINANCIAL_CREDENTIALS[0]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    issuerCheck: boolean;
    hashMatch: boolean;
    purposeMatch: boolean;
    status: FinancialVerificationStatus;
    message: string;
  } | null>(null);

  // New Request Form State
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reqCustomerId, setReqCustomerId] = useState<string>("LK-PAT-1082");
  const [reqPurpose, setReqPurpose] = useState("Home Loan Application");
  const [reqItems, setReqItems] = useState<string[]>(["Income Verification (ITR-V)", "Employment / Income Proof"]);
  const [reqDuration, setReqDuration] = useState("48 hours");
  const [requestSuccessBanner, setRequestSuccessBanner] = useState<string | null>(null);

  // Document Detail Modal
  const [selectedDocModal, setSelectedDocModal] = useState<FinancialDocument | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // QR Modal
  const [qrModalToken, setQrModalToken] = useState<string | null>(null);

  // Sync with localStorage on load & storage events
  useEffect(() => {
    const handleSync = () => {
      try {
        const storedReqs = localStorage.getItem("lifekey_finance_requests");
        if (storedReqs) {
          const parsed = JSON.parse(storedReqs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRequests(prev => {
              const combined = [...prev];
              parsed.forEach((pr: BankCustomerRequest) => {
                const idx = combined.findIndex(c => c.id === pr.id);
                if (idx >= 0) combined[idx] = pr;
                else combined.unshift(pr);
              });
              return combined;
            });
          }
        }

        const storedShares = localStorage.getItem("lifekey_finance_shared");
        if (storedShares) {
          const parsedShares = JSON.parse(storedShares);
          if (Array.isArray(parsedShares) && parsedShares.length > 0) {
            setSharedData(prev => {
              const combinedShares = [...prev];
              parsedShares.forEach((ps: SharedDataItem) => {
                const idx = combinedShares.findIndex(s => s.id === ps.id);
                if (idx >= 0) combinedShares[idx] = ps;
                else combinedShares.unshift(ps);
              });
              return combinedShares;
            });
          }
        }
      } catch {
        // fallback to initial
      }
    };

    handleSync();
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  const addActivity = (text: string, type: ActivityItem["type"], badge: string) => {
    const newAct: ActivityItem = {
      id: `ACT-FIN-${Date.now()}`,
      timestamp: "Just now",
      text,
      type,
      badge,
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // ─── Actions ─────────────────────────────────────────────

  // Section 6: Send Request to Customer Flow
  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (reqItems.length === 0) return;

    const targetCustomer = customers.find(c => c.id === reqCustomerId) || customers[0];
    const newReqId = `REQ-BANK-${Date.now().toString().slice(-4)}`;

    const newReq: BankCustomerRequest = {
      id: newReqId,
      customerId: targetCustomer.id,
      customerName: targetCustomer.name,
      requestedItems: [...reqItems],
      purpose: reqPurpose,
      accessDuration: reqDuration,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    const updated = [newReq, ...requests];
    setRequests(updated);

    // Save to localStorage so it syncs with user-side Finance -> Requests & Consents
    try {
      localStorage.setItem("lifekey_finance_requests", JSON.stringify(updated));
    } catch {
      // ignore
    }

    addActivity(
      `Sent request for ${reqItems.join(", ")} to ${targetCustomer.name} (Purpose: ${reqPurpose})`,
      "request",
      "Pending"
    );

    setRequestModalOpen(false);
    setRequestSuccessBanner(
      `Request sent to ${targetCustomer.name} for ${reqPurpose}. Status: Pending sovereign customer authorization.`
    );
    setTimeout(() => setRequestSuccessBanner(null), 6000);
  };

  // Section 5: Run Verification Action
  const handleRunVerification = () => {
    if (!selectedVerifyCred) return;
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      const isClean = selectedVerifyCred.status !== "Verification Failed";

      const res = {
        valid: isClean,
        issuerCheck: isClean,
        hashMatch: isClean,
        purposeMatch: true,
        status: (isClean ? "Verified" : "Verification Failed") as FinancialVerificationStatus,
        message: isClean
          ? "RSA 2048-bit issuer signature is authentic. SHA-256 hash matches the registered credential payload. Data disclosure strictly matches stated financial purpose."
          : "Verification failed: Digital seal is revoked or hash mismatch detected.",
      };

      setVerificationResult(res);

      // Update credential status in list if changed
      if (isClean && selectedVerifyCred.status === "Review Required") {
        setCredentials(prev =>
          prev.map(c => c.id === selectedVerifyCred.id ? { ...c, status: "Verified" } : c)
        );
        setSelectedVerifyCred(prev => prev ? { ...prev, status: "Verified" } : null);
      }

      addActivity(
        `${isClean ? "Verified" : "Verification Failed"}: ${selectedVerifyCred.title} for ${selectedVerifyCred.customerName}`,
        isClean ? "verify" : "reject",
        isClean ? "Verified" : "Failed"
      );
    }, 900);
  };

  // Simulation: Customer Approves or Rejects Request
  const handleSimulateCustomerResponse = (reqId: string, approve: boolean) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;

    const newStatus: FinanceRequestStatus = approve ? "Approved" : "Rejected";
    const token = approve ? `lifekey_token_fin_hdfc_${Date.now().toString().slice(-4)}` : undefined;

    const updatedRequests = requests.map(r =>
      r.id === reqId ? { ...r, status: newStatus, verificationToken: token } : r
    );
    setRequests(updatedRequests);

    try {
      localStorage.setItem("lifekey_finance_requests", JSON.stringify(updatedRequests));
    } catch {
      // ignore
    }

    if (approve) {
      // Add to Shared Data
      const newShare: SharedDataItem = {
        id: `SHARE-${Date.now().toString().slice(-4)}`,
        customerId: req.customerId,
        customerName: req.customerName,
        sharedItems: [...req.requestedItems],
        purpose: req.purpose,
        consentStatus: "Approved",
        status: "Active",
        approvedDate: new Date().toISOString().split("T")[0],
        expiresIn: req.accessDuration || "48 hours",
        verificationToken: token || "lifekey_token_fin_active",
      };
      setSharedData(prev => [newShare, ...prev]);

      addActivity(
        `Customer approved disclosure: ${req.customerName} granted access for ${req.purpose}`,
        "approval",
        "Approved"
      );
    } else {
      addActivity(
        `Customer rejected disclosure: ${req.customerName} denied access request`,
        "reject",
        "Rejected"
      );
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];
  const customerCredentials = credentials.filter(c => c.customerId === activeCustomer.id);
  const customerDocuments = documents.filter(d => d.customerId === activeCustomer.id);

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        {/* ── Top Header ────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#DCD9FF]">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded badge-indigo font-bold tracking-wider flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" /> AUTHORIZED FINANCIAL INSTITUTION NODE
              </span>
              <span className="text-[11px] text-[#69708A] font-mono font-medium">
                HDFC Bank Ltd · Wholesale & Retail Underwriting Hub
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#10142F] tracking-tight">
              Finance <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5BEF] to-[#7A5AF8]">Institutional</span> Panel
            </h1>
            <p className="text-sm text-[#69708A] mt-1 font-normal">
              Purpose-bound financial verification · Cryptographic proof validation · Zero secret exposure
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setActiveTab("verification");
              }}
              className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-[#10142F] shadow-sm hover:border-[#5B5BEF]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verify Credential
            </button>
            <button
              onClick={() => setRequestModalOpen(true)}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#5B5BEF]/20"
            >
              <Send className="w-3.5 h-3.5" /> New Request to Customer
            </button>
          </div>
        </div>

        {/* ── Critical Financial Security Banner ────────────────── */}
        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#F0EEFF] to-[#F7F6FF] border border-[#DCD9FF] text-xs text-[#10142F] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#5B5BEF] shrink-0" />
            <span>
              <strong>Cryptographic Protocol Notice:</strong> LIFEKEY verifies authorized financial credentials and issuer signatures. We never store or request passwords, PINs, CVVs, or OTPs.
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#DCD9FF] text-emerald-700 font-bold shrink-0 hidden sm:inline-block">
            RBI Standard Compliant
          </span>
        </div>

        {/* ── Success Banner ────────────────────────────────────── */}
        {requestSuccessBanner && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2 shadow-sm animate-fade-down">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="font-semibold">{requestSuccessBanner}</div>
          </div>
        )}

        {/* ── Navigation Tabs (All 8 Required Sections) ─────────── */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#DCD9FF]/60">
          {[
            { id: "dashboard", label: "Bank Dashboard", icon: Landmark },
            { id: "customers", label: "Customers", icon: Users, badge: customers.length },
            { id: "credentials", label: "Financial Credentials", icon: KeyRound, badge: credentials.length },
            { id: "documents", label: "Documents", icon: FileText, badge: documents.length },
            { id: "verification", label: "Verification", icon: CheckCircle2 },
            { id: "requests", label: "Requests to Customers", icon: Send, badge: requests.filter(r => r.status === "Pending").length },
            { id: "shared", label: "Shared Data", icon: Share2, badge: sharedData.length },
            { id: "profile", label: "Organization Profile", icon: Building2 },
          ].map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === id
                  ? "bg-[#5B5BEF] text-white shadow-md shadow-[#5B5BEF]/25"
                  : "bg-white text-[#69708A] hover:text-[#10142F] border border-[#DCD9FF] hover:bg-[#F0EEFF]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              {badge !== undefined && badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === id ? "bg-white text-[#5B5BEF]" : "bg-[#F0EEFF] text-[#5B5BEF]"
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 1: BANK DASHBOARD
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "dashboard" && (
          <div className="mt-6 space-y-6">
            {/* 6 Key Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div
                onClick={() => setActiveTab("customers")}
                className="p-4 rounded-2xl glass-card bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] cursor-pointer transition-all shadow-xs"
              >
                <div className="text-[10px] font-mono text-[#69708A] uppercase font-bold">Total Customers</div>
                <div className="text-2xl font-black text-[#10142F] mt-1">{customers.length}</div>
                <div className="text-[10px] text-[#5B5BEF] font-semibold mt-1">Sovereign KYC ✓</div>
              </div>

              <div
                onClick={() => setActiveTab("requests")}
                className="p-4 rounded-2xl glass-card bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] cursor-pointer transition-all shadow-xs"
              >
                <div className="text-[10px] font-mono text-[#69708A] uppercase font-bold">Pending Requests</div>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {requests.filter(r => r.status === "Pending").length}
                </div>
                <div className="text-[10px] text-amber-700 font-semibold mt-1">Awaiting Consent</div>
              </div>

              <div
                onClick={() => setActiveTab("requests")}
                className="p-4 rounded-2xl glass-card bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] cursor-pointer transition-all shadow-xs"
              >
                <div className="text-[10px] font-mono text-[#69708A] uppercase font-bold">Approved Requests</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {requests.filter(r => r.status === "Approved").length}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">Tokens Active</div>
              </div>

              <div
                onClick={() => setActiveTab("requests")}
                className="p-4 rounded-2xl glass-card bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] cursor-pointer transition-all shadow-xs"
              >
                <div className="text-[10px] font-mono text-[#69708A] uppercase font-bold">Rejected Requests</div>
                <div className="text-2xl font-black text-rose-600 mt-1">
                  {requests.filter(r => r.status === "Rejected").length}
                </div>
                <div className="text-[10px] text-rose-700 font-semibold mt-1">Access Blocked</div>
              </div>

              <div
                onClick={() => setActiveTab("shared")}
                className="p-4 rounded-2xl glass-card bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] cursor-pointer transition-all shadow-xs"
              >
                <div className="text-[10px] font-mono text-[#69708A] uppercase font-bold">Shared Data</div>
                <div className="text-2xl font-black text-[#5B5BEF] mt-1">{sharedData.length}</div>
                <div className="text-[10px] text-[#5B5BEF] font-semibold mt-1">Authorized Active</div>
              </div>

              <div
                onClick={() => setActiveTab("verification")}
                className="p-4 rounded-2xl glass-card bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] cursor-pointer transition-all shadow-xs"
              >
                <div className="text-[10px] font-mono text-[#69708A] uppercase font-bold">Verification Rate</div>
                <div className="text-2xl font-black text-[#10142F] mt-1">98.4%</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">Zero Tamper</div>
              </div>
            </div>

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left Column: Quick Customer Snapshot & Shared Credentials */}
              <div className="lg:col-span-8 space-y-6">
                <div className="glass-card p-6 bg-white border border-[#DCD9FF]">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F0EEFF]">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-[#5B5BEF] tracking-wider">
                        ACTIVE CUSTOMER FILE
                      </span>
                      <h3 className="text-xl font-black text-[#10142F] flex items-center gap-2 mt-0.5">
                        {activeCustomer.name}
                        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5B5BEF]">
                          {activeCustomer.id}
                        </span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReqCustomerId(activeCustomer.id);
                          setRequestModalOpen(true);
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold btn-primary text-white flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" /> Request Information
                      </button>
                    </div>
                  </div>

                  {/* Customer Quick Vitals */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[#F0EEFF] text-xs">
                    <div>
                      <span className="text-[#69708A] block">Masked PAN</span>
                      <span className="font-bold font-mono text-[#10142F]">{activeCustomer.panMasked}</span>
                    </div>
                    <div>
                      <span className="text-[#69708A] block">KYC Status</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {activeCustomer.kycStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#69708A] block">Active Disclosures</span>
                      <span className="font-bold text-[#10142F]">{customerCredentials.length} Credentials</span>
                    </div>
                    <div>
                      <span className="text-[#69708A] block">Last Activity</span>
                      <span className="font-medium text-[#69708A]">{activeCustomer.lastActivity}</span>
                    </div>
                  </div>

                  {/* Customer's Finance-Only Information */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono">
                        Authorized Financial Credentials ({customerCredentials.length})
                      </span>
                      <span className="text-[11px] text-[#69708A]">Strictly Financial Domain Only</span>
                    </div>

                    <div className="space-y-2.5">
                      {customerCredentials.map(cred => (
                        <div
                          key={cred.id}
                          className="p-3.5 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#5B5BEF] transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white border border-[#DCD9FF] flex items-center justify-center text-[#5B5BEF] shrink-0 mt-0.5">
                              <Landmark className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#10142F]">{cred.title}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  ✓ {cred.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#69708A] mt-0.5">
                                {cred.issuer} · Issued: {cred.issuedDate}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => {
                                setSelectedVerifyCred(cred);
                                setActiveTab("verification");
                              }}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold btn-secondary text-[#5B5BEF] flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verify
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Customer Switcher Strip */}
                <div className="glass-card p-5 bg-white border border-[#DCD9FF]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono">
                      Switch Customer File
                    </span>
                    <button
                      onClick={() => setActiveTab("customers")}
                      className="text-xs font-bold text-[#5B5BEF] hover:underline"
                    >
                      View All Customers ({customers.length}) →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {customers.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCustomerId(c.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          selectedCustomerId === c.id
                            ? "bg-[#F0EEFF] border-[#5B5BEF] shadow-sm"
                            : "bg-white border-[#DCD9FF] hover:bg-[#F7F6FF]"
                        }`}
                      >
                        <div className="text-xs font-bold text-[#10142F] truncate">{c.name}</div>
                        <div className="text-[10px] text-[#69708A] font-mono">{c.id}</div>
                        <div className="text-[10px] text-emerald-700 font-semibold mt-1">KYC: {c.kycStatus}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Pending Requests & Activity Trail */}
              <div className="lg:col-span-4 space-y-6">
                {/* Pending Requests Box */}
                <div className="glass-card p-5 bg-white border border-[#DCD9FF]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-amber-500" /> Pending Requests
                    </span>
                    <button
                      onClick={() => setActiveTab("requests")}
                      className="text-xs font-bold text-[#5B5BEF] hover:underline"
                    >
                      All Requests →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {requests.slice(0, 3).map(req => (
                      <div
                        key={req.id}
                        className="p-3.5 rounded-xl bg-[#FAFAFE] border border-[#E8E6FF] text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#10142F]">{req.customerName}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              req.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : req.status === "Pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#69708A]">
                          <strong>Purpose:</strong> {req.purpose}
                        </div>
                        <div className="text-[10px] text-[#69708A] font-mono">
                          Requested: {req.requestedItems.join(", ")}
                        </div>

                        {req.status === "Pending" && (
                          <div className="pt-2 border-t border-[#F0EEFF] flex items-center justify-between">
                            <span className="text-[10px] text-[#69708A]">Simulate Customer:</span>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleSimulateCustomerResponse(req.id, true)}
                                className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded hover:bg-emerald-200"
                              >
                                Approve 🟢
                              </button>
                              <button
                                onClick={() => handleSimulateCustomerResponse(req.id, false)}
                                className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 rounded hover:bg-rose-200"
                              >
                                Reject 🔴
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Audit */}
                <div className="glass-card p-5 bg-white border border-[#DCD9FF]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#5B5BEF]" /> Recent Activity
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activities.slice(0, 4).map(act => (
                      <div key={act.id} className="flex items-start gap-2.5 text-xs">
                        <div className="w-2 h-2 rounded-full bg-[#5B5BEF] mt-1.5 shrink-0" />
                        <div>
                          <div className="text-[#10142F] font-medium leading-snug">{act.text}</div>
                          <div className="text-[10px] text-[#69708A] font-mono mt-0.5">{act.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION 2: CUSTOMERS (Strict Finance Information Only)
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "customers" && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Customer Directory List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="glass-card p-5 bg-white border border-[#DCD9FF]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-base text-[#10142F]">Customer Directory</h3>
                  <span className="text-xs text-[#69708A] font-mono">{customers.length} clients</span>
                </div>

                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#69708A]" />
                  <input
                    type="text"
                    placeholder="Search customer name or ID..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                  />
                </div>

                <div className="space-y-2">
                  {customers
                    .filter(c => c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) || c.id.toLowerCase().includes(customerSearchQuery.toLowerCase()))
                    .map(c => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCustomerId(c.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          selectedCustomerId === c.id
                            ? "bg-[#F0EEFF] border-[#5B5BEF] shadow-sm"
                            : "bg-white border-[#DCD9FF] hover:bg-[#F7F6FF]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#10142F]">{c.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            {c.kycStatus}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#69708A] mt-1 flex items-center justify-between">
                          <span>ID: {c.id}</span>
                          <span>{c.lastActivity}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Selected Customer Financial Profile */}
            <div className="lg:col-span-8 space-y-5">
              <div className="glass-card p-6 bg-white border border-[#DCD9FF]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EEFF]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5B5BEF] to-[#7167F6] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                      {activeCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-[#10142F]">{activeCustomer.name}</h2>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5B5BEF] font-bold">
                          {activeCustomer.id}
                        </span>
                      </div>
                      <p className="text-xs text-[#69708A] mt-0.5">
                        Authorized Banking Partner Profile · Restricted strictly to Financial Domain
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setReqCustomerId(activeCustomer.id);
                      setRequestModalOpen(true);
                    }}
                    className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm self-start sm:self-center"
                  >
                    <Send className="w-3.5 h-3.5" /> Request Information
                  </button>
                </div>

                {/* Identity & Verification Parameters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#F0EEFF] text-xs">
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">PAN Attestation</span>
                    <span className="font-bold text-[#10142F] text-sm font-mono">{activeCustomer.panMasked}</span>
                  </div>
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">KYC Verification</span>
                    <span className="font-bold text-sm text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {activeCustomer.kycStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">Phone Verified</span>
                    <span className="font-bold text-[#10142F] text-xs mt-0.5 block">{activeCustomer.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">Digital Email</span>
                    <span className="font-bold text-[#10142F] text-xs truncate mt-0.5 block">{activeCustomer.email}</span>
                  </div>
                </div>

                {/* Financial Documents for this Customer */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-sm text-[#10142F]">Shared Financial Records & Proofs</h4>
                    <span className="text-xs font-mono font-bold text-[#5B5BEF]">
                      {customerDocuments.length} documents on file
                    </span>
                  </div>

                  <div className="space-y-3">
                    {customerDocuments.map(doc => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-2xl bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F0EEFF] text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Landmark className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#10142F]">{doc.title}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  doc.status === "Verified"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : doc.status === "Review Required"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {doc.status}
                              </span>
                            </div>
                            <p className="text-xs text-[#69708A] mt-0.5">
                              {doc.issuer} · Date: {doc.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => setSelectedDocModal(doc)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold btn-secondary text-[#10142F] flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#5B5BEF]" /> Inspect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION 3: FINANCIAL CREDENTIALS
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "credentials" && (
          <div className="mt-6 space-y-6">
            <div className="pb-4 border-b border-[#DCD9FF]">
              <h3 className="text-xl font-black text-[#10142F] flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#5B5BEF]" />
                <span>Verified Financial Credentials</span>
              </h3>
              <p className="text-xs text-[#69708A] mt-0.5">
                Authorized credentials received from sovereign customer wallets. Focused on cryptographic verification, not raw banking secrets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {credentials.map(cred => (
                <div
                  key={cred.id}
                  className="p-5 rounded-2xl glass-card bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#5B5BEF] bg-[#F0EEFF] px-2 py-0.5 rounded">
                        {cred.credentialType}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cred.status === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : cred.status === "Review Required"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        ✓ {cred.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-[#10142F]">{cred.title}</h4>
                    <p className="text-xs text-[#69708A] mt-0.5">Customer: <strong>{cred.customerName}</strong> ({cred.customerId})</p>

                    <div className="mt-3 pt-3 border-t border-[#F0EEFF] grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(cred.details).map(([k, v]) => (
                        <div key={k} className="p-2 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]/70">
                          <span className="text-[10px] font-mono text-[#69708A] block uppercase font-semibold">{k}</span>
                          <span className="font-bold text-[#10142F] truncate block mt-0.5">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0EEFF] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#69708A] truncate max-w-[170px]">
                      {cred.hash.slice(0, 20)}...
                    </span>
                    <button
                      onClick={() => {
                        setSelectedVerifyCred(cred);
                        setActiveTab("verification");
                      }}
                      className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verify Credential
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION 4: DOCUMENTS
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "documents" && (
          <div className="mt-6 space-y-6">
            <div className="pb-4 border-b border-[#DCD9FF]">
              <h3 className="text-xl font-black text-[#10142F] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#5B5BEF]" />
                <span>Authorized Financial Documents</span>
              </h3>
              <p className="text-xs text-[#69708A] mt-0.5">
                Official financial verification documents, tax filings, and salary attestations shared by customers.
              </p>
            </div>

            <div className="space-y-3">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl glass-card bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F0EEFF] text-[#5B5BEF] flex items-center justify-center shrink-0 mt-0.5">
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-[#10142F]">{doc.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5B5BEF] font-bold">
                          {doc.documentType}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.status === "Verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : doc.status === "Review Required"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#69708A] mt-1 flex items-center gap-3">
                        <span>Customer: <strong className="text-[#10142F]">{doc.customerName}</strong></span>
                        <span>·</span>
                        <span>Issuer: {doc.issuer}</span>
                        <span>·</span>
                        <span>Date: {doc.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => setSelectedDocModal(doc)}
                      className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-bold text-[#10142F] flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#5B5BEF]" /> View Document Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION 5: VERIFICATION
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "verification" && (
          <div className="mt-6 space-y-6">
            <div className="pb-4 border-b border-[#DCD9FF]">
              <h3 className="text-xl font-black text-[#10142F] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Financial Credential Verification Hub</span>
              </h3>
              <p className="text-xs text-[#69708A] mt-0.5">
                Verify RSA-2048 issuer signatures, payload SHA-256 integrity, expiry dates, and purpose alignment.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Credential Selection */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono block">
                  Select Received Credential to Verify
                </span>
                <div className="space-y-2.5">
                  {credentials.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedVerifyCred(c);
                        setVerificationResult(null);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedVerifyCred?.id === c.id
                          ? "bg-[#F0EEFF] border-[#5B5BEF] shadow-sm"
                          : "bg-white border-[#DCD9FF] hover:bg-[#F7F6FF]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#10142F]">{c.title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.status === "Verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : c.status === "Review Required"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#69708A]">
                        Customer: {c.customerName} · {c.issuer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Verification Inspection & Action */}
              <div className="lg:col-span-7">
                {selectedVerifyCred ? (
                  <div className="glass-card p-6 bg-white border border-[#DCD9FF] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0EEFF]">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#5B5BEF] font-bold tracking-wider">
                          CREDENTIAL INSPECTION
                        </span>
                        <h4 className="text-lg font-black text-[#10142F] mt-0.5">{selectedVerifyCred.title}</h4>
                        <p className="text-xs text-[#69708A]">
                          Customer: {selectedVerifyCred.customerName} ({selectedVerifyCred.customerId})
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          selectedVerifyCred.status === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : selectedVerifyCred.status === "Review Required"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        Current Status: {selectedVerifyCred.status}
                      </span>
                    </div>

                    {/* Verification Checklist Items */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]">
                        <span className="text-[#69708A] block font-mono text-[10px] uppercase font-bold">Issuer</span>
                        <span className="font-bold text-[#10142F] mt-0.5 block">{selectedVerifyCred.issuer}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]">
                        <span className="text-[#69708A] block font-mono text-[10px] uppercase font-bold">Issue Date</span>
                        <span className="font-bold text-[#10142F] mt-0.5 block font-mono">{selectedVerifyCred.issuedDate}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono block">
                        Payload Cryptographic Hash (SHA-256)
                      </span>
                      <div className="p-2.5 rounded-xl bg-[#10142F] text-white font-mono text-[10px] break-all border border-[#171B40]">
                        {selectedVerifyCred.hash}
                      </div>
                    </div>

                    {/* Verification Action Button */}
                    <button
                      onClick={handleRunVerification}
                      disabled={isVerifying}
                      className="btn-primary w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md shadow-[#5B5BEF]/20 disabled:opacity-50"
                    >
                      {isVerifying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verifying RSA Signature & Hash Integrity...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify Credential Validity & Integrity</span>
                        </>
                      )}
                    </button>

                    {/* Verification Result Output */}
                    {verificationResult && (
                      <div
                        className={`p-4 rounded-2xl border text-xs space-y-2 animate-fade-down ${
                          verificationResult.valid
                            ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                            : "bg-rose-50 border-rose-200 text-rose-900"
                        }`}
                      >
                        <div className="font-extrabold flex items-center gap-2 text-sm">
                          {verificationResult.valid ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Verification Check Succeeded: 🟢 Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-600" />
                              <span>Verification Check Failed: 🔴 Verification Failed</span>
                            </>
                          )}
                        </div>
                        <p className="leading-relaxed">{verificationResult.message}</p>
                        <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
                          <span className="bg-white/80 p-1.5 rounded text-center">
                            Issuer Signature: {verificationResult.issuerCheck ? "✓ Valid" : "✗ Invalid"}
                          </span>
                          <span className="bg-white/80 p-1.5 rounded text-center">
                            Payload Integrity: {verificationResult.hashMatch ? "✓ Match" : "✗ Mismatch"}
                          </span>
                          <span className="bg-white/80 p-1.5 rounded text-center">
                            Purpose Bound: {verificationResult.purposeMatch ? "✓ Conforming" : "✗ Divergent"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Regulatory Disclaimer (Mandatory Requirement) */}
                    <div className="p-3 rounded-xl bg-[#FAFAFE] border border-[#E8E6FF] text-[11px] text-[#69708A] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-[#69708A] shrink-0 mt-0.5" />
                      <span>
                        <strong>Verification Disclaimer:</strong> LIFEKEY verifies cryptographic origin, digital seal authenticity, and mathematical integrity of the issued credential. LIFEKEY does not itself guarantee the underlying financial solvency, asset liquidity, or future credit performance of the customer.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center glass-card bg-white border-[#DCD9FF] rounded-2xl">
                    <CheckCircle2 className="w-10 h-10 text-[#69708A] mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-[#69708A]">Select a credential from the list to begin verification.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION 6: REQUESTS TO CUSTOMERS
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "requests" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCD9FF]">
              <div>
                <h3 className="text-xl font-black text-[#10142F] flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#5B5BEF]" />
                  <span>Requests to Customers</span>
                </h3>
                <p className="text-xs text-[#69708A] mt-0.5">
                  Send purpose-specific, minimal information requests directly to customer sovereign wallets.
                </p>
              </div>

              <button
                onClick={() => setRequestModalOpen(true)}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Create New Request
              </button>
            </div>

            {/* Requests Table / Cards */}
            <div className="space-y-3">
              {requests.map(req => (
                <div
                  key={req.id}
                  className="glass-card p-5 bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] transition-all shadow-xs"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-base text-[#10142F]">{req.customerName}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5B5BEF] font-bold">
                          {req.customerId}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            req.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : req.status === "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              req.status === "Approved"
                                ? "bg-emerald-500"
                                : req.status === "Pending"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {req.status}
                        </span>
                      </div>

                      <div className="text-xs text-[#10142F]">
                        <strong>Purpose:</strong> {req.purpose}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap pt-0.5">
                        <span className="text-[11px] text-[#69708A]">Requested Items:</span>
                        {req.requestedItems.map(item => (
                          <span
                            key={item}
                            className="text-[11px] font-mono font-bold bg-[#F7F6FF] text-[#5B5BEF] px-2 py-0.5 rounded border border-[#DCD9FF]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-[#69708A] font-mono">
                        Date: {req.date} · Access: {req.accessDuration}
                      </div>
                    </div>

                    {/* Customer Action Simulation */}
                    {req.status === "Pending" && (
                      <div className="p-3 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF] shrink-0">
                        <div className="text-[10px] font-mono font-bold text-[#69708A] uppercase mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#5B5BEF]" />
                          <span>Simulate Customer Response</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSimulateCustomerResponse(req.id, true)}
                            className="px-2.5 py-1 text-xs font-bold bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            🟢 Customer Approves
                          </button>
                          <button
                            onClick={() => handleSimulateCustomerResponse(req.id, false)}
                            className="px-2.5 py-1 text-xs font-bold bg-white text-rose-700 border border-rose-300 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            🔴 Customer Rejects
                          </button>
                        </div>
                      </div>
                    )}

                    {req.status === "Approved" && req.verificationToken && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setQrModalToken(req.verificationToken!)}
                          className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 text-[#5B5BEF]"
                        >
                          <QrCode className="w-3.5 h-3.5" /> Show Verifiable QR
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION 7: SHARED DATA
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "shared" && (
          <div className="mt-6 space-y-6">
            <div className="pb-4 border-b border-[#DCD9FF]">
              <h3 className="text-xl font-black text-[#10142F] flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#5B5BEF]" />
                <span>Authorized Customer Shared Data</span>
              </h3>
              <p className="text-xs text-[#69708A] mt-0.5">
                Displays exclusively information where the customer has explicitly approved sovereign consent. Revoked or rejected consents are immediately deactivated.
              </p>
            </div>

            <div className="space-y-3">
              {sharedData.map(share => (
                <div
                  key={share.id}
                  className="glass-card p-5 bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] transition-all shadow-xs"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-base text-[#10142F]">{share.customerName}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5B5BEF] font-bold">
                          {share.customerId}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Consent: {share.consentStatus}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Status: {share.status}
                        </span>
                      </div>

                      <div className="text-xs text-[#10142F]">
                        <strong>Purpose:</strong> {share.purpose}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap pt-0.5">
                        <span className="text-[11px] text-[#69708A]">Shared Credentials:</span>
                        {share.sharedItems.map(item => (
                          <span
                            key={item}
                            className="text-[11px] font-mono font-bold bg-[#ECFDF5] text-emerald-800 px-2 py-0.5 rounded border border-[#A7F3D0]"
                          >
                            ✓ {item}
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-[#69708A] font-mono">
                        Approved: {share.approvedDate} · Access Window: {share.expiresIn}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setQrModalToken(share.verificationToken)}
                        className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                      >
                        <QrCode className="w-3.5 h-3.5" /> View Active Token
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION 8: ORGANIZATION PROFILE
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "profile" && (
          <div className="mt-6 space-y-6">
            <div className="pb-4 border-b border-[#DCD9FF]">
              <h3 className="text-xl font-black text-[#10142F] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#5B5BEF]" />
                <span>Financial Institution Profile</span>
              </h3>
              <p className="text-xs text-[#69708A] mt-0.5">
                Authorized verifier node identity, regulatory registration status, and sovereign cryptographic key details.
              </p>
            </div>

            <div className="glass-card p-6 bg-white border border-[#DCD9FF] space-y-6">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EEFF]">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-[#F0EEFF] text-[#5B5BEF] flex items-center justify-center font-black text-2xl border border-[#DCD9FF] shadow-xs">
                    <Landmark className="w-7 h-7 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#10142F]">HDFC Bank Limited</h2>
                    <p className="text-xs text-[#69708A] mt-0.5 font-medium">
                      Wholesale Lending & Retail Credit Risk Assessment Division
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold badge-lime flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Authorized Verifier Node
                  </span>
                </div>
              </div>

              {/* Institution Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]">
                  <span className="text-[#69708A] block font-mono text-[10px] uppercase font-bold">Organization Type</span>
                  <span className="font-extrabold text-sm text-[#10142F] mt-1 block">Scheduled Commercial Bank</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]">
                  <span className="text-[#69708A] block font-mono text-[10px] uppercase font-bold">Organization ID / Code</span>
                  <span className="font-extrabold text-sm text-[#5B5BEF] font-mono mt-1 block">FIN-IN-HDFC-8820</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]">
                  <span className="text-[#69708A] block font-mono text-[10px] uppercase font-bold">Regulatory Authority</span>
                  <span className="font-extrabold text-sm text-emerald-800 mt-1 block">Reserve Bank of India (RBI)</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]">
                  <span className="text-[#69708A] block font-mono text-[10px] uppercase font-bold">License Number</span>
                  <span className="font-extrabold text-xs text-[#10142F] font-mono mt-1 block">RBI/2026/SCB-9901-HDFC</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]">
                  <span className="text-[#69708A] block font-mono text-[10px] uppercase font-bold">Nodal Officer Contact</span>
                  <span className="font-extrabold text-xs text-[#10142F] mt-1 block">nodal.credit@hdfcbank.com</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF]">
                  <span className="text-[#69708A] block font-mono text-[10px] uppercase font-bold">Corporate Helpline</span>
                  <span className="font-extrabold text-xs text-[#10142F] mt-1 block">+91 22 6754-6000 / 1800-202-6161</span>
                </div>
              </div>

              {/* Security Commitments */}
              <div className="p-4 rounded-2xl bg-[#FAFAFE] border border-[#E8E6FF] space-y-2 text-xs">
                <span className="font-bold text-xs text-[#10142F] uppercase tracking-wider font-mono block">
                  Institutional Security Compliance Guarantee
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#69708A]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Strict Minimal Disclosure: Only requested fields are consumed.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>No Secret Storage: Passwords, PINs, OTPs, CVVs never stored.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Time-Delimited Access: Credentials expire automatically upon TTL end.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Zero-Knowledge Verification: Solvency verified without raw statements.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            MODAL: CREATE NEW REQUEST TO CUSTOMER (Section 6)
           ═══════════════════════════════════════════════════════ */}
        {requestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10142F]/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card bg-white p-6 sm:p-7 max-w-lg w-full border-[#DCD9FF] shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-[#69708A] hover:bg-[#F0EEFF] transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-[#5B5BEF] uppercase font-bold tracking-wider flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" /> INSTITUTIONAL DISCLOSURE REQUEST
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#10142F]">Request Information from Customer</h2>
              <p className="text-xs text-[#69708A] mt-1 mb-4">
                Specify relevant financial verification items and stated purpose. Customer must authorize via sovereign wallet.
              </p>

              {/* Safety notice in form */}
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Privacy Rule:</strong> Do not request passwords, PINs, CVVs, or unrelated healthcare/academic records. Only purpose-specific financial proofs are allowed.
                </span>
              </div>

              <form onSubmit={handleSendRequest} className="space-y-4">
                {/* 1. Customer Selector */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Select Customer
                  </label>
                  <select
                    value={reqCustomerId}
                    onChange={(e) => setReqCustomerId(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id}) — PAN: {c.panMasked}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Stated Purpose */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Purpose of Verification
                  </label>
                  <input
                    type="text"
                    required
                    value={reqPurpose}
                    onChange={(e) => setReqPurpose(e.target.value)}
                    placeholder="e.g. Loan Application, Credit Card Assessment"
                    className="w-full text-xs font-semibold p-3 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                  />
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    {["Loan Application", "Credit Card Assessment", "Overdraft Facility", "Mortgage Underwriting"].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setReqPurpose(preset)}
                        className="text-[10px] font-mono text-[#5B5BEF] bg-[#F0EEFF] px-2 py-0.5 rounded hover:bg-[#E8E6FF]"
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Requested Information Checkboxes (Relevant only) */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-2 font-mono">
                    Requested Financial Information
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Income Verification (ITR-V)",
                      "Employment / Income Proof",
                      "Credit Score Attestation",
                      "Bank Solvency Certificate",
                    ].map(item => {
                      const isSelected = reqItems.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            if (isSelected) setReqItems(reqItems.filter(i => i !== item));
                            else setReqItems([...reqItems, item]);
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between text-left transition-all ${
                            isSelected
                              ? "bg-[#F0EEFF] border-[#5B5BEF] text-[#5B5BEF]"
                              : "bg-white border-[#DCD9FF] text-[#69708A]"
                          }`}
                        >
                          <span>{item}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#5B5BEF] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Access Duration */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Access Duration Limit
                  </label>
                  <select
                    value={reqDuration}
                    onChange={(e) => setReqDuration(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                  >
                    <option value="24 hours">24 hours (Single-use)</option>
                    <option value="48 hours">48 hours (Underwriting Window)</option>
                    <option value="7 days">7 days (Standard Loan Assessment)</option>
                    <option value="Purpose-Specific">Purpose-Specific (Auto-expires on decision)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold text-[#69708A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reqItems.length === 0}
                    className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#5B5BEF]/20 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            MODAL: DOCUMENT DETAILS
           ═══════════════════════════════════════════════════════ */}
        {selectedDocModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10142F]/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card bg-white p-6 sm:p-7 max-w-lg w-full border-[#DCD9FF] shadow-2xl relative">
              <button
                onClick={() => setSelectedDocModal(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-[#69708A] hover:bg-[#F0EEFF] transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded badge-indigo font-bold">
                  {selectedDocModal.documentType}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedDocModal.status === "Verified"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  ✓ {selectedDocModal.status}
                </span>
              </div>
              <h3 className="text-xl font-black text-[#10142F] mt-1">{selectedDocModal.title}</h3>
              <p className="text-xs text-[#69708A] mt-0.5">
                Customer: {selectedDocModal.customerName} ({selectedDocModal.customerId}) · Issuer: {selectedDocModal.issuer}
              </p>

              <div className="mt-4 space-y-2">
                {Object.entries(selectedDocModal.details).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl bg-[#F7F6FF] border border-[#DCD9FF] flex justify-between text-xs">
                    <span className="font-mono text-[#69708A] uppercase font-bold">{k}:</span>
                    <span className="font-bold text-[#10142F]">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-[#10142F] text-white font-mono text-[10px] break-all border border-[#171B40]">
                SHA-256: {selectedDocModal.hash}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0EEFF] flex items-center justify-between">
                <button
                  onClick={() => copyHash(selectedDocModal.hash)}
                  className="text-xs font-mono text-[#5B5BEF] hover:underline font-bold flex items-center gap-1"
                >
                  {copiedHash ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHash ? "Copied Hash" : "Copy Hash"}</span>
                </button>
                <button
                  onClick={() => setSelectedDocModal(null)}
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            MODAL: VERIFIABLE QR TOKEN
           ═══════════════════════════════════════════════════════ */}
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
              <p className="text-xs text-[#69708A] mb-4">
                Active institutional disclosure token authorized by customer.
              </p>

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

      </main>
    </div>
  );
}
