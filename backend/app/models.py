"""
LIFEKEY — SQLAlchemy Models
Core tables: users, credentials, consent_requests, verification_logs,
             zk_proofs, burn_tokens, credential_intel_flags
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SAEnum, Boolean, Integer
from sqlalchemy.orm import relationship
from app.database import Base

def gen_uuid():
    return str(uuid.uuid4())

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(SAEnum("STUDENT", "INSTITUTION", "EMPLOYER", "ADMIN", name="user_role"), nullable=False)
    organization = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utcnow)

    # Relationships
    issued_credentials = relationship("Credential", foreign_keys="Credential.issuer_id", back_populates="issuer")
    held_credentials = relationship("Credential", foreign_keys="Credential.holder_id", back_populates="holder")


class Credential(Base):
    __tablename__ = "credentials"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    holder_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    issuer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    credential_type = Column(String(100), nullable=False)
    credential_data = Column(Text, nullable=False)  # JSON string
    credential_hash = Column(String(64), nullable=False)  # SHA-256
    signature = Column(Text, nullable=False)  # RSA-2048
    issued_at = Column(DateTime, default=utcnow)
    expires_at = Column(DateTime, nullable=True)
    status = Column(SAEnum("ACTIVE", "REVOKED", "EXPIRED", name="credential_status"), default="ACTIVE")
    revocation_reason = Column(String(500), nullable=True)

    # Relationships
    issuer = relationship("User", foreign_keys=[issuer_id], back_populates="issued_credentials")
    holder = relationship("User", foreign_keys=[holder_id], back_populates="held_credentials")


class ConsentRequest(Base):
    __tablename__ = "consent_requests"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    requester_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    holder_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    requester_name = Column(String(255), nullable=True)
    requested_credential_ids = Column(Text, nullable=False)  # JSON array
    requested_fields = Column(Text, nullable=False)  # JSON array
    purpose = Column(String(500), nullable=True)  # Purpose-bound sharing: WHY
    role_context = Column(String(255), nullable=True)  # Role/position context (for over-share detection)
    message = Column(Text, nullable=True)
    status = Column(SAEnum("PENDING", "APPROVED", "DENIED", "EXPIRED", name="consent_status"), default="PENDING")
    verification_token = Column(String(64), nullable=True, unique=True)
    created_at = Column(DateTime, default=utcnow)
    expires_at = Column(DateTime, nullable=True)
    responded_at = Column(DateTime, nullable=True)

    requester = relationship("User", foreign_keys=[requester_id])
    holder = relationship("User", foreign_keys=[holder_id])


class VerificationLog(Base):
    __tablename__ = "verification_logs"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    credential_id = Column(String(36), ForeignKey("credentials.id"), nullable=False)
    verifier_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    consent_id = Column(String(36), ForeignKey("consent_requests.id"), nullable=True)
    result = Column(SAEnum("VALID", "INVALID", "TAMPERED", "REVOKED", "EXPIRED", name="verification_result"), nullable=False)
    reason = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=utcnow)
    was_burn_token = Column(Boolean, default=False)

    credential = relationship("Credential")
    verifier = relationship("User", foreign_keys=[verifier_id])


class ZKProof(Base):
    """
    Zero-Knowledge Attribute Proofs.
    Stores a boolean claim derived from a credential without exposing the raw value.
    e.g. "cgpa > 8.0" → True/False, proven cryptographically.
    """
    __tablename__ = "zk_proofs"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    credential_id = Column(String(36), ForeignKey("credentials.id"), nullable=False)
    holder_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    attribute = Column(String(100), nullable=False)   # e.g. "cgpa", "age"
    predicate = Column(String(20), nullable=False)    # e.g. ">", ">=", "=="
    threshold = Column(String(100), nullable=False)   # e.g. "8.0", "18"
    result = Column(Boolean, nullable=False)          # True = condition met
    proof_hash = Column(String(64), nullable=False)   # SHA-256 of (cred_hash + attr + pred + threshold)
    created_at = Column(DateTime, default=utcnow)
    expires_at = Column(DateTime, nullable=True)

    credential = relationship("Credential")
    holder = relationship("User", foreign_keys=[holder_id])


class BurnToken(Base):
    """
    Burn-After-Reading Consent Tokens.
    Each token can only be successfully scanned ONCE or until its TTL expires.
    """
    __tablename__ = "burn_tokens"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    token = Column(String(64), nullable=False, unique=True, index=True)
    consent_id = Column(String(36), ForeignKey("consent_requests.id"), nullable=False)
    holder_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    is_burned = Column(Boolean, default=False)
    burned_at = Column(DateTime, nullable=True)
    burned_by_ip = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=utcnow)
    expires_at = Column(DateTime, nullable=False)  # Strict TTL (default 5 min)
    attempted_reuse_count = Column(Integer, default=0)

    consent = relationship("ConsentRequest")
    holder = relationship("User", foreign_keys=[holder_id])


class CredentialIntelFlag(Base):
    """
    Credential Intelligence flags: duplicates, conflicts, missing fields, etc.
    """
    __tablename__ = "credential_intel_flags"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    holder_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    credential_id_a = Column(String(36), ForeignKey("credentials.id"), nullable=False)
    credential_id_b = Column(String(36), ForeignKey("credentials.id"), nullable=True)  # For pair-based flags
    flag_type = Column(
        SAEnum(
            "DUPLICATE", "SIMILAR", "CONFLICT", "MISSING_FIELD",
            "EXPIRED", "ISSUER_MISMATCH", "DATE_CONFLICT",
            name="flag_type"
        ),
        nullable=False
    )
    description = Column(Text, nullable=False)
    severity = Column(SAEnum("LOW", "MEDIUM", "HIGH", name="flag_severity"), default="MEDIUM")
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)

    holder = relationship("User", foreign_keys=[holder_id])
    credential_a = relationship("Credential", foreign_keys=[credential_id_a])
    credential_b = relationship("Credential", foreign_keys=[credential_id_b])
