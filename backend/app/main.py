"""
LIFEKEY — Main FastAPI Application
All API routes: Issue → Own → Share → Verify + ZK Proofs + Burn Tokens +
Credential Intelligence + Over-Share Warnings
"""
import hashlib
import json
import secrets
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, get_db, Base
from app.models import (
    User, Credential, ConsentRequest, VerificationLog,
    ZKProof, BurnToken, CredentialIntelFlag,
)
from app.schemas import (
    UserRegister, UserLogin, TokenResponse, UserOut,
    CredentialCreate, CredentialOut, CredentialRevoke,
    ConsentRequestCreate, ConsentRequestOut, ConsentRespond,
    VerificationRequest, VerificationResult, VerificationLogOut,
    TransitionStatus,
    ZKProofCreate, ZKProofOut,
    BurnTokenCreate, BurnTokenOut, BurnVerifyResult,
    CredentialIntelFlagOut, CredentialIntelReport,
    OverShareCheckRequest, OverShareCheckResponse, OverShareWarning,
    CredentialQualityCheckRequest, CredentialQualityCheckResponse,
    RecordCompareRequest,
)
from app.auth import hash_password, verify_password, create_token, get_current_user, get_current_user_optional
from app.crypto import hash_credential, sign_credential, verify_signature, verify_integrity
from app.intelligence import (
    run_credential_quality_check,
    build_record_comparison,
    check_field_conflicts,
    compute_similarity,
    normalize_text,
    clean_basic_text,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LIFEKEY API",
    description="Citizen-controlled interoperability layer for life-stage transitions",
    version="2.0.0",
)

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ════════════════════════════════════════════════════════════
# OVER-SHARE WARNING ENGINE (pure logic, no DB)
# ════════════════════════════════════════════════════════════

# Fields that are considered sensitive/privacy-invasive
SENSITIVE_FIELDS = {
    "home_address": "HOME",
    "address": "HOME",
    "phone": "HOME",
    "phone_number": "HOME",
    "personal_email": "HOME",
    "date_of_birth": "PERSONAL",
    "dob": "PERSONAL",
    "age": "PERSONAL",
    "religion": "PERSONAL",
    "caste": "PERSONAL",
    "marital_status": "PERSONAL",
    "gender": "PERSONAL",
    "national_id": "ID",
    "aadhar": "ID",
    "pan": "ID",
    "passport_number": "ID",
    "bank_account": "FINANCIAL",
    "salary": "FINANCIAL",
    "income": "FINANCIAL",
    "medical_records": "HEALTH",
    "health_info": "HEALTH",
}

# For a "Remote Software Role", these fields make no sense
REMOTE_IRRELEVANT = {"home_address", "address", "phone", "phone_number", "religion", "caste", "marital_status"}
EMPLOYMENT_STANDARD = {"title", "major", "cgpa", "skills", "status", "graduation_year"}

def compute_overshare_warnings(
    requested_fields: List[str],
    role_context: Optional[str],
    purpose: Optional[str],
) -> List[OverShareWarning]:
    warnings = []
    role_lower = (role_context or "").lower()
    is_remote = "remote" in role_lower
    is_software = any(w in role_lower for w in ["software", "engineer", "developer", "data", "tech", "it", "ai", "ml"])

    for field in requested_fields:
        field_lower = field.lower().replace(" ", "_")
        category = SENSITIVE_FIELDS.get(field_lower)

        if category == "HOME" and (is_remote or is_software):
            warnings.append(OverShareWarning(
                field=field,
                reason=f"Home address/phone not required for a {role_context or 'remote'} role",
                severity="HIGH",
            ))
        elif category == "PERSONAL":
            warnings.append(OverShareWarning(
                field=field,
                reason="Personal demographic data is not relevant for employment credential checks",
                severity="HIGH",
            ))
        elif category == "ID":
            warnings.append(OverShareWarning(
                field=field,
                reason="Government ID numbers should not be shared at initial verification stage",
                severity="HIGH",
            ))
        elif category == "FINANCIAL":
            warnings.append(OverShareWarning(
                field=field,
                reason="Financial information is irrelevant for credential verification",
                severity="HIGH",
            ))
        elif category == "HEALTH":
            warnings.append(OverShareWarning(
                field=field,
                reason="Health/medical records may not be legally requested at hiring stage",
                severity="HIGH",
            ))

    return warnings


# ════════════════════════════════════════════════════════════
# AUTH ROUTES
# ════════════════════════════════════════════════════════════

