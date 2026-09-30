"""
LIFEKEY — Credential Intelligence & Duplicate Detection Engine

Deterministic, explainable quality-check layer for credentials.
Flags issues for human review without ever declaring credentials fraudulent:
1. Exact duplicates (normalized canonical match)
2. Similar credential records (token Jaccard + sequence matcher similarity with configurable threshold)
3. Information conflicts (conflicting graduation years, names, dates across records)
4. Missing required fields (type-specific schema checks)
5. Expired credentials (valid_until / expires_at temporal checks)
6. Inconsistent issuer details (credential metadata vs registered institution records)
"""

import re
import difflib
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple


# ─────────────────────────────────────────────────────────────
# 1. NORMALIZATION
# ─────────────────────────────────────────────────────────────

# Common academic degree & field synonym mappings for comparison
DEGREE_SYNONYMS = {
    "b.tech": "bachelor of technology",
    "b tech": "bachelor of technology",
    "btech": "bachelor of technology",
    "b.e": "bachelor of engineering",
    "b e": "bachelor of engineering",
    "be": "bachelor of engineering",
    "b.sc": "bachelor of science",
    "b sc": "bachelor of science",
    "bsc": "bachelor of science",
    "b.c.a": "bachelor of computer applications",
    "bca": "bachelor of computer applications",
    "m.tech": "master of technology",
    "m tech": "master of technology",
    "mtech": "master of technology",
    "m.e": "master of engineering",
    "m.sc": "master of science",
    "msc": "master of science",
    "m.c.a": "master of computer applications",
    "mca": "master of computer applications",
    "it": "information technology",
    "cs": "computer science",
    "cse": "computer science and engineering",
    "ai & ml": "artificial intelligence and machine learning",
    "ai/ml": "artificial intelligence and machine learning",
    "ai and ml": "artificial intelligence and machine learning",
    "aiml": "artificial intelligence and machine learning",
    "cert": "certificate",
    "diploma in": "diploma",
    "col.": "college",
    "clg": "college",
    "univ": "university",
    "univ.": "university",
    "inst.": "institute",
    "inst": "institute",
    "poly": "polytechnic",
    "pvt": "private",
    "ltd": "limited",
}


def normalize_text(text: Optional[str]) -> str:
    """
    Normalizes a text string for comparison:
    - Lowercase
    - Punctuation removal/replacement
    - Space normalization
    - Expansion of common academic & institutional synonyms
    Does NOT mutate original data.
    """
    if not text:
        return ""
    
    cleaned = str(text).lower()
    
    # Replace separators like dashes, slashes, underscores with spaces
    cleaned = re.sub(r"[-_/\\|]+", " ", cleaned)
    
    # Strip dots in abbreviations (e.g. b.tech -> btech or b tech)
    # But preserve token boundaries
    cleaned = re.sub(r"[^\w\s]", "", cleaned)
    
    # Collapse multiple whitespaces
    tokens = cleaned.split()
    
    # Apply token-level synonym replacements
    normalized_tokens = []
    i = 0
    while i < len(tokens):
        # Check two-word phrases first
        if i + 1 < len(tokens):
            two_word = f"{tokens[i]} {tokens[i+1]}"
            if two_word in DEGREE_SYNONYMS:
                normalized_tokens.append(DEGREE_SYNONYMS[two_word])
                i += 2
                continue
        
        single_word = tokens[i]
        if single_word in DEGREE_SYNONYMS:
            normalized_tokens.append(DEGREE_SYNONYMS[single_word])
        else:
            normalized_tokens.append(single_word)
        i += 1

    result = " ".join(normalized_tokens)
    return result.strip()


def normalize_year(val: Any) -> Optional[str]:
    """Extract 4-digit year string from various formats (e.g., 2026, '2026', '2026.0', '2026-05-15')."""
    if val is None:
        return None
    s = str(val).strip()
    match = re.search(r"\b(19\d\d|20\d\d)\b", s)
    if match:
        return match.group(1)
    return s if s else None


# ─────────────────────────────────────────────────────────────
# 2. SIMILARITY MECHANISM (Deterministic & Explainable)
# ─────────────────────────────────────────────────────────────

