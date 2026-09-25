"""
LIFEKEY — Pydantic Schemas
Request/response schemas for all API endpoints including new features.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

# ─── Auth ────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    organization: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    organization: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ─── Credentials ─────────────────────────────────────────

class CredentialCreate(BaseModel):
    holder_email: str
    credential_type: str
    credential_data: dict
    expires_at: Optional[datetime] = None

class CredentialOut(BaseModel):
    id: str
    holder_id: str
    issuer_id: str
    credential_type: str
    credential_data: dict
    credential_hash: str
    issued_at: datetime
    expires_at: Optional[datetime] = None
    status: str
    issuer_name: Optional[str] = None
    holder_name: Optional[str] = None
    revocation_reason: Optional[str] = None

    class Config:
        from_attributes = True

class CredentialRevoke(BaseModel):
    reason: str

# ─── Consent ─────────────────────────────────────────────

class ConsentRequestCreate(BaseModel):
    holder_email: str
    credential_ids: List[str]
    requested_fields: List[str]
    message: Optional[str] = None
    purpose: Optional[str] = None
    role_context: Optional[str] = None  # e.g. "Remote Software Engineer"

class ConsentRequestOut(BaseModel):
    id: str
    requester_id: str
    holder_id: str
    requester_name: Optional[str] = None
    requested_credential_ids: List[str]
    requested_fields: List[str]
    message: Optional[str] = None
    purpose: Optional[str] = None
    role_context: Optional[str] = None
    status: str
    verification_token: Optional[str] = None
    created_at: datetime
    expires_at: Optional[datetime] = None
    responded_at: Optional[datetime] = None
    credentials: Optional[List[CredentialOut]] = None
    overshare_warnings: Optional[List[str]] = None  # Computed on output

    class Config:
        from_attributes = True

class ConsentRespond(BaseModel):
    approve: bool

# ─── Verification ────────────────────────────────────────

class VerificationRequest(BaseModel):
    credential_id: str
    credential_data: Optional[dict] = None

class VerificationResult(BaseModel):
    credential_id: str
    candidate_name: Optional[str] = None
    institution_name: Optional[str] = None
    credential_type: Optional[str] = None
    credential_data: Optional[dict] = None
    signature_valid: bool
    integrity_valid: bool
    revocation_status: str
    consent_valid: bool
    overall_status: str
    reason: Optional[str] = None
    issued_at: Optional[datetime] = None

class VerificationLogOut(BaseModel):
    id: str
    credential_id: str
    result: str
    reason: Optional[str] = None
    timestamp: datetime
    was_burn_token: Optional[bool] = False

    class Config:
        from_attributes = True

# ─── Life Transition ─────────────────────────────────────

class TransitionStatus(BaseModel):
    stage: str
    requirements: List[dict]
    completed: int
    total: int
    ready: bool

# ─── Zero-Knowledge Proofs ───────────────────────────────

class ZKProofCreate(BaseModel):
    credential_id: str
    attribute: str      # e.g. "cgpa", "age", "graduation_year"
    predicate: str      # ">", ">=", "==", "<", "<="
    threshold: str      # e.g. "8.0", "18", "2024"

class ZKProofOut(BaseModel):
    id: str
    credential_id: str
    attribute: str
    predicate: str
    threshold: str
    result: bool
    proof_hash: str
    created_at: datetime
    expires_at: Optional[datetime] = None
    label: Optional[str] = None   # Human-readable, e.g. "CGPA > 8.0 → TRUE"

    class Config:
        from_attributes = True

# ─── Burn-After-Reading Tokens ───────────────────────────

class BurnTokenCreate(BaseModel):
    consent_id: str
    ttl_minutes: int = 5

class BurnTokenOut(BaseModel):
    id: str
    token: str
    consent_id: str
    is_burned: bool
    burned_at: Optional[datetime] = None
    created_at: datetime
    expires_at: datetime
    attempted_reuse_count: int
    verify_url: Optional[str] = None

    class Config:
        from_attributes = True

class BurnVerifyResult(BaseModel):
    success: bool
    message: str
    verification: Optional[VerificationResult] = None
    reuse_attempt: bool = False

# ─── Credential Intelligence ─────────────────────────────

class CredentialIntelFlagOut(BaseModel):
    id: str
    holder_id: str
    credential_id_a: str
    credential_id_b: Optional[str] = None
    flag_type: str
    description: str
    severity: str
    resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True

class CredentialIntelReport(BaseModel):
    total_credentials: int
    flags: List[CredentialIntelFlagOut]
    summary: dict  # counts per flag_type
    quality_score: int  # 0-100

# ─── Over-Share Warning ──────────────────────────────────

class OverShareWarning(BaseModel):
    field: str
    reason: str
    severity: str  # "LOW", "MEDIUM", "HIGH"

class OverShareCheckRequest(BaseModel):
    requested_fields: List[str]
    role_context: Optional[str] = None
    purpose: Optional[str] = None

class OverShareCheckResponse(BaseModel):
    warnings: List[OverShareWarning]
    anomalous: bool
    recommendation: str
