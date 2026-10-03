// LIFEKEY Frontend API Client — v2.0

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ─── Types ────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "USER" | "INSTITUTION" | "EMPLOYER" | "ADMIN" | "DOCTOR" | "FINANCE";
  organization?: string | null;
  created_at: string;
}

export interface CredentialOut {
  id: string;
  holder_id: string;
  issuer_id: string;
  credential_type: string;
  credential_data: Record<string, any>;
  credential_hash: string;
  issued_at: string;
  expires_at?: string | null;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  issuer_name?: string | null;
  holder_name?: string | null;
  revocation_reason?: string | null;
  quality_status?: "no_issues" | "review_required" | null;
  quality_score?: number | null;
  quality_check?: CredentialQualityReport | null;
}

export interface ConsentRequestOut {
  id: string;
  requester_id: string;
  holder_id: string;
  requester_name?: string | null;
  requested_credential_ids: string[];
  requested_fields: string[];
  message?: string | null;
  purpose?: string | null;
  role_context?: string | null;
  status: "PENDING" | "APPROVED" | "DENIED" | "EXPIRED";
  verification_token?: string | null;
  created_at: string;
  expires_at?: string | null;
  responded_at?: string | null;
  credentials?: CredentialOut[] | null;
  overshare_warnings?: string[] | null;
}

export interface VerificationResult {
  credential_id: string;
  candidate_name?: string | null;
  institution_name?: string | null;
  credential_type?: string | null;
  credential_data?: Record<string, any> | null;
  signature_valid: boolean;
  integrity_valid: boolean;
  revocation_status: "ACTIVE" | "REVOKED" | "EXPIRED";
  consent_valid: boolean;
  reason?: string | null;
  issued_at?: string | null;
  overall_status?: "VALID" | "TAMPERED" | "REVOKED" | "EXPIRED" | "INVALID_CONSENT" | "FLAGGED_REVIEW" | string;
  quality_status?: "no_issues" | "review_required" | null;
  quality_score?: number | null;
  quality_issues?: QualityIssue[] | null;
  quality_comparisons?: RecordComparison[] | null;
}

export interface TransitionStatus {
  stage: string;
  requirements: Array<{
    name: string;
    key: string;
    met: boolean;
    icon: string;
  }>;
  completed: number;
  total: number;
  ready: boolean;
}

// ─── ZK Proofs ───────────────────────────────────────────

export interface ZKProofOut {
  id: string;
  credential_id: string;
  attribute: string;
  predicate: string;
  threshold: string;
  result: boolean;
  proof_hash: string;
  created_at: string;
  expires_at?: string | null;
  label?: string | null;
}

// ─── Burn Tokens ─────────────────────────────────────────

export interface BurnTokenOut {
  id: string;
  token: string;
  consent_id: string;
  is_burned: boolean;
  burned_at?: string | null;
  created_at: string;
  expires_at: string;
  attempted_reuse_count: number;
  verify_url?: string | null;
}

export interface BurnVerifyResult {
  success: boolean;
  message: string;
  verification?: VerificationResult | null;
  reuse_attempt: boolean;
}

// ─── Credential Intelligence ─────────────────────────────

export interface CredentialIntelFlag {
  id: string;
  holder_id: string;
  credential_id_a: string;
  credential_id_b?: string | null;
  flag_type: "DUPLICATE" | "SIMILAR" | "CONFLICT" | "MISSING_FIELD" | "EXPIRED" | "ISSUER_MISMATCH" | "DATE_CONFLICT";
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  resolved: boolean;
  created_at: string;
}

export interface CredentialIntelReport {
  total_credentials: number;
  flags: CredentialIntelFlag[];
  summary: Record<string, number>;
  quality_score: number;
}

export interface QualityIssue {
  type: string;
  severity: "warning" | "low" | "medium" | "high";
  status: string;
  message: string;
  field?: string | null;
  value_1?: string | null;
  value_2?: string | null;
  action?: string | null;
  similarity_score?: number | null;
  related_credential_id?: string | null;
  related_credential_title?: string | null;
}

export interface ComparisonField {
  field_name: string;
  field_key: string;
  record_a_value: string;
  record_b_value: string;
  is_conflict: boolean;
  is_match: boolean;
}

