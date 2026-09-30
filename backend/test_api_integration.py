# -*- coding: utf-8 -*-
"""
End-to-end test for FastAPI intelligence endpoints and verification flow.
"""
import sys
import io

# Force stdout/stderr to utf-8 to prevent Windows cp1252 print crashes
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from app.database import get_db, SessionLocal
from app.models import User, Credential
from app.schemas import (
    CredentialCreate,
    CredentialQualityCheckRequest,
    RecordCompareRequest,
    VerificationRequest
)
from app.main import (
    issue_credential,
    check_credential_intelligence,
    compare_credentials_endpoint,
    get_credential_intelligence_endpoint,
    verify_credential_direct
)

def run_tests():
    db = SessionLocal()
    try:
        institution = db.query(User).filter(User.email == "admin@abcpoly.edu.in").first()
        student = db.query(User).filter(User.email == "parth@lifekey.id").first()
        ananya = db.query(User).filter(User.email == "ananya@lifekey.id").first()
        assert institution is not None, "Institution not found"
        assert student is not None, "Student Parth not found"
        assert ananya is not None, "Student Ananya not found"

        print("[TEST 1] Testing POST /api/credentials/intelligence/check (pre-flight check)...")
        check_req = CredentialQualityCheckRequest(
            holder_email=ananya.email,
            credential_type="DEGREE",
            credential_data={
                "title": "Bachelor of Technology - Information Tech",
                "institution": "ABC College of Technology",
                "graduation_year": "2027"
            }
        )
        report = check_credential_intelligence(check_req, db=db, current_user=institution)
        print(f"  Status: {report.status}")
        print(f"  Score: {report.quality_score}")
        print(f"  Checks: {report.checks}")
        print(f"  Issues count: {len(report.issues)}")
        for iss in report.issues:
            itype = iss.get("type", "") if isinstance(iss, dict) else getattr(iss, "type", "")
            imsg = iss.get("message", "") if isinstance(iss, dict) else getattr(iss, "message", "")
            print(f"    - [{itype.upper()}] {imsg}")
        assert (report.checks.get("similar") if isinstance(report.checks, dict) else report.checks.similar) is True, "Expected similarity check to flag"
        print("  [PASSED] Pre-flight intelligence check verified.")

        print("\n[TEST 2] Testing side-by-side Record Comparison endpoint...")
        # Get Ananya's credentials
        ananya_creds = db.query(Credential).filter(Credential.holder_id == ananya.id).all()
        assert len(ananya_creds) >= 2, f"Expected at least 2 credentials for Ananya, got {len(ananya_creds)}"
        
        comp_req = RecordCompareRequest(
            credential_id_a=ananya_creds[0].id,
            credential_id_b=ananya_creds[1].id
        )
        comp_result = compare_credentials_endpoint(comp_req, db=db, current_user=institution)
        rec_a = comp_result.get("record_a_id") if isinstance(comp_result, dict) else comp_result.record_a_id
        rec_b = comp_result.get("record_b_id") if isinstance(comp_result, dict) else comp_result.record_b_id
        c_count = comp_result.get("conflict_count") if isinstance(comp_result, dict) else comp_result.conflict_count
        sim_sc = comp_result.get("similarity_score") if isinstance(comp_result, dict) else comp_result.similarity_score
        fields = comp_result.get("comparison_fields", []) if isinstance(comp_result, dict) else getattr(comp_result, "comparison_fields", [])

        print(f"  Compared: {rec_a} vs {rec_b}")
        print(f"  Conflict count: {c_count}")
        for field in fields:
            fname = field.get("field_name") if isinstance(field, dict) else field.field_name
            va = field.get("record_a_value") if isinstance(field, dict) else getattr(field, "record_a_value", "")
            vb = field.get("record_b_value") if isinstance(field, dict) else getattr(field, "record_b_value", "")
            is_c = field.get("is_conflict") if isinstance(field, dict) else field.is_conflict
            flag = " [!] CONFLICT" if is_c else ""
            print(f"    {str(fname):20}: {str(va):25} | {str(vb):25}{flag}")
        assert c_count >= 1, "Expected at least 1 conflict detected"
        print("  [PASSED] Side-by-side comparison verified.")

        print("\n[TEST 3] Testing GET /api/credentials/{credential_id}/intelligence...")
        cred_intel = get_credential_intelligence_endpoint(ananya_creds[0].id, db=db, current_user=institution)
        print(f"  Status: {cred_intel.status}")
        print(f"  Issues: {len(cred_intel.issues)}")
        assert cred_intel.credential_id == ananya_creds[0].id
        print("  [PASSED] Single credential intelligence query verified.")

        print("\n[TEST 4] Testing Direct Verification with QA Intelligence Results...")
        verif = verify_credential_direct(
            VerificationRequest(credential_id=ananya_creds[0].id),
            db=db,
            current_user=institution
        )
        print(f"  Integrity Valid: {verif.integrity_valid}")
        print(f"  Signature Valid: {verif.signature_valid}")
        print(f"  Revocation Status: {verif.revocation_status}")
        print(f"  Overall Status: {verif.overall_status}")
        print(f"  QA Status: {verif.quality_status}")
        print(f"  QA Score: {verif.quality_score}")
        print(f"  QA Issues count: {len(verif.quality_issues or [])}")
        assert verif.integrity_valid is True, "Integrity should remain intact"
        assert verif.signature_valid is True, "Digital signature should remain intact"
        assert verif.quality_status == "review_required", "Quality status should flag for review"
        print("  [PASSED] Verification with non-destructive Intelligence check passed!")

        print("\n=======================================================")
        print("ALL END-TO-END API & INTELLIGENCE INTEGRATION TESTS PASSED!")
        print("=======================================================")

    finally:
        db.close()

if __name__ == "__main__":
    run_tests()
