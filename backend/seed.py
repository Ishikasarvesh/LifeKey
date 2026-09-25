"""
LIFEKEY — Database Seeder
Seeds initial demo accounts, cryptographically signed credentials, ZK proofs,
burn tokens, and consent requests with purpose-bound fields.
"""
import json
import secrets
import hashlib
from datetime import datetime, timezone, timedelta
from app.database import engine, SessionLocal, Base
from app.models import (
    User, Credential, ConsentRequest, VerificationLog,
    ZKProof, BurnToken, CredentialIntelFlag
)
from app.auth import hash_password
from app.crypto import hash_credential, sign_credential

def seed_database():
    print("[LIFEKEY] Resetting database schema and tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("[LIFEKEY] Seeding users...")

    # 1. Student
    student = User(
        name="Parth Patil",
        email="parth@lifekey.id",
        password_hash=hash_password("password123"),
        role="STUDENT",
        organization=None,
    )
    db.add(student)

    # 2. Institution
    institution = User(
        name="Dr. Arvind Sharma",
        email="admin@abcpoly.edu.in",
        password_hash=hash_password("password123"),
        role="INSTITUTION",
        organization="ABC Polytechnic Institute",
    )
    db.add(institution)

    # 3. Employer
    employer = User(
        name="Priya Nair",
        email="hr@technova.com",
        password_hash=hash_password("password123"),
        role="EMPLOYER",
        organization="TechNova Pvt Ltd",
    )
    db.add(employer)
    db.commit()
    db.refresh(student)
    db.refresh(institution)
    db.refresh(employer)

    print(f"Created student ({student.id}), institution ({institution.id}), employer ({employer.id})")

    # 4. Issue Credential 1: Diploma in AI & ML
    cred1_data = {
        "title": "Diploma in Artificial Intelligence & Machine Learning",
        "major": "Computer Science & AI",
        "cgpa": "8.85",
        "scale": "10.0",
        "graduation_year": "2026",
        "registration_no": "ABC-2023-AIML-042",
        "status": "First Class with Distinction",
        "_meta": {
            "issuer_id": institution.id,
            "issuer_name": institution.organization,
            "holder_id": student.id,
            "holder_name": student.name,
            "credential_type": "DIPLOMA",
            "issued_at": datetime.now(timezone.utc).isoformat(),
        }
    }
    cred1_hash = hash_credential(cred1_data)
    cred1_sig = sign_credential(cred1_hash)

    cred1 = Credential(
        holder_id=student.id,
        issuer_id=institution.id,
        credential_type="DIPLOMA",
        credential_data=json.dumps(cred1_data),
        credential_hash=cred1_hash,
        signature=cred1_sig,
        status="ACTIVE",
    )
    db.add(cred1)

    # 5. Issue Credential 2: Skill Credential (Python & ML)
    cred2_data = {
        "title": "Certified Applied AI & Machine Learning Specialist",
        "skills": ["Python", "Machine Learning", "PyTorch", "SQL", "React"],
        "proficiency": "Advanced",
        "assessment_score": "94/100",
        "proctor_verified": True,
        "_meta": {
            "issuer_id": institution.id,
            "issuer_name": institution.organization,
            "holder_id": student.id,
            "holder_name": student.name,
            "credential_type": "SKILL",
            "issued_at": datetime.now(timezone.utc).isoformat(),
        }
    }
    cred2_hash = hash_credential(cred2_data)
    cred2_sig = sign_credential(cred2_hash)

    cred2 = Credential(
        holder_id=student.id,
        issuer_id=institution.id,
        credential_type="SKILL",
        credential_data=json.dumps(cred2_data),
        credential_hash=cred2_hash,
        signature=cred2_sig,
        status="ACTIVE",
    )
    db.add(cred2)

    # 6. Issue Credential 3: Certificate in Full Stack Cloud Architecture
    cred3_data = {
        "title": "Certificate in Cloud Architecture & Modern Web Systems",
        "duration_hours": 120,
        "completion_date": "2026-05-15",
        "accreditation": "AICTE-Approved Skill Initiative",
        "_meta": {
            "issuer_id": institution.id,
            "issuer_name": institution.organization,
            "holder_id": student.id,
            "holder_name": student.name,
            "credential_type": "CERTIFICATE",
            "issued_at": datetime.now(timezone.utc).isoformat(),
        }
    }
    cred3_hash = hash_credential(cred3_data)
    cred3_sig = sign_credential(cred3_hash)

    cred3 = Credential(
        holder_id=student.id,
        issuer_id=institution.id,
        credential_type="CERTIFICATE",
        credential_data=json.dumps(cred3_data),
        credential_hash=cred3_hash,
        signature=cred3_sig,
        status="ACTIVE",
    )
    db.add(cred3)
    db.commit()
    db.refresh(cred1)
    db.refresh(cred2)
    db.refresh(cred3)

    print("Created 3 signed credentials")

    # 7. Pre-configured Approved Consent Request for Demo
    demo_token = "lifekey_demo_token_xyz890"
    approved_consent = ConsentRequest(
        requester_id=employer.id,
        holder_id=student.id,
        requester_name=employer.organization,
        requested_credential_ids=json.dumps([cred1.id, cred2.id]),
        requested_fields=json.dumps(["title", "major", "cgpa", "skills", "status"]),
        message="Verification required for Junior AI Engineer position at TechNova Pvt Ltd.",
        purpose="Employment background verification",
        role_context="Junior AI Engineer — Remote",
        status="APPROVED",
        verification_token=demo_token,
        expires_at=datetime.now(timezone.utc) + timedelta(days=14),
        responded_at=datetime.now(timezone.utc) - timedelta(hours=2),
    )
    db.add(approved_consent)

    # 8. Pending Consent Request for Interactive Live Approval Demo
    pending_consent = ConsentRequest(
        requester_id=employer.id,
        holder_id=student.id,
        requester_name=employer.organization,
        requested_credential_ids=json.dumps([cred3.id]),
        requested_fields=json.dumps(["title", "duration_hours", "accreditation"]),
        message="Additional verification for Cloud Certification requirement.",
        purpose="Cloud architecture skills audit",
        role_context="Junior Cloud Specialist",
        status="PENDING",
        verification_token=None,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )
    db.add(pending_consent)
    db.commit()
    db.refresh(approved_consent)

    # 9. Pre-seed ZK Proof for Demo
    zk_input = f"{cred1.credential_hash}:cgpa:>:8.0"
    zk_hash = hashlib.sha256(zk_input.encode()).hexdigest()
    zk_proof = ZKProof(
        credential_id=cred1.id,
        holder_id=student.id,
        attribute="cgpa",
        predicate=">",
        threshold="8.0",
        result=True,
        proof_hash=zk_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
    )
    db.add(zk_proof)

    # 10. Pre-seed Burn Token for Demo
    burn_token = BurnToken(
        token=secrets.token_urlsafe(32),
        consent_id=approved_consent.id,
        holder_id=student.id,
        is_burned=False,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=15),
    )
    db.add(burn_token)
    db.commit()

    print(f"[LIFEKEY] Database seeded successfully!")
    print(f"  • Student: parth@lifekey.id / password123")
    print(f"  • Institution: admin@abcpoly.edu.in / password123")
    print(f"  • Employer: hr@technova.com / password123")
    print(f"  • Demo QR Token: {demo_token}")
    print(f"  • Demo Burn Token: {burn_token.token}")
    db.close()

if __name__ == "__main__":
    seed_database()