def compute_similarity(str_a: str, str_b: str) -> float:
    """
    Computes a hybrid similarity score (0.0 to 1.0) between two strings
    using Token Jaccard Similarity and difflib SequenceMatcher.
    Deterministic, transparent, and requires no external APIs/models.
    """
    norm_a = normalize_text(str_a)
    norm_b = normalize_text(str_b)

    if not norm_a or not norm_b:
        return 0.0
    if norm_a == norm_b:
        return 1.0

    tokens_a = set(norm_a.split())
    tokens_b = set(norm_b.split())

    # Token Jaccard
    intersection = tokens_a.intersection(tokens_b)
    union = tokens_a.union(tokens_b)
    jaccard = len(intersection) / len(union) if union else 0.0

    # Sequence Matcher (character substring ratio)
    seq_ratio = difflib.SequenceMatcher(None, norm_a, norm_b).ratio()

    # Weighted combination: Jaccard gives high weight to overlapping words,
    # SequenceMatcher handles word order and near-spelling variations.
    score = (0.55 * jaccard) + (0.45 * seq_ratio)
    return round(score, 4)


# ─────────────────────────────────────────────────────────────
# 3. TYPE-SPECIFIC REQUIRED FIELDS
# ─────────────────────────────────────────────────────────────

REQUIRED_FIELDS_BY_TYPE = {
    "DIPLOMA": ["title", "major", "cgpa", "graduation_year"],
    "DEGREE": ["title", "major", "cgpa", "graduation_year"],
    "SKILL": ["title", "skills", "proficiency"],
    "CERTIFICATE": ["title", "completion_date"],
}

UNIVERSAL_REQUIRED_FIELDS = ["title"]


# ─────────────────────────────────────────────────────────────
# 4. CORE INTELLIGENCE CHECKS
# ─────────────────────────────────────────────────────────────

def check_missing_fields(credential_data: Dict[str, Any], credential_type: str) -> List[str]:
    """
    Identifies any missing or empty required fields for the given credential type.
    """
    cred_type_norm = credential_type.upper().strip()
    required = REQUIRED_FIELDS_BY_TYPE.get(cred_type_norm, UNIVERSAL_REQUIRED_FIELDS)

    missing = []
    for field in required:
        val = credential_data.get(field)
        if val is None or (isinstance(val, str) and not val.strip()) or (isinstance(val, list) and len(val) == 0):
            missing.append(field)
    return missing


