"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Stethoscope,
  Activity,
  HeartPulse,
  User,
  Users,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Plus,
  Search,
  Upload,
  ShieldCheck,
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
} from "lucide-react";

// ─── Data Types ──────────────────────────────────────────

export type RecordType = "Diagnosis" | "Prescription" | "Lab Report" | "Medical History";
export type RecordStatus = "Verified" | "Needs Review" | "Invalid" | "Imported";
export type RequestStatus = "Pending" | "Approved" | "Rejected" | "Expired";

export interface HealthRecord {
  id: string;
  patientId: string;
  patientName: string;
  type: RecordType;
  title: string;
  issuedBy: string;
  source: string;
  date: string;
  status: RecordStatus;
  details: string;
  hash: string;
  isApprovedByPatient: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  email: string;
  phone: string;
  city: string;
  lastVisit: string;
  activeConsent: boolean;
}

export interface RecordRequest {
  id: string;
  patientId: string;
  patientName: string;
  requestedRecords: RecordType[];
  purpose: string;
  duration: string;
  status: RequestStatus;
  date: string;
  notes?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  text: string;
  type: "request" | "approval" | "view" | "verify" | "import" | "reject";
  badge: string;
}

// ─── Initial Mock Data ────────────────────────────────────

const INITIAL_PATIENTS: Patient[] = [
  {
    id: "LK-PAT-9021",
    name: "Rahul Verma",
    age: 28,
    gender: "Male",
    bloodGroup: "O+",
    email: "rahul.verma@lifekey.id",
    phone: "+91 98765-43210",
    city: "Pune",
    lastVisit: "2026-10-02",
    activeConsent: true,
  },
  {
    id: "LK-PAT-4412",
    name: "Ananya Iyer",
    age: 24,
    gender: "Female",
    bloodGroup: "B+",
    email: "ananya.iyer@lifekey.id",
    phone: "+91 98231-10294",
    city: "Mumbai",
    lastVisit: "2026-09-28",
    activeConsent: true,
  },
  {
    id: "LK-PAT-1082",
    name: "Parth Patil",
    age: 22,
    gender: "Male",
    bloodGroup: "A+",
    email: "parth@lifekey.id",
    phone: "+91 98112-99882",
    city: "Bangalore",
    lastVisit: "2026-09-15",
    activeConsent: false,
  },
  {
    id: "LK-PAT-5531",
    name: "Maya Sharma",
    age: 34,
    gender: "Female",
    bloodGroup: "AB+",
    email: "maya.sharma@lifekey.id",
    phone: "+91 97654-32109",
    city: "Delhi NCR",
    lastVisit: "2026-09-10",
    activeConsent: true,
  },
];

const INITIAL_RECORDS: HealthRecord[] = [
  {
    id: "REC-9021-1",
    patientId: "LK-PAT-9021",
    patientName: "Rahul Verma",
    type: "Diagnosis",
    title: "Acute Bronchitis & Allergic Rhinitis",
    issuedBy: "Dr. S. Kulkarni (MD Pulmonology)",
    source: "Apollo Clinic Pune",
    date: "2026-09-15",
    status: "Verified",
    details: "Mild bilateral wheezing, normal SPO2 98%. Recommended steam inhalation, bronchodilators, and allergic trigger avoidance.",
    hash: "0x8f2d59c6b8401aaef98d4076bc112ea4a938b81098b67b1f5c6ad90c9b0e271a",
    isApprovedByPatient: true,
  },
  {
    id: "REC-9021-2",
    patientId: "LK-PAT-9021",
    patientName: "Rahul Verma",
    type: "Lab Report",
    title: "Comprehensive Blood Panel (CBC + Lipid Profile)",
    issuedBy: "Metropolis Healthcare Labs",
    source: "Metropolis Digital Diagnostic Center",
    date: "2026-09-12",
    status: "Verified",
    details: "WBC count: 7,400/mcL (Normal), Hb: 14.8 g/dL, Total Cholesterol: 182 mg/dL, HDL: 48 mg/dL, Triglycerides: 140 mg/dL.",
    hash: "0x3e4a908bd121cfa5b77823908ff901235daec998310ba02568e0f19c8172ea20",
    isApprovedByPatient: true,
  },
  {
    id: "REC-9021-3",
    patientId: "LK-PAT-9021",
    patientName: "Rahul Verma",
    type: "Prescription",
    title: "Amoxicillin 500mg + Levocetirizine 5mg (5-Day Course)",
    issuedBy: "Dr. S. Kulkarni",
    source: "Apollo Pharmacy Network",
    date: "2026-09-15",
    status: "Needs Review",
    details: "Rx: Tab Amoxicillin 500mg TDS x 5 days (post meals). Tab Levocetirizine 5mg OD at bedtime x 7 days. Monitor for allergic response.",
    hash: "0x51c9842aef91209bca3387091bd5561a084c7182991cae74151b72a10c9e01f2",
    isApprovedByPatient: true,
  },
  {
    id: "REC-4412-1",
    patientId: "LK-PAT-4412",
    patientName: "Ananya Iyer",
    type: "Diagnosis",
    title: "Stage 1 Hypertension & Vitamin D3 Deficiency",
    issuedBy: "Dr. R. Mehta (Cardiology)",
    source: "Max Super Speciality Hospital",
    date: "2026-08-28",
    status: "Verified",
    details: "Resting BP: 138/88 mmHg. Serum 25-OH Vitamin D: 14.2 ng/mL (Deficient). Lifestyle modification, salt restriction advised.",
    hash: "0x91834cbfa1029384752981023948572019485710293847562019485720193847",
    isApprovedByPatient: true,
  },
  {
    id: "REC-4412-2",
    patientId: "LK-PAT-4412",
    patientName: "Ananya Iyer",
    type: "Prescription",
    title: "Telmisartan 20mg OD + Cholecalciferol 60K UI Sachet",
    issuedBy: "Dr. R. Mehta",
    source: "Max Healthcare Central E-Prescription",
    date: "2026-08-28",
    status: "Verified",
    details: "Rx: Tab Telmisartan 20mg OD in morning. Sachet Calcirol 60K UI once weekly with warm milk x 8 weeks.",
    hash: "0x1293847561029384756201948572019485720194857201948572019485720194",
    isApprovedByPatient: true,
  },
  {
    id: "REC-1082-1",
    patientId: "LK-PAT-1082",
    patientName: "Parth Patil",
    type: "Lab Report",
    title: "HbA1c & Fasting Plasma Glucose Analysis",
    issuedBy: "Suburban Diagnostics",
    source: "Suburban Labs South Hub",
    date: "2026-09-29",
    status: "Needs Review",
    details: "Fasting Blood Glucose: 94 mg/dL (Normal). HbA1c: 5.4% (Normal glycemic control). Non-fasting lipid profile pending.",
    hash: "0xa817293847102938471928374019283740192837401928374019283740192837",
    isApprovedByPatient: true,
  },
  {
    id: "REC-1082-2",
    patientId: "LK-PAT-1082",
    patientName: "Parth Patil",
    type: "Medical History",
    title: "Annual University Sports Physical Clearance",
    issuedBy: "ABC Poly Student Health Center",
    source: "ABC Polytechnic Health Records",
    date: "2026-07-10",
    status: "Verified",
    details: "Fit for competitive athletics. No history of concussions, cardiac anomalies, or syncopal episodes. Tetanus toxoid booster administered.",
    hash: "0x7719283740192837401928374019283740192837401928374019283740192837",
    isApprovedByPatient: true,
  },
];

