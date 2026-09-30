"""
LIFEKEY — Credential Intelligence & Duplicate Detection Test Suite
Validates all 8 detection scenarios:
A. Perfect credential → No issues
B. Exact duplicate → Duplicate detected
C. Similar credential → Similarity warning
D. Conflicting graduation year → Conflict warning
E. Missing graduation year → Missing field warning
F. Expired credential → Expired warning
G. Issuer mismatch → Issuer consistency warning
H. Multiple issues at once → All issues shown together
"""

import sys
import os
import json
from datetime import datetime, timezone, timedelta

# Ensure backend root is on python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Ensure clean UTF-8 printing on Windows terminals
if sys.platform.startswith("win"):
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

from app.database import engine, SessionLocal, Base
from app.models import User, Credential
from app.intelligence import (
    clean_basic_text,
    normalize_text,
    compute_similarity,
    check_missing_fields,
    check_expiry,
    check_issuer_consistency,
    check_exact_duplicate,
    check_similar_credential,
    check_field_conflicts,
    build_record_comparison,
    run_credential_quality_check,
)


class MockUser:
    def __init__(self, id, name, organization, role="INSTITUTION"):
        self.id = id
        self.name = name
        self.organization = organization
        self.role = role


class MockCredential:
    def __init__(self, id, credential_type, credential_data, issuer_id="inst_1", expires_at=None):
        self.id = id
        self.credential_type = credential_type
        self.credential_data = credential_data
        self.issuer_id = issuer_id
        self.expires_at = expires_at