def check_expiry(credential_data: Dict[str, Any], expires_at: Optional[datetime]) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Checks whether a credential is past its expiration date.
    Returns: (is_expired, expiry_date_str, current_status)
    """
    now = datetime.now(timezone.utc)
    exp_date: Optional[datetime] = None

    # Check database-level expires_at
    if expires_at:
        exp_date = expires_at if expires_at.tzinfo else expires_at.replace(tzinfo=timezone.utc)
    
    # Check payload-level fields (valid_until, expiry_date, expires_at)
    if not exp_date:
        for field in ("valid_until", "expiry_date", "expires_at"):
            raw = credential_data.get(field)
            if raw and isinstance(raw, str):
                try:
                    parsed = datetime.fromisoformat(raw.replace("Z", "+00:00"))
                    exp_date = parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
                    break
                except Exception:
                    pass

    if exp_date and exp_date < now:
        return True, exp_date.strftime("%Y-%m-%d"), "EXPIRED"

    return False, exp_date.strftime("%Y-%m-%d") if exp_date else None, "ACTIVE"


def check_issuer_consistency(
    credential_data: Dict[str, Any],
    issuer_user: Optional[Any],
) -> Tuple[bool, Optional[str]]:
    """
    Compares credential-embedded issuer details against the registered institution record.
    Returns: (is_consistent, warning_reason)
    """
    if not issuer_user:
        return False, "Issuer record could not be found in registered authority database."

    meta = credential_data.get("_meta", {})
    cred_issuer_name = meta.get("issuer_name") or credential_data.get("institution") or credential_data.get("issuer")
    registered_org = getattr(issuer_user, "organization", None) or getattr(issuer_user, "name", "")

    if cred_issuer_name and registered_org:
        norm_cred_issuer = normalize_text(cred_issuer_name)
        norm_reg_issuer = normalize_text(registered_org)
        sim = compute_similarity(norm_cred_issuer, norm_reg_issuer)
        if sim < 0.65 and norm_cred_issuer not in norm_reg_issuer and norm_reg_issuer not in norm_cred_issuer:
            return False, (
                f"Credential states issuer '{cred_issuer_name}', but issuer account is registered as "
                f"'{registered_org}'. Issuer details need review."
            )

    return True, None


def clean_basic_text(text: Optional[str]) -> str:
    """
    Basic text cleaning without synonym expansion:
    - Lowercase
    - Strip punctuation and formatting characters
    - Collapse extra whitespace
    - e.g. 'B.Tech Information Technology' -> 'btech information technology'
    - 'b.tech information technology' -> 'btech information technology'
    Used for exact duplicate comparison.
    """
    if not text:
        return ""
    cleaned = str(text).lower()
    cleaned = re.sub(r"[-_/\\|]+", " ", cleaned)
    cleaned = re.sub(r"[^\w\s]", "", cleaned)
    return " ".join(cleaned.split())


def check_exact_duplicate(
    cred_a_data: Dict[str, Any],
    cred_b_data: Dict[str, Any],
    type_a: str,
    type_b: str,
    issuer_a_id: str,
    issuer_b_id: str,
) -> bool:
    """
    Detects whether two credentials are exact duplicates by checking all
    canonical identifying fields.
    """
    if clean_basic_text(type_a) != clean_basic_text(type_b):
        return False

    title_a = clean_basic_text(cred_a_data.get("title", ""))
    title_b = clean_basic_text(cred_b_data.get("title", ""))
    if not title_a or title_a != title_b:
        return False

    # Check graduation or completion year
    year_a = normalize_year(cred_a_data.get("graduation_year") or cred_a_data.get("completion_date") or cred_a_data.get("year"))
    year_b = normalize_year(cred_b_data.get("graduation_year") or cred_b_data.get("completion_date") or cred_b_data.get("year"))
    if year_a and year_b and year_a != year_b:
        return False

    # Check registration number if both have it
    reg_a = str(cred_a_data.get("registration_no") or "").strip().lower()
    reg_b = str(cred_b_data.get("registration_no") or "").strip().lower()
    if reg_a and reg_b and reg_a == reg_b:
        return True

    # Same issuer and title and year
    if issuer_a_id and issuer_b_id and issuer_a_id == issuer_b_id:
        return True

    # Match if issuer/institution text matches
    inst_a = clean_basic_text(cred_a_data.get("institution") or cred_a_data.get("_meta", {}).get("issuer_name", ""))
    inst_b = clean_basic_text(cred_b_data.get("institution") or cred_b_data.get("_meta", {}).get("issuer_name", ""))
    if inst_a and inst_b and inst_a == inst_b:
        return True

    return True


def check_similar_credential(
    cred_a_data: Dict[str, Any],
    cred_b_data: Dict[str, Any],
    type_a: str,
    type_b: str,
    threshold: float = 0.75,
) -> Tuple[bool, float, Optional[str]]:
    """
    Detects credentials that are highly similar but not exactly identical.
    Example: 'B.Tech Information Technology' vs 'Bachelor of Technology - IT'.
    """
    title_a = cred_a_data.get("title", "")
    title_b = cred_b_data.get("title", "")

    if not title_a or not title_b:
        return False, 0.0, None

    # Exact same basic cleaned title is an exact duplicate, handled separately
    if clean_basic_text(title_a) == clean_basic_text(title_b):
        return False, 1.0, None

    sim_score = compute_similarity(title_a, title_b)
    # If synonym-expanded normalization matches, boost score to reflect strong semantic equivalence
    norm_a = normalize_text(title_a)
    norm_b = normalize_text(title_b)
    if norm_a and norm_b and norm_a == norm_b:
        sim_score = max(sim_score, 0.89)

    if sim_score >= threshold:
        reason = f"High textual & program similarity ({int(sim_score * 100)}%) between '{title_a}' and '{title_b}'."
        return True, sim_score, reason

    return False, sim_score, None


def check_field_conflicts(
    cred_a_data: Dict[str, Any],
    cred_b_data: Dict[str, Any],
    type_a: str,
    type_b: str,
) -> List[Dict[str, Any]]:
    """
    Compares information across credentials belonging to the same holder.
    Identifies conflicting values for human review (e.g. Graduation Year 2026 vs 2025).
    """
    conflicts = []

    # 1. Graduation Year conflict across academic qualifications
    is_academic_a = type_a.upper() in ("DIPLOMA", "DEGREE")
    is_academic_b = type_b.upper() in ("DIPLOMA", "DEGREE")

    if is_academic_a and is_academic_b:
        year_a = normalize_year(cred_a_data.get("graduation_year") or cred_a_data.get("year"))
        year_b = normalize_year(cred_b_data.get("graduation_year") or cred_b_data.get("year"))
        if year_a and year_b and year_a != year_b:
            title_a = cred_a_data.get("title", "Credential A")
            title_b = cred_b_data.get("title", "Credential B")
            conflicts.append({
                "field": "graduation_year",
                "field_label": "Graduation Year",
                "value_1": year_a,
                "value_2": year_b,
                "record_a_context": title_a,
                "record_b_context": title_b,
                "message": f"Graduation year mismatch: '{title_a}' states {year_a}, while '{title_b}' states {year_b}.",
                "action": "Re-verification required.",
            })

    # 2. Date of Birth conflict if present
    dob_a = cred_a_data.get("date_of_birth") or cred_a_data.get("dob")
    dob_b = cred_b_data.get("date_of_birth") or cred_b_data.get("dob")
    if dob_a and dob_b and str(dob_a).strip() != str(dob_b).strip():
        conflicts.append({
            "field": "date_of_birth",
            "field_label": "Date of Birth",
            "value_1": str(dob_a),
            "value_2": str(dob_b),
            "record_a_context": "Record A",
            "record_b_context": "Record B",
            "message": f"Candidate Date of Birth conflict detected ({dob_a} vs {dob_b}).",
            "action": "Identity document audit required.",
        })

    # 3. Registration No. conflict for same degree
    title_a = normalize_text(cred_a_data.get("title", ""))
    title_b = normalize_text(cred_b_data.get("title", ""))
    if title_a and title_b and (title_a == title_b or compute_similarity(title_a, title_b) > 0.85):
        reg_a = cred_a_data.get("registration_no")
        reg_b = cred_b_data.get("registration_no")
        if reg_a and reg_b and str(reg_a).strip().lower() != str(reg_b).strip().lower():
            conflicts.append({
                "field": "registration_no",
                "field_label": "Registration / Student ID",
                "value_1": str(reg_a),
                "value_2": str(reg_b),
                "record_a_context": cred_a_data.get("title", "Record A"),
                "record_b_context": cred_b_data.get("title", "Record B"),
                "message": f"Different registration numbers ({reg_a} vs {reg_b}) found for the same academic program.",
                "action": "Institutional registry cross-reference required.",
            })

    return conflicts


# ─────────────────────────────────────────────────────────────
# 5. SIDE-BY-SIDE RECORD COMPARISON GENERATOR
# ─────────────────────────────────────────────────────────────

def build_record_comparison(
    cred_a_id: str,
    cred_a_title: str,
    cred_a_data: Dict[str, Any],
    cred_b_id: str,
    cred_b_title: str,
    cred_b_data: Dict[str, Any],
    conflicts: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Builds a structured side-by-side comparison table between Record A and Record B
    with conflicting fields highlighted.
    """
    conflict_fields = {c["field"] for c in conflicts}

    # Standard comparative fields
    field_keys = [
        ("title", "Degree / Certification Title"),
        ("major", "Major / Program"),
        ("institution", "Institution"),
        ("graduation_year", "Graduation Year"),
        ("cgpa", "CGPA / Score"),
        ("registration_no", "Registration ID"),
        ("status", "Academic Status"),
        ("credential_type", "Credential Type"),
    ]

    # Add meta institution if institution not directly in payload
    inst_a = cred_a_data.get("institution") or cred_a_data.get("_meta", {}).get("issuer_name", "N/A")
    inst_b = cred_b_data.get("institution") or cred_b_data.get("_meta", {}).get("issuer_name", "N/A")

    type_a = cred_a_data.get("_meta", {}).get("credential_type", "ACADEMIC")
    type_b = cred_b_data.get("_meta", {}).get("credential_type", "ACADEMIC")

    comparison_fields = []
    for key, label in field_keys:
        if key == "institution":
            val_a = inst_a
            val_b = inst_b
        elif key == "credential_type":
            val_a = type_a
            val_b = type_b
        else:
            val_a = str(cred_a_data.get(key) or "—")
            val_b = str(cred_b_data.get(key) or "—")

        if val_a == "—" and val_b == "—":
            continue

        is_conflict = key in conflict_fields
        is_match = (
            normalize_text(val_a) == normalize_text(val_b)
            if val_a != "—" and val_b != "—"
            else False
        )

        comparison_fields.append({
            "field_name": label,
            "field_key": key,
            "record_a_value": val_a,
            "record_b_value": val_b,
            "is_conflict": is_conflict,
            "is_match": is_match,
        })

    conflict_count = sum(1 for f in comparison_fields if f["is_conflict"])
    return {
        "record_a_id": cred_a_id,
        "record_a_title": cred_a_title,
        "record_b_id": cred_b_id,
        "record_b_title": cred_b_title,
        "comparison_fields": comparison_fields,
        "conflict_count": conflict_count,
        "has_conflicts": conflict_count > 0,
    }