const INITIAL_REQUESTS: RecordRequest[] = [
  {
    id: "REQ-2026-01",
    patientId: "LK-PAT-9021",
    patientName: "Rahul Verma",
    requestedRecords: ["Lab Report", "Diagnosis"],
    purpose: "Treatment & Pre-procedure Evaluation",
    duration: "24 hours",
    status: "Approved",
    date: "2026-10-02",
  },
  {
    id: "REQ-2026-02",
    patientId: "LK-PAT-4412",
    patientName: "Ananya Iyer",
    requestedRecords: ["Prescription", "Medical History"],
    purpose: "Cardiology Second Opinion Consultation",
    duration: "48 hours",
    status: "Pending",
    date: "2026-10-03",
  },
  {
    id: "REQ-2026-03",
    patientId: "LK-PAT-1082",
    patientName: "Parth Patil",
    requestedRecords: ["Lab Report"],
    purpose: "Endocrine & Metabolic Health Monitoring",
    duration: "24 hours",
    status: "Pending",
    date: "2026-10-03",
  },
  {
    id: "REQ-2026-04",
    patientId: "LK-PAT-5531",
    patientName: "Maya Sharma",
    requestedRecords: ["Diagnosis", "Medical History"],
    purpose: "Emergency OPD Triage Consultation",
    duration: "12 hours",
    status: "Expired",
    date: "2026-09-25",
  },
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: "ACT-1",
    timestamp: "10 mins ago",
    text: "Verified Lab Report: Comprehensive Blood Panel for Rahul Verma",
    type: "verify",
    badge: "Verified",
  },
  {
    id: "ACT-2",
    timestamp: "35 mins ago",
    text: "Viewed Diagnosis: Acute Bronchitis for Rahul Verma",
    type: "view",
    badge: "Viewed",
  },
  {
    id: "ACT-3",
    timestamp: "2 hours ago",
    text: "Patient approved access: Rahul Verma granted 24-hr credential viewing",
    type: "approval",
    badge: "Approved",
  },
  {
    id: "ACT-4",
    timestamp: "3 hours ago",
    text: "Requested Prescription & Medical History from Ananya Iyer",
    type: "request",
    badge: "Requested",
  },
  {
    id: "ACT-5",
    timestamp: "Yesterday",
    text: "Imported Diagnostic Record: Annual University Sports Physical for Parth Patil",
    type: "import",
    badge: "Imported",
  },
];