def run_tests():
    print("=" * 60)
    print("RUNNING LIFEKEY CREDENTIAL INTELLIGENCE ENGINE TESTS")
    print("=" * 60)

    registered_institution = MockUser(
        id="inst_1",
        name="Dr. Arvind Sharma",
        organization="ABC Polytechnic Institute",
    )

    base_credential = MockCredential(
        id="cred_base_001",
        credential_type="DIPLOMA",
        credential_data={
            "title": "B.Tech Information Technology",
            "major": "Information Technology",
            "cgpa": "8.85",
            "graduation_year": "2026",
            "registration_no": "ABC-2022-IT-101",
            "institution": "ABC Polytechnic Institute",
            "_meta": {
                "issuer_id": "inst_1",
                "issuer_name": "ABC Polytechnic Institute",
                "holder_name": "Parth Patil",
                "credential_type": "DIPLOMA",
            }
        },
        issuer_id="inst_1",
    )

    existing_creds = [base_credential]

    # ─────────────────────────────────────────────────────────────
    # Scenario A: Perfect Credential (No issues)
    # ─────────────────────────────────────────────────────────────
    print("\n[TEST A] Perfect Credential → Expect: No Issues")
    perfect_payload = {
        "title": "Certified Cloud Architect",
        "major": "Cloud Infrastructure",
        "cgpa": "9.20",
        "graduation_year": "2026",
        "registration_no": "ABC-2022-CLOUD-01",
        "institution": "ABC Polytechnic Institute",
        "_meta": {
            "issuer_id": "inst_1",
            "issuer_name": "ABC Polytechnic Institute",
            "holder_name": "Parth Patil",
            "credential_type": "DIPLOMA",
        }
    }
    res_a = run_credential_quality_check(
        credential_id="cred_perfect",
        credential_type="DIPLOMA",
        credential_data=perfect_payload,
        expires_at=None,
        issuer_user=registered_institution,
        existing_credentials=existing_creds,
    )
    assert res_a["status"] == "no_issues", f"Expected 'no_issues', got {res_a['status']}"
    assert len(res_a["issues"]) == 0, f"Expected 0 issues, got {len(res_a['issues'])}"
    assert res_a["quality_score"] == 100, f"Expected 100 score, got {res_a['quality_score']}"
    print("✓ Scenario A PASSED: Perfect record verified with 100% QA score.")

    # ─────────────────────────────────────────────────────────────
    # Scenario B: Exact Duplicate
    # ─────────────────────────────────────────────────────────────
    print("\n[TEST B] Exact Duplicate → Expect: Duplicate Detected")
    duplicate_payload = {
        "title": "b.tech information technology",  # Case & punctuation variation
        "major": "Information Technology",
        "cgpa": "8.85",
        "graduation_year": "2026",
        "registration_no": "ABC-2022-IT-101",
        "institution": "ABC Polytechnic Institute",
        "_meta": {
            "issuer_id": "inst_1",
            "issuer_name": "ABC Polytechnic Institute",
            "holder_name": "Parth Patil",
            "credential_type": "DIPLOMA",
        }
    }
    res_b = run_credential_quality_check(
        credential_id="cred_duplicate",
        credential_type="DIPLOMA",
        credential_data=duplicate_payload,
        expires_at=None,
        issuer_user=registered_institution,
        existing_credentials=existing_creds,
    )
    assert res_b["status"] == "review_required"
    assert res_b["checks"]["duplicate"] is True, "Expected duplicate check to be True"
    assert any(i["type"] == "duplicate" for i in res_b["issues"]), "Expected duplicate issue flag"
    print("✓ Scenario B PASSED: Exact duplicate detected and flagged for human review.")

    # ─────────────────────────────────────────────────────────────
    # Scenario C: Similar Credential
    # ─────────────────────────────────────────────────────────────
    print("\n[TEST C] Similar Credential → Expect: Similarity Warning")
    similar_payload = {
        "title": "Bachelor of Technology - IT",  # Degree synonym + abbreviation variation
        "major": "Information Technology",
        "cgpa": "8.80",
        "graduation_year": "2026",
        "institution": "ABC Polytechnic Institute",
        "_meta": {
            "issuer_id": "inst_1",
            "issuer_name": "ABC Polytechnic Institute",
            "holder_name": "Parth Patil",
            "credential_type": "DIPLOMA",
        }
    }
    res_c = run_credential_quality_check(
        credential_id="cred_similar",
        credential_type="DIPLOMA",
        credential_data=similar_payload,
        expires_at=None,
        issuer_user=registered_institution,
        existing_credentials=existing_creds,
        threshold=0.75,
    )
    assert res_c["status"] == "review_required"
    assert res_c["checks"]["similar"] is True, "Expected similar check to be True"
    similar_issue = next(i for i in res_c["issues"] if i["type"] == "similar")
    assert similar_issue["similarity_score"] >= 0.75
    print(f"✓ Scenario C PASSED: Similar credential detected (Score: {similar_issue['similarity_score']}).")

    # ─────────────────────────────────────────────────────────────
    # Scenario D: Conflicting Graduation Year
    # ─────────────────────────────────────────────────────────────
    print("\n[TEST D] Conflicting Graduation Year → Expect: Conflict Warning")
    conflict_payload = {
        "title": "B.Tech Computer Systems",
        "major": "Computer Systems",
        "cgpa": "8.50",
        "graduation_year": "2025",  # Base record states 2026
        "institution": "ABC Polytechnic Institute",
        "_meta": {
            "issuer_id": "inst_1",
            "issuer_name": "ABC Polytechnic Institute",
            "holder_name": "Parth Patil",
            "credential_type": "DIPLOMA",
        }
    }
    res_d = run_credential_quality_check(
        credential_id="cred_conflict",
        credential_type="DIPLOMA",
        credential_data=conflict_payload,
        expires_at=None,
        issuer_user=registered_institution,
        existing_credentials=existing_creds,
    )
    assert res_d["status"] == "review_required"
    assert res_d["checks"]["conflict"] is True, "Expected conflict check to be True"
    conflict_issue = next(i for i in res_d["issues"] if i["type"] == "conflict")
    assert conflict_issue["field"] == "graduation_year"
    assert conflict_issue["value_1"] == "2025"
    assert conflict_issue["value_2"] == "2026"
    assert conflict_issue["action"] == "Re-verification required."
    print("✓ Scenario D PASSED: Graduation year mismatch (2025 vs 2026) flagged for re-verification.")

    # ─────────────────────────────────────────────────────────────
    # Scenario E: Missing Required Field
    # ─────────────────────────────────────────────────────────────
    print("\n[TEST E] Missing Graduation Year → Expect: Missing Field Warning")
    missing_payload = {
        "title": "Diploma in Mechanical Engineering",
        "major": "Mechanical",
        "cgpa": "7.90",
        # "graduation_year" is intentionally omitted
        "institution": "ABC Polytechnic Institute",
        "_meta": {
            "issuer_id": "inst_1",
            "issuer_name": "ABC Polytechnic Institute",
            "holder_name": "Parth Patil",
            "credential_type": "DIPLOMA",
        }
    }
    res_e = run_credential_quality_check(
        credential_id="cred_missing",
        credential_type="DIPLOMA",
        credential_data=missing_payload,
        expires_at=None,
        issuer_user=registered_institution,
        existing_credentials=[],
    )
    assert res_e["status"] == "review_required"
    assert res_e["checks"]["missing_fields"] is True, "Expected missing_fields check to be True"
    missing_issue = next(i for i in res_e["issues"] if i["type"] == "missing_field")
    assert missing_issue["field"] == "graduation_year"
    print("✓ Scenario E PASSED: Missing required field 'graduation_year' identified.")

    # ─────────────────────────────────────────────────────────────
    # Scenario F: Expired Credential
    # ─────────────────────────────────────────────────────────────
    print("\n[TEST F] Expired Credential → Expect: Expired Warning")
    past_date = datetime.now(timezone.utc) - timedelta(days=90)
    expired_payload = {
        "title": "Certified Cybersecurity Specialist",
        "valid_until": past_date.strftime("%Y-%m-%d"),
        "institution": "ABC Polytechnic Institute",
        "_meta": {
            "issuer_id": "inst_1",
            "issuer_name": "ABC Polytechnic Institute",
            "holder_name": "Parth Patil",
            "credential_type": "CERTIFICATE",
        }
    }
    res_f = run_credential_quality_check(
        credential_id="cred_expired",
        credential_type="CERTIFICATE",
        credential_data=expired_payload,
        expires_at=past_date,
        issuer_user=registered_institution,
        existing_credentials=[],
    )
    assert res_f["status"] == "review_required"
    assert res_f["checks"]["expired"] is True, "Expected expired check to be True"
    expired_issue = next(i for i in res_f["issues"] if i["type"] == "expired")
    print(f"✓ Scenario F PASSED: Expired credential flagged ({expired_issue['message']}).")

    # ─────────────────────────────────────────────────────────────
    # Scenario G: Issuer Mismatch
    # ─────────────────────────────────────────────────────────────
    print("\n[TEST G] Issuer Mismatch → Expect: Issuer Consistency Warning")
    mismatch_payload = {
        "title": "Certificate in Applied Robotics",
        "institution": "Global Cybernetics University",  # Not registered "ABC Polytechnic Institute"
        "completion_date": "2026-04-10",
        "_meta": {
            "issuer_name": "Global Cybernetics University",
            "holder_name": "Parth Patil",
            "credential_type": "CERTIFICATE",
        }
    }
    res_g = run_credential_quality_check(
        credential_id="cred_mismatch",
        credential_type="CERTIFICATE",
        credential_data=mismatch_payload,
        expires_at=None,
        issuer_user=registered_institution,
        existing_credentials=[],
    )
    assert res_g["status"] == "review_required"
    assert res_g["checks"]["issuer_consistency"] is False, "Expected issuer consistency to be False (mismatch)"
    issuer_issue = next(i for i in res_g["issues"] if i["type"] == "issuer_consistency")
    print(f"✓ Scenario G PASSED: Issuer mismatch flagged without claiming fraud ({issuer_issue['message']}).")

    # ─────────────────────────────────────────────────────────────
    # Scenario H: Multiple Issues at Once
    # ─────────────────────────────────────────────────────────────
    print("\n[TEST H] Multiple Issues at Once → Expect: All Issues Shown Together")
    multiple_payload = {
        "title": "Bachelor of Technology - IT",  # Similar to base
        "major": "Information Technology",
        # Missing "cgpa"
        "graduation_year": "2024",  # Conflicting with base (2026)
        "institution": "Different Institute of Tech",  # Issuer mismatch
        "_meta": {
            "issuer_name": "Different Institute of Tech",
            "holder_name": "Parth Patil",
            "credential_type": "DIPLOMA",
        }
    }
    res_h = run_credential_quality_check(
        credential_id="cred_multi",
        credential_type="DIPLOMA",
        credential_data=multiple_payload,
        expires_at=past_date,  # Also expired
        issuer_user=registered_institution,
        existing_credentials=existing_creds,
    )
    assert res_h["status"] == "review_required"
    issue_types = {i["type"] for i in res_h["issues"]}
    print("Detected issue types in compound test:", issue_types)
    assert "similar" in issue_types, "Expected 'similar' in issues"
    assert "conflict" in issue_types, "Expected 'conflict' in issues"
    assert "missing_field" in issue_types, "Expected 'missing_field' in issues"
    assert "expired" in issue_types, "Expected 'expired' in issues"
    assert "issuer_consistency" in issue_types, "Expected 'issuer_consistency' in issues"
    print(f"✓ Scenario H PASSED: All 5 distinct issues flagged concurrently in single report!")

    # ─────────────────────────────────────────────────────────────
    # Side-by-Side Record Comparison Test
    # ─────────────────────────────────────────────────────────────
    print("\n[TEST COMPARISON] Side-by-Side Comparison Generator")
    comparison = build_record_comparison(
        cred_a_id="cred_1",
        cred_a_title="B.Tech IT (2026)",
        cred_a_data=base_credential.credential_data,
        cred_b_id="cred_2",
        cred_b_title="B.Tech IT (2025)",
        cred_b_data=conflict_payload,
        conflicts=[{
            "field": "graduation_year",
            "field_label": "Graduation Year",
            "value_1": "2026",
            "value_2": "2025",
        }],
    )
    assert comparison["record_a_id"] == "cred_1"
    assert comparison["record_b_id"] == "cred_2"
    grad_field = next(f for f in comparison["comparison_fields"] if f["field_key"] == "graduation_year")
    assert grad_field["is_conflict"] is True, "Graduation year should be flagged as conflict"
    assert grad_field["record_a_value"] == "2026"
    assert grad_field["record_b_value"] == "2025"
    print("✓ Side-by-side comparison table correctly built and highlights conflict field.")

    print("\n" + "=" * 60)
    print("ALL 8 SCENARIOS + COMPARISON TESTS PASSED PERFECTLY!")
    print("=" * 60)


if __name__ == "__main__":
    run_tests()