export interface RecordComparison {
  record_a_id: string;
  record_a_title: string;
  record_b_id: string;
  record_b_title: string;
  comparison_fields: ComparisonField[];
}

export interface CredentialQualityReport {
  credential_id?: string | null;
  credential_title: string;
  status: "no_issues" | "review_required";
  quality_score: number;
  checks: {
    duplicate: boolean;
    similar: boolean;
    conflict: boolean;
    missing_fields: boolean;
    expired: boolean;
    issuer_consistency: boolean;
  };
  passed_checks: string[];
  issues: QualityIssue[];
  comparisons: RecordComparison[];
}

// ─── Over-Share ───────────────────────────────────────────

export interface OverShareWarning {
  field: string;
  reason: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface OverShareCheckResponse {
  warnings: OverShareWarning[];
  anomalous: boolean;
  recommendation: string;
}

// ─── Token Storage ────────────────────────────────────────

export const setToken = (token: string) => {
  if (typeof window !== "undefined") localStorage.setItem("lifekey_token", token);
};
export const getToken = (): string | null => {
  if (typeof window !== "undefined") return localStorage.getItem("lifekey_token");
  return null;
};
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("lifekey_token");
    localStorage.removeItem("lifekey_user");
  }
};
export const setUser = (user: User) => {
  if (typeof window !== "undefined") localStorage.setItem("lifekey_user", JSON.stringify(user));
};
export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("lifekey_user");
    if (raw) { try { return JSON.parse(raw); } catch { return null; } }
  }
  return null;
};

// ─── Demo Accounts Configuration (Single Source of Truth) ─
export const DEMO_ACCOUNTS = {
  STUDENT: {
    role: "STUDENT" as const,
    label: "Student",
    name: "Parth Patil",
    email: "parth@lifekey.id",
    password: "password123",
    dashboardPath: "/dashboard/student",
  },
  INSTITUTION: {
    role: "INSTITUTION" as const,
    label: "Institution",
    name: "Dr. Arvind Sharma",
    organization: "ABC Polytechnic Institute",
    email: "admin@abcpoly.edu.in",
    password: "password123",
    dashboardPath: "/dashboard/institution",
  },
  EMPLOYER: {
    role: "EMPLOYER" as const,
    label: "Employer",
    name: "Priya Nair",
    organization: "TechNova Pvt Ltd",
    email: "hr@technova.com",
    password: "password123",
    dashboardPath: "/dashboard/employer",
  },
};

// ─── Generic Fetcher ──────────────────────────────────────

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  } catch (err: any) {
    // Network-level error: backend down, connection refused, DNS error, or CORS block
    throw new Error("Cannot connect to LIFEKEY API. Please start the FastAPI server.");
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid email or password.");
    }
    if (response.status === 422) {
      throw new Error("Invalid login request.");
    }
    if (response.status >= 500) {
      throw new Error("LIFEKEY API encountered an internal error.");
    }
    const errorData = await response.json().catch(() => ({ detail: null }));
    throw new Error(errorData.detail || `Request failed (${response.status})`);
  }
  return response.json();
}