export default function DoctorDashboard() {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "patients" | "requests" | "records" | "activity">("dashboard");

  // State Management
  const [patients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [records, setRecords] = useState<HealthRecord[]>(INITIAL_RECORDS);
  const [requests, setRequests] = useState<RecordRequest[]>(INITIAL_REQUESTS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  // Selected Patient for Profile View
  const [selectedPatientId, setSelectedPatientId] = useState<string>("LK-PAT-9021");
  const [searchQuery, setSearchQuery] = useState("");
  const [recordFilter, setRecordFilter] = useState<string>("All");

  // Modals
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [viewRecordModalOpen, setViewRecordModalOpen] = useState(false);
  const [activeRecord, setActiveRecord] = useState<HealthRecord | null>(null);

  // Verification Animation State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccessMessage, setVerifySuccessMessage] = useState<string | null>(null);

  // Request Form State
  const [reqPatientId, setReqPatientId] = useState<string>("LK-PAT-9021");
  const [reqRecords, setReqRecords] = useState<RecordType[]>(["Diagnosis", "Lab Report"]);
  const [reqPurpose, setReqPurpose] = useState("Treatment");
  const [reqDuration, setReqDuration] = useState("24 hours");
  const [requestSentNotification, setRequestSentNotification] = useState<string | null>(null);

  // Import Form State
  const [importPatientId, setImportPatientId] = useState<string>("LK-PAT-9021");
  const [importType, setImportType] = useState<RecordType>("Diagnosis");
  const [importTitle, setImportTitle] = useState("");
  const [importIssuedBy, setImportIssuedBy] = useState("Apollo Multi-Speciality Clinic");
  const [importSource, setImportSource] = useState("Apollo Health EMR");
  const [importDetails, setImportDetails] = useState("");
  const [importFile, setImportFile] = useState<string>("clinical_record_scan.pdf");
  const [importSuccessNotification, setImportSuccessNotification] = useState<string | null>(null);

  // Copied Hash State
  const [copiedHash, setCopiedHash] = useState(false);

  // Active Patient Object
  const currentPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Filtered records for current patient
  const patientRecords = records.filter((r) => r.patientId === currentPatient.id);

  // Filtered records for Records tab
  const allFilteredRecords = records.filter((r) => {
    const matchesFilter = recordFilter === "All" || r.type === recordFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.issuedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ─── Helpers & Actions ──────────────────────────────────

  const addActivity = (text: string, type: ActivityItem["type"], badge: string) => {
    const newAct: ActivityItem = {
      id: `ACT-${Date.now()}`,
      timestamp: "Just now",
      text,
      type,
      badge,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Section 2: Import Patient Record Flow
  const handleConfirmImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importTitle.trim()) return;

    const patient = patients.find((p) => p.id === importPatientId) || currentPatient;
    const fakeHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const newRecord: HealthRecord = {
      id: `REC-IMP-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      type: importType,
      title: importTitle,
      issuedBy: importIssuedBy || "Clinical Facility",
      source: importSource || "Authorized Provider",
      date: new Date().toISOString().split("T")[0],
      status: "Imported",
      details: importDetails || "Clinical documentation uploaded and cryptographically indexed into patient ledger.",
      hash: fakeHash,
      isApprovedByPatient: true,
    };

    setRecords((prev) => [newRecord, ...prev]);
    addActivity(`Imported ${importType}: ${importTitle} for ${patient.name}`, "import", "Imported");

    setImportModalOpen(false);
    setImportTitle("");
    setImportDetails("");
    setImportSuccessNotification(`Successfully imported record for ${patient.name} with status: Imported.`);
    setTimeout(() => setImportSuccessNotification(null), 5000);
  };

  // Section 3: Request Records from Patient Flow
  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (reqRecords.length === 0) return;

    const patient = patients.find((p) => p.id === reqPatientId) || currentPatient;
    const newReq: RecordRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      patientId: patient.id,
      patientName: patient.name,
      requestedRecords: [...reqRecords],
      purpose: reqPurpose,
      duration: reqDuration,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    setRequests((prev) => [newReq, ...prev]);
    addActivity(`Requested ${reqRecords.join(", ")} from ${patient.name}`, "request", "Pending");

    setRequestModalOpen(false);
    setRequestSentNotification(`Request sent to patient. Status: Pending.`);
    setTimeout(() => setRequestSentNotification(null), 5000);
  };

  // Section 4: Simulate Patient Approval / Decision
  const handleSimulatePatientAction = (reqId: string, action: "Approved" | "Rejected" | "Expired") => {
    setRequests((prev) =>
      prev.map((req) => (req.id === reqId ? { ...req, status: action } : req))
    );

    const targetReq = requests.find((r) => r.id === reqId);
    if (targetReq) {
      if (action === "Approved") {
        addActivity(`Patient approved access: ${targetReq.patientName} granted ${targetReq.duration} credential access`, "approval", "Approved");
      } else if (action === "Rejected") {
        addActivity(`Patient rejected access: ${targetReq.patientName} denied record request`, "reject", "Rejected");
      } else {
        addActivity(`Access expired for ${targetReq.patientName}`, "request", "Expired");
      }
    }
  };

  // Section 5 & 6: View & Verify Record Flow
  const handleOpenViewRecord = (record: HealthRecord) => {
    setActiveRecord(record);
    setViewRecordModalOpen(true);
    setVerifySuccessMessage(null);
    addActivity(`Viewed ${record.type}: ${record.title} for ${record.patientName}`, "view", "Viewed");
  };

  const handleVerifyRecord = () => {
    if (!activeRecord) return;
    setIsVerifying(true);
    setVerifySuccessMessage(null);

    setTimeout(() => {
      setIsVerifying(false);
      // Update record to verified in records state
      setRecords((prev) =>
        prev.map((r) => (r.id === activeRecord.id ? { ...r, status: "Verified" } : r))
      );
      setActiveRecord((prev) => (prev ? { ...prev, status: "Verified" } : null));
      setVerifySuccessMessage("Zero-Knowledge integrity verified. Cryptographic signature and SHA-256 payload are authentic.");
      addActivity(`Verified ${activeRecord.type}: ${activeRecord.title} for ${activeRecord.patientName}`, "verify", "Verified");
    }, 900);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* ── Top Header ────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#DCD9FF]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded badge-indigo font-bold tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" /> CLINICAL PRACTITIONER NODE
              </span>
              <span className="text-[11px] text-[#69708A] font-mono font-medium">
                Dr. Arvind Mehta, MD · Apollo Multi-Speciality
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#10142F] tracking-tight">
              Doctor <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B5BEF] to-[#7A5AF8]">Clinical</span> Panel
            </h1>
            <p className="text-sm text-[#69708A] mt-1">
              Consent-governed medical records · Zero-knowledge verification · Cryptographic patient history
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setImportPatientId(currentPatient.id);
                setImportModalOpen(true);
              }}
              className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-[#10142F] shadow-sm hover:border-[#5B5BEF]"
            >
              <Upload className="w-3.5 h-3.5 text-[#5B5BEF]" /> Import Record
            </button>
            <button
              onClick={() => {
                setReqPatientId(currentPatient.id);
                setRequestModalOpen(true);
              }}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#5B5BEF]/20"
            >
              <Send className="w-3.5 h-3.5" /> Request Records
            </button>
          </div>
        </div>

        {/* ── Notifications ────────────────────────────────────── */}
        {requestSentNotification && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center gap-2 shadow-sm animate-fade-down">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="font-semibold">{requestSentNotification}</div>
          </div>
        )}

        {importSuccessNotification && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2 shadow-sm animate-fade-down">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="font-semibold">{importSuccessNotification}</div>
          </div>
        )}

        {/* ── Main Navigation Tabs ──────────────────────────────── */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#DCD9FF]/60">
          {[
            { id: "dashboard", label: "Dashboard", icon: Activity },
            { id: "patients", label: "Patients", icon: Users },
            { id: "requests", label: "Requests", icon: Send },
            { id: "records", label: "Records", icon: FileText },
            { id: "activity", label: "Activity", icon: Clock },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === id
                  ? "bg-[#5B5BEF] text-white shadow-md shadow-[#5B5BEF]/25"
                  : "bg-white text-[#69708A] hover:text-[#10142F] border border-[#DCD9FF] hover:bg-[#F0EEFF]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              {id === "requests" && requests.filter((r) => r.status === "Pending").length > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === id ? "bg-white text-[#5B5BEF]" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {requests.filter((r) => r.status === "Pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════
            TAB 1: DOCTOR DASHBOARD
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "dashboard" && (
          <div className="mt-6 space-y-6">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Patients */}
              <div
                onClick={() => setActiveTab("patients")}
                className="glass-card p-5 cursor-pointer hover:border-[#5B5BEF] transition-all bg-white relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F0EEFF] text-[#5B5BEF] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded badge-indigo font-bold">
                    Active Rosters
                  </span>
                </div>
                <div className="text-2xl font-black text-[#10142F]">{patients.length} Patients</div>
                <p className="text-xs text-[#69708A] mt-1 flex items-center gap-1">
                  <span>Sovereign identity verified</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#5B5BEF]" />
                </p>
              </div>

              {/* Card 2: Record Requests */}
              <div
                onClick={() => setActiveTab("requests")}
                className="glass-card p-5 cursor-pointer hover:border-[#5B5BEF] transition-all bg-white relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    {requests.filter((r) => r.status === "Pending").length} Pending
                  </span>
                </div>
                <div className="text-2xl font-black text-[#10142F]">{requests.length} Requests</div>
                <p className="text-xs text-[#69708A] mt-1 flex items-center gap-1">
                  <span>Consent-bound access tokens</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#5B5BEF]" />
                </p>
              </div>

              {/* Card 3: Shared Records */}
              <div
                onClick={() => setActiveTab("records")}
                className="glass-card p-5 cursor-pointer hover:border-[#5B5BEF] transition-all bg-white relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {records.filter((r) => r.status === "Verified").length} Verified
                  </span>
                </div>
                <div className="text-2xl font-black text-[#10142F]">{records.length} Records</div>
                <p className="text-xs text-[#69708A] mt-1 flex items-center gap-1">
                  <span>Cryptographically signed</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#5B5BEF]" />
                </p>
              </div>

              {/* Card 4: Recent Activity */}
              <div
                onClick={() => setActiveTab("activity")}
                className="glass-card p-5 cursor-pointer hover:border-[#5B5BEF] transition-all bg-white relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F0EEFF] text-[#5B5BEF] flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded badge-indigo font-bold">
                    Audit Log
                  </span>
                </div>
                <div className="text-2xl font-black text-[#10142F]">{activities.length} Events</div>
                <p className="text-xs text-[#69708A] mt-1 flex items-center gap-1">
                  <span>Tamper-evident trail</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#5B5BEF]" />
                </p>
              </div>
            </div>

            {/* Two-Column Clinical Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Quick Patient Roster & Active Records */}
              <div className="lg:col-span-2 space-y-6">
                {/* Active Patient Snapshot */}
                <div className="glass-card p-6 bg-white border border-[#DCD9FF]">
                  <div className="flex items-center justify-between pb-4 border-b border-[#F0EEFF]">
                    <div>
                      <span className="text-[11px] font-mono uppercase font-bold text-[#5B5BEF] tracking-wider">
                        CURRENT CLINICAL PATIENT
                      </span>
                      <h3 className="text-xl font-black text-[#10142F] flex items-center gap-2 mt-0.5">
                        {currentPatient.name}
                        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5B5BEF]">
                          {currentPatient.id}
                        </span>
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReqPatientId(currentPatient.id);
                          setRequestModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F0EEFF] text-[#5B5BEF] hover:bg-[#E8E6FF] transition-all flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" /> Request Records
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPatientId(currentPatient.id);
                          setActiveTab("patients");
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold btn-primary text-white flex items-center gap-1"
                      >
                        Full Profile <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Patient Quick Vitals / Bio Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[#F0EEFF] text-xs">
                    <div>
                      <span className="text-[#69708A] block">Age & Gender</span>
                      <span className="font-bold text-[#10142F]">{currentPatient.age} yrs · {currentPatient.gender}</span>
                    </div>
                    <div>
                      <span className="text-[#69708A] block">Blood Group</span>
                      <span className="font-bold text-[#10142F] text-rose-600">{currentPatient.bloodGroup}</span>
                    </div>
                    <div>
                      <span className="text-[#69708A] block">Location</span>
                      <span className="font-bold text-[#10142F]">{currentPatient.city}</span>
                    </div>
                    <div>
                      <span className="text-[#69708A] block">Consent Status</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    </div>
                  </div>

                  {/* Clinical Records for this Patient */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono">
                        Available Clinical Records ({patientRecords.length})
                      </span>
                      <button
                        onClick={() => {
                          setImportPatientId(currentPatient.id);
                          setImportModalOpen(true);
                        }}
                        className="text-xs font-bold text-[#5B5BEF] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Import New
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {patientRecords.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-3.5 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#5B5BEF] transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white border border-[#DCD9FF] flex items-center justify-center text-[#5B5BEF] shrink-0 mt-0.5">
                              {rec.type === "Diagnosis" && <HeartPulse className="w-4 h-4 text-rose-500" />}
                              {rec.type === "Lab Report" && <Activity className="w-4 h-4 text-[#5B5BEF]" />}
                              {rec.type === "Prescription" && <FileText className="w-4 h-4 text-amber-500" />}
                              {rec.type === "Medical History" && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#10142F]">{rec.title}</span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    rec.status === "Verified"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : rec.status === "Needs Review"
                                      ? "bg-amber-100 text-amber-800"
                                      : rec.status === "Imported"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  {rec.status === "Verified" && "✓ "}
                                  {rec.status === "Needs Review" && "⚠ "}
                                  {rec.status}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#69708A] mt-0.5">
                                {rec.issuedBy} · {rec.date}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleOpenViewRecord(rec)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-[#F0EEFF] text-[#10142F] border border-[#DCD9FF] hover:border-[#5B5BEF] transition-all flex items-center gap-1 shrink-0 self-end sm:self-center"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#5B5BEF]" /> View Record
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Patient Selector Strip */}
                <div className="glass-card p-5 bg-white border border-[#DCD9FF]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono">
                      Switch Patient
                    </span>
                    <button
                      onClick={() => setActiveTab("patients")}
                      className="text-xs font-bold text-[#5B5BEF] hover:underline"
                    >
                      View All Patients →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {patients.map((pat) => (
                      <button
                        key={pat.id}
                        onClick={() => setSelectedPatientId(pat.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          selectedPatientId === pat.id
                            ? "bg-[#F0EEFF] border-[#5B5BEF] shadow-sm"
                            : "bg-white border-[#DCD9FF] hover:bg-[#F7F6FF]"
                        }`}
                      >
                        <div className="text-xs font-bold text-[#10142F] truncate">{pat.name}</div>
                        <div className="text-[10px] text-[#69708A] font-mono">{pat.id}</div>
                        <div className="text-[10px] text-rose-600 font-semibold mt-1">{pat.bloodGroup} · {pat.age}y</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Pending Requests & Live Activity Log */}
              <div className="space-y-6">
                {/* Pending Requests Box */}
                <div className="glass-card p-5 bg-white border border-[#DCD9FF]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-amber-500" /> Active Requests
                    </span>
                    <button
                      onClick={() => setActiveTab("requests")}
                      className="text-xs font-bold text-[#5B5BEF] hover:underline"
                    >
                      Manage →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {requests.slice(0, 3).map((req) => (
                      <div
                        key={req.id}
                        className="p-3 rounded-xl bg-[#FAFAFE] border border-[#E8E6FF] text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#10142F]">{req.patientName}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              req.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : req.status === "Pending"
                                ? "bg-amber-100 text-amber-800"
                                : req.status === "Rejected"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#69708A] mb-1.5">
                          {req.requestedRecords.join(", ")} · {req.duration}
                        </div>

                        {req.status === "Pending" && (
                          <div className="flex items-center gap-1.5 pt-2 border-t border-[#F0EEFF]">
                            <span className="text-[10px] text-[#69708A]">Simulate:</span>
                            <button
                              onClick={() => handleSimulatePatientAction(req.id, "Approved")}
                              className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 rounded transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleSimulatePatientAction(req.id, "Rejected")}
                              className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 hover:bg-rose-200 rounded transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Snapshot */}
                <div className="glass-card p-5 bg-white border border-[#DCD9FF]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#5B5BEF]" /> Recent Activity
                    </span>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className="text-xs font-bold text-[#5B5BEF] hover:underline"
                    >
                      Full Log →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activities.slice(0, 4).map((act) => (
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
            TAB 2: PATIENTS (Section 5: View Patient Records)
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "patients" && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Patient Directory */}
            <div className="glass-card p-5 bg-white border border-[#DCD9FF] h-fit">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-base text-[#10142F]">Patients Directory</h3>
                <span className="text-xs text-[#69708A] font-mono">{patients.length} enrolled</span>
              </div>

              {/* Patient Search */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#69708A]" />
                <input
                  type="text"
                  placeholder="Search patient name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                />
              </div>

              <div className="space-y-2">
                {patients
                  .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((pat) => (
                    <div
                      key={pat.id}
                      onClick={() => setSelectedPatientId(pat.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedPatientId === pat.id
                          ? "bg-[#F0EEFF] border-[#5B5BEF] shadow-sm"
                          : "bg-white border-[#DCD9FF] hover:bg-[#F7F6FF]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#10142F]">{pat.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#DCD9FF] text-[#5B5BEF] font-bold">
                          {pat.bloodGroup}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#69708A] mt-1 flex items-center justify-between">
                        <span>{pat.id} · {pat.age}y</span>
                        <span>{pat.city}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Right: Selected Patient Profile & Records (Section 5) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Information Card */}
              <div className="glass-card p-6 bg-white border border-[#DCD9FF]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EEFF]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5B5BEF] to-[#7167F6] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                      {currentPatient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-[#10142F]">{currentPatient.name}</h2>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F0EEFF] text-[#5B5BEF] font-bold">
                          {currentPatient.id}
                        </span>
                      </div>
                      <p className="text-xs text-[#69708A] mt-0.5">
                        Verified Sovereign Health Record ID · Last Consultation: {currentPatient.lastVisit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setImportPatientId(currentPatient.id);
                        setImportModalOpen(true);
                      }}
                      className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#5B5BEF]" /> Import Record
                    </button>
                    <button
                      onClick={() => {
                        setReqPatientId(currentPatient.id);
                        setRequestModalOpen(true);
                      }}
                      className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" /> Request Records
                    </button>
                  </div>
                </div>

                {/* Patient Information Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#F0EEFF] text-xs">
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">Age / Gender</span>
                    <span className="font-bold text-[#10142F] text-sm">{currentPatient.age} yrs · {currentPatient.gender}</span>
                  </div>
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">Blood Group</span>
                    <span className="font-extrabold text-sm text-rose-600">{currentPatient.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">Contact Phone</span>
                    <span className="font-bold text-[#10142F] text-xs flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-[#69708A]" /> {currentPatient.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">Digital Email</span>
                    <span className="font-bold text-[#10142F] text-xs truncate block mt-0.5">
                      {currentPatient.email}
                    </span>
                  </div>
                </div>

                {/* Health Records Section (Section 5) */}
                <div className="mt-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#10142F]">Health Records</h4>
                      <p className="text-[11px] text-[#69708A]">
                        Verified clinical certificates, diagnoses, lab panels, and active prescriptions
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#5B5BEF]">
                      {patientRecords.length} records on file
                    </span>
                  </div>

                  {patientRecords.length === 0 ? (
                    <div className="p-8 text-center bg-[#FAFAFE] rounded-2xl border border-dashed border-[#DCD9FF]">
                      <FileText className="w-8 h-8 text-[#69708A] mx-auto mb-2 opacity-50" />
                      <div className="font-bold text-xs text-[#10142F]">No Health Records Available</div>
                      <p className="text-[11px] text-[#69708A] mt-1 max-w-sm mx-auto">
                        Send a record request to this patient or import an external clinical record.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {patientRecords.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-4 rounded-2xl bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] transition-all shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#F0EEFF] text-[#5B5BEF] flex items-center justify-center shrink-0 mt-0.5">
                                {rec.type === "Diagnosis" && <HeartPulse className="w-5 h-5 text-rose-500" />}
                                {rec.type === "Lab Report" && <Activity className="w-5 h-5 text-[#5B5BEF]" />}
                                {rec.type === "Prescription" && <FileText className="w-5 h-5 text-amber-500" />}
                                {rec.type === "Medical History" && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-sm text-[#10142F]">{rec.title}</span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      rec.status === "Verified"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : rec.status === "Needs Review"
                                        ? "bg-amber-100 text-amber-800"
                                        : rec.status === "Imported"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-rose-100 text-rose-800"
                                    }`}
                                  >
                                    {rec.status === "Verified" && "✓ "}
                                    {rec.status === "Needs Review" && "⚠ "}
                                    {rec.status}
                                  </span>
                                  <span className="text-[10px] font-mono text-[#69708A] bg-[#F7F8FC] px-1.5 py-0.5 rounded">
                                    {rec.type}
                                  </span>
                                </div>
                                <p className="text-xs text-[#69708A] mt-1 line-clamp-1">{rec.details}</p>
                                <div className="flex items-center gap-3 text-[11px] text-[#69708A] mt-2 font-mono">
                                  <span>Issued by: {rec.issuedBy}</span>
                                  <span>·</span>
                                  <span>Date: {rec.date}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleOpenViewRecord(rec)}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold btn-primary text-white flex items-center gap-1.5 shrink-0 self-end sm:self-center shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Record
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            TAB 3: REQUESTS (Section 3 & 4: Patient Approval)
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "requests" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCD9FF]">
              <div>
                <h3 className="text-xl font-black text-[#10142F]">Record Access Requests</h3>
                <p className="text-xs text-[#69708A] mt-0.5">
                  Track purpose-bound, time-delimited credential requests sent to sovereign patient nodes
                </p>
              </div>
              <button
                onClick={() => setRequestModalOpen(true)}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" /> New Record Request
              </button>
            </div>

            {/* Requests List */}
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="glass-card p-5 bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-base text-[#10142F]">{req.patientName}</span>
                        <span className="text-xs font-mono text-[#69708A] bg-[#F0EEFF] px-2 py-0.5 rounded font-bold">
                          {req.patientId}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            req.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : req.status === "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : req.status === "Rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              req.status === "Approved"
                                ? "bg-emerald-500"
                                : req.status === "Pending"
                                ? "bg-amber-500"
                                : req.status === "Rejected"
                                ? "bg-rose-500"
                                : "bg-gray-400"
                            }`}
                          />
                          {req.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-[#69708A]">Requested Records:</span>
                        {req.requestedRecords.map((rType) => (
                          <span
                            key={rType}
                            className="text-xs font-mono font-bold bg-[#F7F6FF] text-[#5B5BEF] px-2 py-0.5 rounded-md border border-[#DCD9FF]"
                          >
                            {rType}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#69708A]">
                        <span>
                          <strong>Purpose:</strong> {req.purpose}
                        </span>
                        <span>·</span>
                        <span>
                          <strong>Duration:</strong> {req.duration}
                        </span>
                        <span>·</span>
                        <span>
                          <strong>Date:</strong> {req.date}
                        </span>
                      </div>
                    </div>

                    {/* Patient Approval Simulator Action Buttons (Section 4) */}
                    <div className="p-3 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF] shrink-0">
                      <div className="text-[10px] font-bold text-[#69708A] uppercase font-mono mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#5B5BEF]" />
                        <span>Simulate Patient Action</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSimulatePatientAction(req.id, "Approved")}
                          disabled={req.status === "Approved"}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                            req.status === "Approved"
                              ? "bg-emerald-600 text-white"
                              : "bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          🟢 Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSimulatePatientAction(req.id, "Rejected")}
                          disabled={req.status === "Rejected"}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                            req.status === "Rejected"
                              ? "bg-rose-600 text-white"
                              : "bg-white text-rose-700 border border-rose-300 hover:bg-rose-50"
                          }`}
                        >
                          🔴 Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSimulatePatientAction(req.id, "Expired")}
                          disabled={req.status === "Expired"}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                            req.status === "Expired"
                              ? "bg-gray-600 text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          ⚪ Expire
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            TAB 4: RECORDS (Section 5 & 6: View & Verify)
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "records" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCD9FF]">
              <div>
                <h3 className="text-xl font-black text-[#10142F]">Shared & Imported Health Records</h3>
                <p className="text-xs text-[#69708A] mt-0.5">
                  Browse and verify patient clinical credentials authorized for your clinical session
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {["All", "Diagnosis", "Lab Report", "Prescription", "Medical History"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setRecordFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      recordFilter === f
                        ? "bg-[#10142F] text-white"
                        : "bg-white text-[#69708A] border border-[#DCD9FF] hover:bg-[#F0EEFF]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Records Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allFilteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="glass-card p-5 bg-white border border-[#DCD9FF] hover:border-[#5B5BEF] transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold uppercase text-[#5B5BEF] bg-[#F0EEFF] px-2 py-0.5 rounded">
                        {rec.type}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.status === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : rec.status === "Needs Review"
                            ? "bg-amber-100 text-amber-800"
                            : rec.status === "Imported"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {rec.status === "Verified" && "✓ "}
                        {rec.status === "Needs Review" && "⚠ "}
                        {rec.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-[#10142F]">{rec.title}</h4>
                    <p className="text-xs text-[#69708A] mt-1 font-medium line-clamp-2">{rec.details}</p>

                    <div className="mt-3 pt-3 border-t border-[#F0EEFF] text-[11px] text-[#69708A] space-y-1">
                      <div className="flex justify-between">
                        <span>Patient:</span>
                        <span className="font-bold text-[#10142F]">{rec.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Issued By:</span>
                        <span className="font-medium text-[#10142F]">{rec.issuedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-mono">{rec.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F0EEFF] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#69708A] truncate max-w-[160px]">
                      {rec.hash.slice(0, 16)}...
                    </span>
                    <button
                      onClick={() => handleOpenViewRecord(rec)}
                      className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Record
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            TAB 5: ACTIVITY (Section 7: Request/Record History)
           ═══════════════════════════════════════════════════════ */}
        {activeTab === "activity" && (
          <div className="mt-6 space-y-6">
            <div className="pb-4 border-b border-[#DCD9FF]">
              <h3 className="text-xl font-black text-[#10142F]">Clinical Audit & Activity Trail</h3>
              <p className="text-xs text-[#69708A] mt-0.5">
                Cryptographically tracked record requests, patient access grants, views, and integrity verifications
              </p>
            </div>

            <div className="glass-card p-6 bg-white border border-[#DCD9FF]">
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#DCD9FF]">
                {activities.map((act) => (
                  <div key={act.id} className="relative flex items-start gap-4">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                        act.type === "verify"
                          ? "bg-emerald-500 text-white"
                          : act.type === "approval"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-400"
                          : act.type === "import"
                          ? "bg-purple-100 text-purple-700 border border-purple-400"
                          : act.type === "reject"
                          ? "bg-rose-100 text-rose-700 border border-rose-400"
                          : "bg-[#F0EEFF] text-[#5B5BEF] border border-[#5B5BEF]"
                      }`}
                    >
                      {act.type === "verify" && <Check className="w-3.5 h-3.5" />}
                      {act.type === "approval" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {act.type === "view" && <Eye className="w-3.5 h-3.5" />}
                      {act.type === "request" && <Send className="w-3.5 h-3.5" />}
                      {act.type === "import" && <Upload className="w-3.5 h-3.5" />}
                      {act.type === "reject" && <X className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 bg-[#F7F6FF] p-3.5 rounded-2xl border border-[#DCD9FF]/80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#10142F]">{act.text}</span>
                        <span className="text-[10px] font-mono text-[#69708A]">{act.timestamp}</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white border border-[#DCD9FF] font-semibold text-[#5B5BEF]">
                        {act.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            MODAL 1: REQUEST RECORDS FROM PATIENT (Section 3)
           ═══════════════════════════════════════════════════════ */}
        {requestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10142F]/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card bg-white p-6 sm:p-7 max-w-lg w-full border-[#DCD9FF] shadow-2xl relative">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-[#69708A] hover:bg-[#F0EEFF] transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-[#5B5BEF] uppercase font-bold tracking-wider flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" /> CLINICAL ACCESS CONSENT
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#10142F]">Request Records From Patient</h2>
              <p className="text-xs text-[#69708A] mt-1 mb-5">
                Specify required health credentials and purpose. The patient must approve before records are unlocked.
              </p>

              <form onSubmit={handleSendRequest} className="space-y-4">
                {/* 1. Select Patient */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Patient
                  </label>
                  <select
                    value={reqPatientId}
                    onChange={(e) => setReqPatientId(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id}) — {p.bloodGroup}, {p.age} yrs
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Records Required (Checkboxes) */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-2 font-mono">
                    Records Required
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Diagnosis", "Lab Report", "Prescription", "Medical History"] as RecordType[]).map((rType) => {
                      const isChecked = reqRecords.includes(rType);
                      return (
                        <button
                          key={rType}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setReqRecords(reqRecords.filter((t) => t !== rType));
                            } else {
                              setReqRecords([...reqRecords, rType]);
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                            isChecked
                              ? "bg-[#F0EEFF] border-[#5B5BEF] text-[#5B5BEF]"
                              : "bg-white border-[#DCD9FF] text-[#69708A]"
                          }`}
                        >
                          <span>{rType}</span>
                          {isChecked && <Check className="w-4 h-4 text-[#5B5BEF]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Purpose */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Clinical Purpose
                  </label>
                  <input
                    type="text"
                    required
                    value={reqPurpose}
                    onChange={(e) => setReqPurpose(e.target.value)}
                    placeholder="e.g. Treatment, Pre-op Assessment, Specialist Consultation"
                    className="w-full text-xs font-semibold p-3 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                  />
                  <div className="flex gap-2 mt-1.5">
                    {["Treatment", "Diagnostic Workup", "Pre-op Evaluation"].map((preset) => (
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

                {/* 4. Access Duration */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Access Duration
                  </label>
                  <select
                    value={reqDuration}
                    onChange={(e) => setReqDuration(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                  >
                    <option value="12 hours">12 hours (Emergency Triage)</option>
                    <option value="24 hours">24 hours (Standard Clinical Visit)</option>
                    <option value="48 hours">48 hours (Inpatient Stay)</option>
                    <option value="7 days">7 days (Extended Observation)</option>
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
                    disabled={reqRecords.length === 0}
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
            MODAL 2: IMPORT PATIENT RECORD (Section 2)
           ═══════════════════════════════════════════════════════ */}
        {importModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10142F]/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card bg-white p-6 sm:p-7 max-w-lg w-full border-[#DCD9FF] shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setImportModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-[#69708A] hover:bg-[#F0EEFF] transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-[#5B5BEF] uppercase font-bold tracking-wider flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" /> CLINICAL DATA INGESTION
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#10142F]">Import Patient Record</h2>
              <p className="text-xs text-[#69708A] mt-1 mb-5">
                Ingest an external medical document, lab certificate, or prescription into the patient&apos;s verified timeline.
              </p>

              <form onSubmit={handleConfirmImport} className="space-y-4">
                {/* 1. Select Patient */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Select Patient
                  </label>
                  <select
                    value={importPatientId}
                    onChange={(e) => setImportPatientId(e.target.value)}
                    className="w-full text-xs font-bold p-3 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Select Record Type */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Record Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Diagnosis", "Prescription", "Lab Report", "Medical History"] as RecordType[]).map((rType) => (
                      <button
                        key={rType}
                        type="button"
                        onClick={() => setImportType(rType)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          importType === rType
                            ? "bg-[#F0EEFF] border-[#5B5BEF] text-[#5B5BEF]"
                            : "bg-white border-[#DCD9FF] text-[#69708A]"
                        }`}
                      >
                        {rType}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Title & Details */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Record Title
                  </label>
                  <input
                    type="text"
                    required
                    value={importTitle}
                    onChange={(e) => setImportTitle(e.target.value)}
                    placeholder="e.g. Chest X-Ray PA View / Thyroid Panel"
                    className="w-full text-xs font-semibold p-3 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                      Issued By
                    </label>
                    <input
                      type="text"
                      value={importIssuedBy}
                      onChange={(e) => setImportIssuedBy(e.target.value)}
                      placeholder="e.g. Dr. A. Mehta"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                      Source / Facility
                    </label>
                    <input
                      type="text"
                      value={importSource}
                      onChange={(e) => setImportSource(e.target.value)}
                      placeholder="e.g. Apollo Diagnostics"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Clinical Notes / Summary
                  </label>
                  <textarea
                    rows={2}
                    value={importDetails}
                    onChange={(e) => setImportDetails(e.target.value)}
                    placeholder="Enter diagnostic impressions, findings, or treatment instructions..."
                    className="w-full text-xs font-medium p-3 rounded-xl bg-[#F7F8FC] border border-[#DCD9FF] focus:outline-none focus:border-[#5B5BEF]"
                  />
                </div>

                {/* 4. Upload / Select File Simulation */}
                <div>
                  <label className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Attach Diagnostic Document
                  </label>
                  <div className="p-4 rounded-xl border border-dashed border-[#DCD9FF] bg-[#F7F6FF] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-[#5B5BEF]" />
                      <div>
                        <div className="text-xs font-bold text-[#10142F]">{importFile}</div>
                        <div className="text-[10px] text-[#69708A]">PDF / DICOM Diagnostic Package · 1.8 MB</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      Ready
                    </span>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="p-3.5 rounded-xl bg-[#FAFAFE] border border-[#E8E6FF] text-xs">
                  <span className="font-bold text-[11px] text-[#10142F] block mb-1">Status after import:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      Imported
                    </span>
                    <span className="text-[11px] text-[#69708A]">
                      Appears in patient&apos;s record list with &quot;Imported&quot; status.
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setImportModalOpen(false)}
                    className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold text-[#69708A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#5B5BEF]/20"
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm Import
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════
            MODAL 3: VIEW & VERIFY RECORD (Section 5 & 6)
           ═══════════════════════════════════════════════════════ */}
        {viewRecordModalOpen && activeRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#10142F]/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card bg-white p-6 sm:p-8 max-w-lg w-full border-[#DCD9FF] shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setViewRecordModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-[#69708A] hover:bg-[#F0EEFF] transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono text-[#5B5BEF] uppercase font-bold tracking-wider flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> VERIFIABLE HEALTH RECORD
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#10142F]">{activeRecord.title}</h2>
              <p className="text-xs text-[#69708A] mt-0.5 mb-5">
                Issued for {activeRecord.patientName} ({activeRecord.patientId})
              </p>

              {/* Record Detail Fields (Section 6) */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F7F6FF] border border-[#DCD9FF] text-xs">
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">Record Type</span>
                    <span className="font-bold text-[#10142F] text-xs">{activeRecord.type}</span>
                  </div>
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">Verification Status</span>
                    <span
                      className={`font-bold text-xs inline-flex items-center gap-1 ${
                        activeRecord.status === "Verified"
                          ? "text-emerald-700"
                          : activeRecord.status === "Needs Review"
                          ? "text-amber-700"
                          : activeRecord.status === "Imported"
                          ? "text-purple-700"
                          : "text-rose-700"
                      }`}
                    >
                      {activeRecord.status === "Verified" && "🟢 Verified"}
                      {activeRecord.status === "Needs Review" && "🟡 Needs Review"}
                      {activeRecord.status === "Imported" && "🟣 Imported"}
                      {activeRecord.status === "Invalid" && "🔴 Invalid"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">Issued By</span>
                    <span className="font-bold text-[#10142F]">{activeRecord.issuedBy}</span>
                  </div>
                  <div>
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">Date of Issue</span>
                    <span className="font-bold font-mono text-[#10142F]">{activeRecord.date}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-[#DCD9FF]/60">
                    <span className="text-[#69708A] block font-mono text-[10px] uppercase">Source Provider</span>
                    <span className="font-bold text-[#10142F]">{activeRecord.source}</span>
                  </div>
                </div>

                {/* Clinical Notes / Details */}
                <div>
                  <span className="block text-xs font-bold text-[#10142F] uppercase tracking-wider mb-1 font-mono">
                    Clinical Findings & Details
                  </span>
                  <div className="p-4 rounded-xl bg-[#FAFAFE] border border-[#DCD9FF] text-xs font-medium text-[#10142F] leading-relaxed">
                    {activeRecord.details}
                  </div>
                </div>

                {/* Cryptographic Hash */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#10142F] uppercase tracking-wider font-mono">
                      SHA-256 Cryptographic Hash
                    </span>
                    <button
                      type="button"
                      onClick={() => copyHash(activeRecord.hash)}
                      className="text-[10px] text-[#5B5BEF] font-mono hover:underline flex items-center gap-1"
                    >
                      {copiedHash ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHash ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-[#10142F] text-white font-mono text-[10px] break-all border border-[#171B40]">
                    {activeRecord.hash}
                  </div>
                </div>

                {/* Verification Result Banner (Section 6) */}
                {verifySuccessMessage && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 animate-fade-down space-y-1.5 shadow-sm">
                    <div className="font-extrabold flex items-center gap-1.5 text-emerald-800 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verification Result: Validated</span>
                    </div>
                    <p className="leading-relaxed">{verifySuccessMessage}</p>
                    <div className="text-[10px] font-mono text-emerald-700 pt-1">
                      Status updated to: <strong>🟢 Verified</strong>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setViewRecordModalOpen(false)}
                    className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold text-[#69708A]"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyRecord}
                    disabled={isVerifying}
                    className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-md shadow-[#5B5BEF]/20 disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Cryptographic Proof...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify Record</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