@app.post("/api/auth/register", response_model=TokenResponse)
def register(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    if data.role not in ("STUDENT", "INSTITUTION", "EMPLOYER"):
        raise HTTPException(status_code=400, detail="Invalid role")

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role,
        organization=data.organization,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_token(user.id, user.role)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@app.post("/api/auth/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user.id, user.role)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@app.get("/api/auth/me", response_model=UserOut)
def get_me(user: User = Depends(get_current_user)):
    return UserOut.model_validate(user)


# ════════════════════════════════════════════════════════════
# CREDENTIAL ROUTES
# ════════════════════════════════════════════════════════════

@app.post("/api/credentials/issue", response_model=CredentialOut)
def issue_credential(
    data: CredentialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "INSTITUTION":
        raise HTTPException(status_code=403, detail="Only institutions can issue credentials")

    holder = db.query(User).filter(User.email == data.holder_email).first()
    if not holder:
        raise HTTPException(status_code=404, detail="Student not found")
    if holder.role != "STUDENT":
        raise HTTPException(status_code=400, detail="Can only issue credentials to students")

    full_data = {
        **data.credential_data,
        "_meta": {
            "issuer_id": current_user.id,
            "issuer_name": current_user.organization or current_user.name,
            "holder_id": holder.id,
            "holder_name": holder.name,
            "credential_type": data.credential_type,
            "issued_at": datetime.now(timezone.utc).isoformat(),
        }
    }

    cred_hash = hash_credential(full_data)
    signature = sign_credential(cred_hash)

    credential = Credential(
        holder_id=holder.id,
        issuer_id=current_user.id,
        credential_type=data.credential_type,
        credential_data=json.dumps(full_data),
        credential_hash=cred_hash,
        signature=signature,
        expires_at=data.expires_at,
    )
    db.add(credential)
    db.commit()
    db.refresh(credential)

    # Run intelligence analysis after every new credential
    _run_credential_intelligence(holder.id, db)

    out = _credential_to_out(credential, db)
    # Immediate quality check for this newly issued credential
    holder_creds = db.query(Credential).filter(
        Credential.holder_id == holder.id,
        Credential.id != credential.id,
    ).all()
    q_report = run_credential_quality_check(
        credential_id=credential.id,
        credential_type=credential.credential_type,
        credential_data=full_data,
        expires_at=credential.expires_at,
        issuer_user=current_user,
        existing_credentials=holder_creds,
    )
    out.quality_status = q_report["status"]
    out.quality_score = q_report["quality_score"]
    out.quality_check = q_report
    return out


@app.get("/api/credentials/issued", response_model=List[CredentialOut])
def get_issued_credentials(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "INSTITUTION":
        raise HTTPException(status_code=403, detail="Only institutions can view issued credentials")
    creds = db.query(Credential).filter(Credential.issuer_id == current_user.id).all()
    return [_credential_to_out(c, db) for c in creds]


@app.get("/api/credentials/wallet", response_model=List[CredentialOut])
def get_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can access their wallet")
    creds = db.query(Credential).filter(Credential.holder_id == current_user.id).all()
    return [_credential_to_out(c, db) for c in creds]


@app.get("/api/credentials/{credential_id}", response_model=CredentialOut)
def get_credential(
    credential_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cred = db.query(Credential).filter(Credential.id == credential_id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    if current_user.id not in (cred.holder_id, cred.issuer_id) and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized")
    return _credential_to_out(cred, db)


@app.post("/api/credentials/{credential_id}/revoke")
def revoke_credential(
    credential_id: str,
    data: CredentialRevoke,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "INSTITUTION":
        raise HTTPException(status_code=403, detail="Only institutions can revoke credentials")
    cred = db.query(Credential).filter(
        Credential.id == credential_id,
        Credential.issuer_id == current_user.id,
    ).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    cred.status = "REVOKED"
    cred.revocation_reason = data.reason
    db.commit()
    return {"message": "Credential revoked", "credential_id": credential_id}


@app.post("/api/credentials/{credential_id}/reinstate")
def reinstate_credential(
    credential_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "INSTITUTION":
        raise HTTPException(status_code=403, detail="Only institutions can reinstate credentials")
    cred = db.query(Credential).filter(
        Credential.id == credential_id,
        Credential.issuer_id == current_user.id,
    ).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    cred.status = "ACTIVE"
    cred.revocation_reason = None
    db.commit()
    return {"message": "Credential reinstated", "credential_id": credential_id}


# ════════════════════════════════════════════════════════════
# CONSENT ROUTES
# ════════════════════════════════════════════════════════════

@app.post("/api/consent/request", response_model=ConsentRequestOut)
def create_consent_request(
    data: ConsentRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "EMPLOYER":
        raise HTTPException(status_code=403, detail="Only employers can request consent")

    holder = db.query(User).filter(User.email == data.holder_email).first()
    if not holder:
        raise HTTPException(status_code=404, detail="Student not found")

    consent = ConsentRequest(
        requester_id=current_user.id,
        holder_id=holder.id,
        requester_name=current_user.organization or current_user.name,
        requested_credential_ids=json.dumps(data.credential_ids),
        requested_fields=json.dumps(data.requested_fields),
        purpose=data.purpose,
        role_context=data.role_context,
        message=data.message,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )
    db.add(consent)
    db.commit()
    db.refresh(consent)
    return _consent_to_out(consent, db)


@app.get("/api/consent/pending", response_model=List[ConsentRequestOut])
def get_pending_consents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can view consent requests")
    consents = db.query(ConsentRequest).filter(
        ConsentRequest.holder_id == current_user.id,
        ConsentRequest.status == "PENDING",
    ).all()
    return [_consent_to_out(c, db) for c in consents]


@app.get("/api/consent/all", response_model=List[ConsentRequestOut])
def get_all_consents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "STUDENT":
        consents = db.query(ConsentRequest).filter(ConsentRequest.holder_id == current_user.id).all()
    elif current_user.role == "EMPLOYER":
        consents = db.query(ConsentRequest).filter(ConsentRequest.requester_id == current_user.id).all()
    else:
        consents = []
    return [_consent_to_out(c, db) for c in consents]


@app.post("/api/consent/{consent_id}/respond")
def respond_to_consent(
    consent_id: str,
    data: ConsentRespond,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    consent = db.query(ConsentRequest).filter(
        ConsentRequest.id == consent_id,
        ConsentRequest.holder_id == current_user.id,
    ).first()
    if not consent:
        raise HTTPException(status_code=404, detail="Consent request not found")
    if consent.status != "PENDING":
        raise HTTPException(status_code=400, detail="Consent already responded to")

    consent.status = "APPROVED" if data.approve else "DENIED"
    consent.responded_at = datetime.now(timezone.utc)

    if data.approve:
        consent.verification_token = secrets.token_urlsafe(32)

    db.commit()
    db.refresh(consent)
    return _consent_to_out(consent, db)


# ════════════════════════════════════════════════════════════
# OVER-SHARE CHECK
# ════════════════════════════════════════════════════════════

@app.post("/api/consent/check-overshare", response_model=OverShareCheckResponse)
def check_overshare(
    data: OverShareCheckRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Contextual over-share warning engine. Call before showing approve button.
    Returns a list of warnings if sensitive or irrelevant fields are requested.
    """
    warnings = compute_overshare_warnings(
        data.requested_fields,
        data.role_context,
        data.purpose,
    )
    anomalous = len(warnings) > 0
    if not anomalous:
        recommendation = "This request appears appropriate for the stated purpose."
    elif len(warnings) == 1:
        recommendation = "Review the flagged field before approving. You may selectively exclude it."
    else:
        recommendation = (
            f"{len(warnings)} anomalous field(s) detected. These fields are unusual for the "
            f"stated role/purpose. Consider denying or requesting clarification from the employer."
        )
    return OverShareCheckResponse(warnings=warnings, anomalous=anomalous, recommendation=recommendation)


# ════════════════════════════════════════════════════════════
# VERIFICATION ROUTES
# ════════════════════════════════════════════════════════════

@app.get("/api/verify/{token}", response_model=VerificationResult)
def verify_by_token(
    token: str,
    db: Session = Depends(get_db),
):
    consent = db.query(ConsentRequest).filter(
        ConsentRequest.verification_token == token,
    ).first()
    if not consent:
        raise HTTPException(status_code=404, detail="Invalid verification token")
    if consent.status != "APPROVED":
        raise HTTPException(status_code=403, detail="Consent not granted")

    cred_ids = json.loads(consent.requested_credential_ids)
    if not cred_ids:
        raise HTTPException(status_code=400, detail="No credentials in consent")

    cred = db.query(Credential).filter(Credential.id == cred_ids[0]).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")

    result = _verify_credential(cred, db, consent_id=consent.id)

    log = VerificationLog(
        credential_id=cred.id,
        consent_id=consent.id,
        result=result.overall_status,
        reason=result.reason,
    )
    db.add(log)
    db.commit()
    return result


@app.post("/api/verify/credential", response_model=VerificationResult)
def verify_credential_direct(
    data: VerificationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cred = db.query(Credential).filter(Credential.id == data.credential_id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    result = _verify_credential(cred, db, tampered_data=data.credential_data)
    log = VerificationLog(
        credential_id=cred.id,
        verifier_id=current_user.id,
        result=result.overall_status,
        reason=result.reason,
    )
    db.add(log)
    db.commit()
    return result


@app.get("/api/verify/logs/{credential_id}", response_model=List[VerificationLogOut])
def get_verification_logs(
    credential_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    logs = db.query(VerificationLog).filter(
        VerificationLog.credential_id == credential_id,
    ).order_by(VerificationLog.timestamp.desc()).all()
    return [VerificationLogOut.model_validate(l) for l in logs]


# ════════════════════════════════════════════════════════════
# ZERO-KNOWLEDGE ATTRIBUTE PROOFS
# ════════════════════════════════════════════════════════════

@app.post("/api/zk/prove", response_model=ZKProofOut)
def create_zk_proof(
    data: ZKProofCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Student generates a ZK attribute proof for a specific credential field.
    The proof reveals only a boolean result (e.g. CGPA > 8.0 = True) never the raw value.
    """
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can generate ZK proofs")

    cred = db.query(Credential).filter(
        Credential.id == data.credential_id,
        Credential.holder_id == current_user.id,
    ).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found or not yours")

    cred_data = json.loads(cred.credential_data)

    # Extract the raw attribute value
    raw_value = cred_data.get(data.attribute)
    if raw_value is None:
        raise HTTPException(
            status_code=400,
            detail=f"Attribute '{data.attribute}' not found in credential"
        )

    # Evaluate the predicate
    try:
        raw_num = float(str(raw_value))
        threshold_num = float(data.threshold)
        if data.predicate == ">":
            result = raw_num > threshold_num
        elif data.predicate == ">=":
            result = raw_num >= threshold_num
        elif data.predicate == "==":
            result = raw_num == threshold_num
        elif data.predicate == "<":
            result = raw_num < threshold_num
        elif data.predicate == "<=":
            result = raw_num <= threshold_num
        else:
            raise HTTPException(status_code=400, detail="Invalid predicate. Use >, >=, ==, <, <=")
    except (ValueError, TypeError):
        # Fall back to string equality for non-numeric
        if data.predicate == "==":
            result = str(raw_value).lower() == data.threshold.lower()
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot apply numeric predicate to non-numeric field '{data.attribute}'"
            )

    # Cryptographically sign the proof: hash(credential_hash + attribute + predicate + threshold)
    proof_input = f"{cred.credential_hash}:{data.attribute}:{data.predicate}:{data.threshold}"
    proof_hash = hashlib.sha256(proof_input.encode()).hexdigest()

    zk = ZKProof(
        credential_id=cred.id,
        holder_id=current_user.id,
        attribute=data.attribute,
        predicate=data.predicate,
        threshold=data.threshold,
        result=result,
        proof_hash=proof_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
    )
    db.add(zk)
    db.commit()
    db.refresh(zk)

    label = f"{data.attribute.upper()} {data.predicate} {data.threshold} → {'TRUE ✓' if result else 'FALSE ✗'}"
    out = ZKProofOut.model_validate(zk)
    out.label = label
    return out


@app.get("/api/zk/proofs", response_model=List[ZKProofOut])
def get_my_zk_proofs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can view their ZK proofs")
    proofs = db.query(ZKProof).filter(ZKProof.holder_id == current_user.id).order_by(ZKProof.created_at.desc()).all()
    result = []
    for zk in proofs:
        out = ZKProofOut.model_validate(zk)
        out.label = f"{zk.attribute.upper()} {zk.predicate} {zk.threshold} → {'TRUE ✓' if zk.result else 'FALSE ✗'}"
        result.append(out)
    return result


@app.get("/api/zk/verify/{proof_id}", response_model=ZKProofOut)
def verify_zk_proof(
    proof_id: str,
    db: Session = Depends(get_db),
):
    """Public endpoint: verify a ZK proof by ID."""
    zk = db.query(ZKProof).filter(ZKProof.id == proof_id).first()
    if not zk:
        raise HTTPException(status_code=404, detail="ZK proof not found")

    # Re-derive the proof hash to confirm integrity
    cred = db.query(Credential).filter(Credential.id == zk.credential_id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Underlying credential not found")

    expected_hash = hashlib.sha256(
        f"{cred.credential_hash}:{zk.attribute}:{zk.predicate}:{zk.threshold}".encode()
    ).hexdigest()

    if expected_hash != zk.proof_hash:
        raise HTTPException(status_code=400, detail="ZK proof hash mismatch — proof has been tampered with")

    if zk.expires_at and zk.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="ZK proof has expired")

    out = ZKProofOut.model_validate(zk)
    out.label = f"{zk.attribute.upper()} {zk.predicate} {zk.threshold} → {'TRUE ✓' if zk.result else 'FALSE ✗'}"
    return out


# ════════════════════════════════════════════════════════════
# BURN-AFTER-READING TOKENS
# ════════════════════════════════════════════════════════════

@app.post("/api/burn/create", response_model=BurnTokenOut)
def create_burn_token(
    data: BurnTokenCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Student creates a burn-after-read token for an approved consent."""
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can create burn tokens")

    consent = db.query(ConsentRequest).filter(
        ConsentRequest.id == data.consent_id,
        ConsentRequest.holder_id == current_user.id,
        ConsentRequest.status == "APPROVED",
    ).first()
    if not consent:
        raise HTTPException(status_code=404, detail="Approved consent not found")

    ttl = max(1, min(data.ttl_minutes, 60))  # clamp 1–60 min
    token_str = secrets.token_urlsafe(40)
    burn_token = BurnToken(
        token=token_str,
        consent_id=consent.id,
        holder_id=current_user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=ttl),
    )
    db.add(burn_token)
    db.commit()
    db.refresh(burn_token)

    out = BurnTokenOut.model_validate(burn_token)
    out.verify_url = f"http://localhost:3000/burn/{burn_token.token}"
    return out


@app.get("/api/burn/verify/{token}", response_model=BurnVerifyResult)
def verify_burn_token(
    token: str,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Public one-time verification endpoint.
    The token is burned on first successful access.
    Any subsequent attempt is blocked and logged as unauthorized.
    """
    bt = db.query(BurnToken).filter(BurnToken.token == token).first()
    if not bt:
        return BurnVerifyResult(
            success=False,
            message="Invalid token. This link does not exist.",
            reuse_attempt=False,
        )

    now = datetime.now(timezone.utc)

    # Already burned
    if bt.is_burned:
        bt.attempted_reuse_count += 1
        db.commit()
        return BurnVerifyResult(
            success=False,
            message=(
                f"ACCESS DENIED. This token was already consumed on "
                f"{bt.burned_at.strftime('%Y-%m-%d %H:%M UTC') if bt.burned_at else 'unknown time'}. "
                f"Unauthorized attempt #{bt.attempted_reuse_count} has been logged."
            ),
            reuse_attempt=True,
        )

    # Expired
    burn_expires = bt.expires_at
    if burn_expires.tzinfo is None:
        burn_expires = burn_expires.replace(tzinfo=timezone.utc)
    if burn_expires < now:
        return BurnVerifyResult(
            success=False,
            message="This token has expired. Please request a new verification link.",
            reuse_attempt=False,
        )

    # Valid — burn it now
    bt.is_burned = True
    bt.burned_at = now
    bt.burned_by_ip = request.client.host if request.client else "unknown"
    db.commit()

    # Perform the actual credential verification
    consent = db.query(ConsentRequest).filter(ConsentRequest.id == bt.consent_id).first()
    verification = None
    if consent:
        cred_ids = json.loads(consent.requested_credential_ids)
        if cred_ids:
            cred = db.query(Credential).filter(Credential.id == cred_ids[0]).first()
            if cred:
                verification = _verify_credential(cred, db, consent_id=consent.id)
                log = VerificationLog(
                    credential_id=cred.id,
                    consent_id=consent.id,
                    result=verification.overall_status,
                    reason=verification.reason,
                    was_burn_token=True,
                )
                db.add(log)
                db.commit()

    return BurnVerifyResult(
        success=True,
        message="Token consumed. This link is now permanently deactivated.",
        verification=verification,
    )


@app.get("/api/burn/my-tokens", response_model=List[BurnTokenOut])
def get_my_burn_tokens(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can view their burn tokens")
    tokens = db.query(BurnToken).filter(
        BurnToken.holder_id == current_user.id
    ).order_by(BurnToken.created_at.desc()).all()
    result = []
    for bt in tokens:
        out = BurnTokenOut.model_validate(bt)
        out.verify_url = f"http://localhost:3000/burn/{bt.token}"
        result.append(out)
    return result


# ════════════════════════════════════════════════════════════
# CREDENTIAL INTELLIGENCE & DUPLICATE DETECTION
# ════════════════════════════════════════════════════════════

def _run_credential_intelligence(holder_id: str, db: Session):
    """
    Runs the comprehensive Credential Intelligence engine on all credentials for a holder.
    Uses normalization, exact duplicate detection, similarity mechanism,
    conflict detection, missing field detection, expiry check, and issuer consistency.
    Generates CredentialIntelFlag records for any issues detected.
    """
    creds = db.query(Credential).filter(Credential.holder_id == holder_id).all()

    # Clear old unresolved flags for this holder (re-analyze fresh)
    db.query(CredentialIntelFlag).filter(
        CredentialIntelFlag.holder_id == holder_id,
        CredentialIntelFlag.resolved == False,
    ).delete(synchronize_session=False)
    db.flush()

    for cred in creds:
        cred_data = json.loads(cred.credential_data)
        issuer_user = db.query(User).filter(User.id == cred.issuer_id).first()
        other_creds = [c for c in creds if c.id != cred.id]

        report = run_credential_quality_check(
            credential_id=cred.id,
            credential_type=cred.credential_type,
            credential_data=cred_data,
            expires_at=cred.expires_at,
            issuer_user=issuer_user,
            existing_credentials=other_creds,
        )

        for issue in report.get("issues", []):
            itype = issue.get("type")
            flag_type_map = {
                "duplicate": "DUPLICATE",
                "similar": "SIMILAR",
                "conflict": "CONFLICT",
                "missing_field": "MISSING_FIELD",
                "expired": "EXPIRED",
                "issuer_consistency": "ISSUER_MISMATCH",
            }
            ft = flag_type_map.get(itype, "CONFLICT")
            sev = "HIGH" if itype in ("duplicate", "conflict", "expired") else "MEDIUM"
            if itype == "similar":
                sev = "LOW"

            rel_id = issue.get("related_credential_id")
            # Avoid reciprocal duplicated flags
            if rel_id and cred.id > rel_id:
                continue

            db.add(CredentialIntelFlag(
                holder_id=holder_id,
                credential_id_a=cred.id,
                credential_id_b=rel_id,
                flag_type=ft,
                description=issue.get("message", "Flagged for human review"),
                severity=sev,
            ))

    db.commit()


@app.post("/api/credentials/intelligence/check", response_model=CredentialQualityCheckResponse)
@app.post("/credentials/intelligence/check", response_model=CredentialQualityCheckResponse)
def check_credential_intelligence(
    req: CredentialQualityCheckRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Credential Intelligence Quality Check Endpoint:
    Receives either an existing credential_id OR raw credential data to evaluate.
    Runs all 6 intelligence checks:
    1. Exact duplicates
    2. Similar credential records
    3. Conflicting information
    4. Missing required fields
    5. Expired credentials
    6. Inconsistent issuer details
    Returns the unified quality-check result.
    NEVER automatically declares a credential fraudulent; flags issues for human review.
    """
    threshold = req.threshold if req.threshold is not None else 0.75
    
    if req.credential_id:
        target_cred = db.query(Credential).filter(Credential.id == req.credential_id).first()
        if not target_cred:
            raise HTTPException(status_code=404, detail="Credential not found")
        cred_data = json.loads(target_cred.credential_data)
        cred_type = target_cred.credential_type
        expires_at = target_cred.expires_at
        holder_id = target_cred.holder_id
        issuer_user = db.query(User).filter(User.id == target_cred.issuer_id).first()
        other_creds = db.query(Credential).filter(
            Credential.holder_id == holder_id,
            Credential.id != target_cred.id
        ).all()
        cred_id = target_cred.id
    else:
        cred_data = req.credential_data or {}
        cred_type = req.credential_type or "DIPLOMA"
        expires_at = req.expires_at
        cred_id = None

        holder = None
        if req.holder_id:
            holder = db.query(User).filter(User.id == req.holder_id).first()
        elif req.holder_email:
            holder = db.query(User).filter(User.email == req.holder_email).first()
        elif current_user and current_user.role == "STUDENT":
            holder = current_user

        if holder:
            other_creds = db.query(Credential).filter(Credential.holder_id == holder.id).all()
        else:
            other_creds = db.query(Credential).all()

        issuer_user = None
        if current_user and current_user.role == "INSTITUTION":
            issuer_user = current_user
        else:
            meta = cred_data.get("_meta", {})
            issuer_id = meta.get("issuer_id")
            if issuer_id:
                issuer_user = db.query(User).filter(User.id == issuer_id).first()
            if not issuer_user:
                inst_name = cred_data.get("institution") or meta.get("issuer_name")
                if inst_name:
                    issuer_user = db.query(User).filter(
                        (User.organization == inst_name) | (User.name == inst_name)
                    ).first()

    report = run_credential_quality_check(
        credential_id=cred_id,
        credential_type=cred_type,
        credential_data=cred_data,
        expires_at=expires_at,
        issuer_user=issuer_user,
        existing_credentials=other_creds,
        threshold=threshold,
    )

    return CredentialQualityCheckResponse(**report)


@app.get("/api/credentials/{credential_id}/intelligence", response_model=CredentialQualityCheckResponse)
def get_credential_intelligence_endpoint(
    credential_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Runs on-demand intelligence check on a specific existing credential."""
    target_cred = db.query(Credential).filter(Credential.id == credential_id).first()
    if not target_cred:
        raise HTTPException(status_code=404, detail="Credential not found")

    cred_data = json.loads(target_cred.credential_data)
    issuer_user = db.query(User).filter(User.id == target_cred.issuer_id).first()
    other_creds = db.query(Credential).filter(
        Credential.holder_id == target_cred.holder_id,
        Credential.id != target_cred.id
    ).all()

    report = run_credential_quality_check(
        credential_id=target_cred.id,
        credential_type=target_cred.credential_type,
        credential_data=cred_data,
        expires_at=target_cred.expires_at,
        issuer_user=issuer_user,
        existing_credentials=other_creds,
    )
    return CredentialQualityCheckResponse(**report)


@app.post("/api/credentials/intelligence/compare")
def compare_credentials_endpoint(
    req: RecordCompareRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Compares any two credentials side-by-side and returns highlighted field diffs."""
    cred_a = db.query(Credential).filter(Credential.id == req.credential_id_a).first()
    cred_b = db.query(Credential).filter(Credential.id == req.credential_id_b).first()
    if not cred_a or not cred_b:
        raise HTTPException(status_code=404, detail="One or both credentials could not be found")

    data_a = json.loads(cred_a.credential_data)
    data_b = json.loads(cred_b.credential_data)

    conflicts = check_field_conflicts(data_a, data_b, cred_a.credential_type, cred_b.credential_type)
    return build_record_comparison(
        cred_a_id=cred_a.id,
        cred_a_title=data_a.get("title", "Credential A"),
        cred_a_data=data_a,
        cred_b_id=cred_b.id,
        cred_b_title=data_b.get("title", "Credential B"),
        cred_b_data=data_b,
        conflicts=conflicts,
    )


@app.get("/api/intel/report", response_model=CredentialIntelReport)
def get_intelligence_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get credential intelligence report for the current student or institution."""
    if current_user.role not in ("STUDENT", "INSTITUTION"):
        raise HTTPException(status_code=403, detail="Only students and institutions can view intelligence reports")

    if current_user.role == "STUDENT":
        # Re-run analysis on demand for student
        _run_credential_intelligence(current_user.id, db)

        flags = db.query(CredentialIntelFlag).filter(
            CredentialIntelFlag.holder_id == current_user.id,
            CredentialIntelFlag.resolved == False,
        ).order_by(CredentialIntelFlag.created_at.desc()).all()

        total_creds = db.query(Credential).filter(Credential.holder_id == current_user.id).count()
    else:
        # INSTITUTION: analyze all credentials issued by this institution
        issued_creds = db.query(Credential).filter(Credential.issuer_id == current_user.id).all()
        holder_ids = list({c.holder_id for c in issued_creds})
        for hid in holder_ids:
            _run_credential_intelligence(hid, db)

        issued_cred_ids = [c.id for c in issued_creds]
        flags = db.query(CredentialIntelFlag).filter(
            CredentialIntelFlag.credential_id_a.in_(issued_cred_ids),
            CredentialIntelFlag.resolved == False,
        ).order_by(CredentialIntelFlag.created_at.desc()).all()

        total_creds = len(issued_creds)

    summary = {}
    for flag in flags:
        summary[flag.flag_type] = summary.get(flag.flag_type, 0) + 1

    # Quality score: start at 100, deduct per flag severity
    score = 100
    for flag in flags:
        if flag.severity == "HIGH":
            score -= 15
        elif flag.severity == "MEDIUM":
            score -= 7
        elif flag.severity == "LOW":
            score -= 3
    score = max(0, score)

    return CredentialIntelReport(
        total_credentials=total_creds,
        flags=[CredentialIntelFlagOut.model_validate(f) for f in flags],
        summary=summary,
        quality_score=score,
    )


@app.post("/api/intel/resolve/{flag_id}")
def resolve_intel_flag(
    flag_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Mark a flag as reviewed/resolved."""
    if current_user.role not in ("STUDENT", "INSTITUTION"):
        raise HTTPException(status_code=403, detail="Only students and institutions can resolve flags")

    flag = db.query(CredentialIntelFlag).filter(CredentialIntelFlag.id == flag_id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")

    if current_user.role == "STUDENT" and flag.holder_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    flag.resolved = True
    db.commit()
    return {"message": "Flag resolved", "flag_id": flag_id}


# ════════════════════════════════════════════════════════════
# LIFE TRANSITION PASSPORT
# ════════════════════════════════════════════════════════════

@app.get("/api/transition/status", response_model=TransitionStatus)
def get_transition_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "STUDENT":
        raise HTTPException(status_code=403, detail="Only students can check transition status")

    creds = db.query(Credential).filter(
        Credential.holder_id == current_user.id,
        Credential.status == "ACTIVE",
    ).all()
    cred_types = {c.credential_type for c in creds}
    zk_proofs = db.query(ZKProof).filter(ZKProof.holder_id == current_user.id).count()

    requirements = [
        {"name": "Identity Verified", "key": "identity", "met": True, "icon": "shield"},
        {"name": "Education Credential", "key": "education", "met": "DIPLOMA" in cred_types or "DEGREE" in cred_types, "icon": "graduation-cap"},
        {"name": "Skill Certification", "key": "skills", "met": "SKILL" in cred_types or "CERTIFICATE" in cred_types, "icon": "award"},
        {"name": "ZK Proof Generated", "key": "zk_proof", "met": zk_proofs > 0, "icon": "lock"},
        {"name": "Consent Ready", "key": "consent", "met": len(creds) > 0, "icon": "check-circle"},
    ]

    completed = sum(1 for r in requirements if r["met"])
    return TransitionStatus(
        stage="EDUCATION_TO_EMPLOYMENT",
        requirements=requirements,
        completed=completed,
        total=len(requirements),
        ready=completed == len(requirements),
    )


# ════════════════════════════════════════════════════════════
# USERS LIST
# ════════════════════════════════════════════════════════════

@app.get("/api/users/students", response_model=List[UserOut])
def list_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ("INSTITUTION", "EMPLOYER"):
        raise HTTPException(status_code=403, detail="Not authorized")
    students = db.query(User).filter(User.role == "STUDENT").all()
    return [UserOut.model_validate(s) for s in students]


# ════════════════════════════════════════════════════════════
# HELPERS
# ════════════════════════════════════════════════════════════

def _credential_to_out(cred: Credential, db: Session) -> CredentialOut:
    issuer = db.query(User).filter(User.id == cred.issuer_id).first()
    holder = db.query(User).filter(User.id == cred.holder_id).first()

    flags = db.query(CredentialIntelFlag).filter(
        (CredentialIntelFlag.credential_id_a == cred.id) | (CredentialIntelFlag.credential_id_b == cred.id),
        CredentialIntelFlag.resolved == False,
    ).all()
    q_status = "review_required" if len(flags) > 0 else "no_issues"
    q_score = 100
    for f in flags:
        if f.severity == "HIGH": q_score -= 20
        elif f.severity == "MEDIUM": q_score -= 10
        else: q_score -= 5
    q_score = max(0, q_score)

    return CredentialOut(
        id=cred.id,
        holder_id=cred.holder_id,
        issuer_id=cred.issuer_id,
        credential_type=cred.credential_type,
        credential_data=json.loads(cred.credential_data),
        credential_hash=cred.credential_hash,
        issued_at=cred.issued_at,
        expires_at=cred.expires_at,
        status=cred.status,
        issuer_name=issuer.organization or issuer.name if issuer else None,
        holder_name=holder.name if holder else None,
        revocation_reason=cred.revocation_reason,
        quality_status=q_status,
        quality_score=q_score,
    )


def _consent_to_out(consent: ConsentRequest, db: Session) -> ConsentRequestOut:
    cred_ids = json.loads(consent.requested_credential_ids)
    creds = []
    for cid in cred_ids:
        c = db.query(Credential).filter(Credential.id == cid).first()
        if c:
            creds.append(_credential_to_out(c, db))

    fields = json.loads(consent.requested_fields)
    # Compute over-share warnings inline
    warnings = compute_overshare_warnings(fields, consent.role_context, consent.purpose)
    warning_messages = [f"{w.field}: {w.reason}" for w in warnings] if warnings else None

    return ConsentRequestOut(
        id=consent.id,
        requester_id=consent.requester_id,
        holder_id=consent.holder_id,
        requester_name=consent.requester_name,
        requested_credential_ids=cred_ids,
        requested_fields=fields,
        message=consent.message,
        purpose=consent.purpose,
        role_context=consent.role_context,
        status=consent.status,
        verification_token=consent.verification_token,
        created_at=consent.created_at,
        expires_at=consent.expires_at,
        responded_at=consent.responded_at,
        credentials=creds if creds else None,
        overshare_warnings=warning_messages,
    )


def _verify_credential(
    cred: Credential,
    db: Session,
    tampered_data: dict = None,
    consent_id: str = None,
) -> VerificationResult:
    holder = db.query(User).filter(User.id == cred.holder_id).first()
    issuer = db.query(User).filter(User.id == cred.issuer_id).first()
    cred_data = json.loads(cred.credential_data)

    sig_valid = verify_signature(cred.credential_hash, cred.signature)
    check_data = tampered_data if tampered_data else cred_data
    integrity_valid = verify_integrity(check_data, cred.credential_hash)

    if cred.status == "REVOKED":
        revocation_status = "REVOKED"
    elif cred.status == "EXPIRED" or (cred.expires_at and cred.expires_at < datetime.now(timezone.utc)):
        revocation_status = "EXPIRED"
    else:
        revocation_status = "ACTIVE"

    consent_valid = True
    if consent_id:
        consent = db.query(ConsentRequest).filter(ConsentRequest.id == consent_id).first()
        consent_valid = consent and consent.status == "APPROVED"

    if not integrity_valid:
        overall = "TAMPERED"
        reason = "Credential data does not match the issuer-signed record. Data has been tampered with."
    elif not sig_valid:
        overall = "INVALID"
        reason = "Digital signature verification failed."
    elif revocation_status == "REVOKED":
        overall = "REVOKED"
        reason = f"Credential withdrawn by issuer. Reason: {cred.revocation_reason or 'No reason provided'}"
    elif revocation_status == "EXPIRED":
        overall = "EXPIRED"
        reason = "Credential has expired."
    elif not consent_valid:
        overall = "INVALID"
        reason = "Consent not granted for this verification."
    else:
        overall = "VALID"
        reason = "All checks passed. Credential is authentic and valid."

    # Compute Credential Intelligence Quality Report for verification
    other_creds = db.query(Credential).filter(
        Credential.holder_id == cred.holder_id,
        Credential.id != cred.id,
    ).all()
    q_report = run_credential_quality_check(
        credential_id=cred.id,
        credential_type=cred.credential_type,
        credential_data=check_data,
        expires_at=cred.expires_at,
        issuer_user=issuer,
        existing_credentials=other_creds,
    )

    return VerificationResult(
        credential_id=cred.id,
        candidate_name=holder.name if holder else None,
        institution_name=issuer.organization or issuer.name if issuer else None,
        credential_type=cred.credential_type,
        credential_data=cred_data,
        signature_valid=sig_valid,
        integrity_valid=integrity_valid,
        revocation_status=revocation_status,
        consent_valid=consent_valid,
        overall_status=overall,
        reason=reason,
        issued_at=cred.issued_at,
        quality_status=q_report["status"],
        quality_score=q_report["quality_score"],
        quality_issues=q_report["issues"],
        quality_comparisons=q_report["comparisons"],
    )