// ─── API Methods ──────────────────────────────────────────

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const data = await apiRequest<{ access_token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.access_token);
    setUser(data.user);
    return data;
  },

  register: async (payload: { name: string; email: string; password: string; role: string; organization?: string }) => {
    const data = await apiRequest<{ access_token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setToken(data.access_token);
    setUser(data.user);
    return data;
  },

  getMe: () => apiRequest<User>("/api/auth/me"),

  // Credentials
  getWallet: () => apiRequest<CredentialOut[]>("/api/credentials/wallet"),
  getIssuedCredentials: () => apiRequest<CredentialOut[]>("/api/credentials/issued"),
  getCredential: (id: string) => apiRequest<CredentialOut>(`/api/credentials/${id}`),

  issueCredential: (payload: {
    holder_email: string;
    credential_type: string;
    credential_data: Record<string, any>;
    expires_at?: string | null;
  }) => apiRequest<CredentialOut>("/api/credentials/issue", { method: "POST", body: JSON.stringify(payload) }),

  revokeCredential: (credentialId: string, reason: string) =>
    apiRequest<{ message: string }>(`/api/credentials/${credentialId}/revoke`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  reinstateCredential: (credentialId: string) =>
    apiRequest<{ message: string }>(`/api/credentials/${credentialId}/reinstate`, { method: "POST" }),

  // Consent
  createConsentRequest: (payload: {
    holder_email: string;
    credential_ids: string[];
    requested_fields: string[];
    message?: string;
    purpose?: string;
    role_context?: string;
  }) => apiRequest<ConsentRequestOut>("/api/consent/request", { method: "POST", body: JSON.stringify(payload) }),

  getPendingConsents: () => apiRequest<ConsentRequestOut[]>("/api/consent/pending"),
  getAllConsents: () => apiRequest<ConsentRequestOut[]>("/api/consent/all"),

  respondToConsent: (consentId: string, approve: boolean) =>
    apiRequest<ConsentRequestOut>(`/api/consent/${consentId}/respond`, {
      method: "POST",
      body: JSON.stringify({ approve }),
    }),

  checkOverShare: (payload: {
    requested_fields: string[];
    role_context?: string;
    purpose?: string;
  }) => apiRequest<OverShareCheckResponse>("/api/consent/check-overshare", {
    method: "POST",
    body: JSON.stringify(payload),
  }),

  // Verification
  verifyByToken: (token: string) => apiRequest<VerificationResult>(`/api/verify/${token}`),

  verifyCredentialDirect: (payload: {
    credential_id: string;
    credential_data?: Record<string, any>;
  }) => apiRequest<VerificationResult>("/api/verify/credential", { method: "POST", body: JSON.stringify(payload) }),

  getVerificationLogs: (credentialId: string) =>
    apiRequest<any[]>(`/api/verify/logs/${credentialId}`),

  // ZK Proofs
  createZKProof: (payload: {
    credential_id: string;
    attribute: string;
    predicate: string;
    threshold: string;
  }) => apiRequest<ZKProofOut>("/api/zk/prove", { method: "POST", body: JSON.stringify(payload) }),

  getMyZKProofs: () => apiRequest<ZKProofOut[]>("/api/zk/proofs"),

  verifyZKProof: (proofId: string) => apiRequest<ZKProofOut>(`/api/zk/verify/${proofId}`),

  // Burn Tokens
  createBurnToken: (consentId: string, ttlMinutes: number = 5) =>
    apiRequest<BurnTokenOut>("/api/burn/create", {
      method: "POST",
      body: JSON.stringify({ consent_id: consentId, ttl_minutes: ttlMinutes }),
    }),

  getMyBurnTokens: () => apiRequest<BurnTokenOut[]>("/api/burn/my-tokens"),

  verifyBurnToken: (token: string) => apiRequest<BurnVerifyResult>(`/api/burn/verify/${token}`),

  // Credential Intelligence
  getIntelReport: () => apiRequest<CredentialIntelReport>("/api/intel/report"),
  resolveIntelFlag: (flagId: string) =>
    apiRequest<{ message: string }>(`/api/intel/resolve/${flagId}`, { method: "POST" }),

  checkIntelligence: (payload: {
    credential_id?: string;
    credential_type?: string;
    credential_data?: Record<string, any>;
    holder_email?: string;
    holder_id?: string;
    expires_at?: string | null;
    threshold?: number;
  }) =>
    apiRequest<CredentialQualityReport>("/api/credentials/intelligence/check", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getCredentialIntelligence: (credentialId: string) =>
    apiRequest<CredentialQualityReport>(`/api/credentials/${credentialId}/intelligence`),

  compareRecords: (credentialIdA: string, credentialIdB: string) =>
    apiRequest<RecordComparison>("/api/credentials/intelligence/compare", {
      method: "POST",
      body: JSON.stringify({ credential_id_a: credentialIdA, credential_id_b: credentialIdB }),
    }),

  // Life Transition
  getTransitionStatus: () => apiRequest<TransitionStatus>("/api/transition/status"),

  // Users
  listStudents: () => apiRequest<User[]>("/api/users/students"),
};