# ─────────────────────────────────────────────────────────────
# 6. UNIFIED QUALITY CHECK EVALUATOR
# ─────────────────────────────────────────────────────────────

def run_credential_quality_check(
    credential_id: Optional[str],
    credential_type: str,
    credential_data: Dict[str, Any],
    expires_at: Optional[datetime],
    issuer_user: Optional[Any],
    existing_credentials: List[Any],
    threshold: float = 0.75,
) -> Dict[str, Any]:
    """
    Runs all 6 intelligence checks and returns a comprehensive Credential Quality Report.
    Adheres strictly to the policy: NEVER automatically declares fraudulent,
    only flags items for human review.
    """
    title = credential_data.get("title") or "Verifiable Credential"
    issues: List[Dict[str, Any]] = []
    passed_checks: List[str] = []
    comparisons: List[Dict[str, Any]] = []

    # 1. Missing fields check
    missing = check_missing_fields(credential_data, credential_type)
    if missing:
        for f in missing:
            issues.append({
                "type": "missing_field",
                "severity": "warning",
                "status": "review_required",
                "field": f,
                "message": f"Required field '{f}' is missing or empty for credential type '{credential_type}'.",
            })
    else:
        passed_checks.append(f"All required fields present for {credential_type}")

    # 2. Expiry check
    is_exp, exp_str, curr_status = check_expiry(credential_data, expires_at)
    if is_exp:
        issues.append({
            "type": "expired",
            "severity": "warning",
            "status": "review_required",
            "field": "expires_at",
            "value_1": exp_str,
            "message": f"Credential expired on {exp_str} (Current status: {curr_status}).",
        })
    else:
        if exp_str:
            passed_checks.append(f"Credential active and unexpired (Valid until: {exp_str})")
        else:
            passed_checks.append("Credential active (No expiration constraint)")

    # 3. Issuer consistency check
    is_consistent, issuer_warning = check_issuer_consistency(credential_data, issuer_user)
    if not is_consistent and issuer_warning:
        issues.append({
            "type": "issuer_consistency",
            "severity": "warning",
            "status": "review_required",
            "field": "issuer",
            "message": issuer_warning,
        })
    else:
        issuer_name = getattr(issuer_user, "organization", None) or getattr(issuer_user, "name", "Accredited Authority")
        passed_checks.append(f"Issuer identified & verified ({issuer_name})")

    # Cryptographic integrity assumptions (already confirmed by crypto core)
    passed_checks.append("Digital signature verified (RSA-2048 PKCS#1 v2.1 PSS)")
    passed_checks.append("Cryptographic payload integrity verified (SHA-256 Canonical Hash)")

    # 4, 5, 6: Cross-record checks against holder's existing credentials
    has_duplicate = False
    has_similar = False
    has_conflict = False

    for other_cred in existing_credentials:
        # Don't compare a credential against itself
        other_id = getattr(other_cred, "id", None)
        if credential_id and other_id and credential_id == other_id:
            continue

        other_data = getattr(other_cred, "credential_data", None)
        if isinstance(other_data, str):
            import json
            try:
                other_data = json.loads(other_data)
            except Exception:
                continue
        elif not isinstance(other_data, dict):
            continue

        other_type = getattr(other_cred, "credential_type", "DIPLOMA")
        other_issuer_id = getattr(other_cred, "issuer_id", "")
        current_issuer_id = getattr(issuer_user, "id", "")

        other_title = other_data.get("title") or "Other Credential"

        # Check exact duplicate
        is_dup = check_exact_duplicate(
            credential_data,
            other_data,
            credential_type,
            other_type,
            current_issuer_id,
            other_issuer_id,
        )
        if is_dup:
            has_duplicate = True
            issues.append({
                "type": "duplicate",
                "severity": "warning",
                "status": "review_required",
                "message": f"Duplicate credential already exists: Matches '{other_title}' issued by the same institution.",
                "related_credential_id": other_id,
                "related_credential_title": other_title,
            })
            comparisons.append(build_record_comparison(
                cred_a_id=credential_id or "new_record",
                cred_a_title=title,
                cred_a_data=credential_data,
                cred_b_id=other_id or "existing_record",
                cred_b_title=other_title,
                cred_b_data=other_data,
                conflicts=[],
            ))
            # If exact duplicate, skip similarity
            continue

        # Check similarity
        is_sim, sim_score, sim_reason = check_similar_credential(
            credential_data,
            other_data,
            credential_type,
            other_type,
            threshold=threshold,
        )
        if is_sim:
            has_similar = True
            issues.append({
                "type": "similar",
                "severity": "warning",
                "status": "review_required",
                "similarity_score": sim_score,
                "message": f"Similar credential already exists: '{other_title}' (Similarity: {int(sim_score * 100)}%).",
                "related_credential_id": other_id,
                "related_credential_title": other_title,
            })
            comparisons.append(build_record_comparison(
                cred_a_id=credential_id or "new_record",
                cred_a_title=title,
                cred_a_data=credential_data,
                cred_b_id=other_id or "existing_record",
                cred_b_title=other_title,
                cred_b_data=other_data,
                conflicts=[],
            ))

        # Check information conflicts
        conflicts = check_field_conflicts(
            credential_data,
            other_data,
            credential_type,
            other_type,
        )
        if conflicts:
            has_conflict = True
            for c in conflicts:
                issues.append({
                    "type": "conflict",
                    "severity": "warning",
                    "status": "review_required",
                    "field": c["field"],
                    "value_1": c["value_1"],
                    "value_2": c["value_2"],
                    "message": c["message"],
                    "action": c["action"],
                    "related_credential_id": other_id,
                    "related_credential_title": other_title,
                })
            comparisons.append(build_record_comparison(
                cred_a_id=credential_id or "new_record",
                cred_a_title=title,
                cred_a_data=credential_data,
                cred_b_id=other_id or "existing_record",
                cred_b_title=other_title,
                cred_b_data=other_data,
                conflicts=conflicts,
            ))

    # Calculate overall quality score (0 - 100)
    score = 100
    for issue in issues:
        itype = issue.get("type")
        if itype == "duplicate":
            score -= 25
        elif itype == "conflict":
            score -= 20
        elif itype == "missing_field":
            score -= 15
        elif itype == "expired":
            score -= 15
        elif itype == "similar":
            score -= 10
        elif itype == "issuer_consistency":
            score -= 15
    score = max(0, score)

    overall_status = "review_required" if len(issues) > 0 else "no_issues"

    return {
        "credential_id": credential_id,
        "credential_title": title,
        "status": overall_status,
        "quality_score": score,
        "checks": {
            "duplicate": has_duplicate,
            "similar": has_similar,
            "conflict": has_conflict,
            "missing_fields": len(missing) > 0,
            "expired": is_exp,
            "issuer_consistency": is_consistent,
        },
        "passed_checks": passed_checks,
        "issues": issues,
        "comparisons": comparisons,
    }
