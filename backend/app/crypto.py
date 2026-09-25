"""
LIFEKEY — Cryptographic Engine
Digital signatures (RSA), hashing (SHA-256), and credential integrity.
"""
import hashlib
import json
import os
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.backends import default_backend
import base64

# Key storage directory
KEYS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "keys")
os.makedirs(KEYS_DIR, exist_ok=True)

PRIVATE_KEY_PATH = os.path.join(KEYS_DIR, "private_key.pem")
PUBLIC_KEY_PATH = os.path.join(KEYS_DIR, "public_key.pem")


def _generate_keys():
    """Generate RSA key pair if not exists."""
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )
    # Save private key
    with open(PRIVATE_KEY_PATH, "wb") as f:
        f.write(private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ))
    # Save public key
    with open(PUBLIC_KEY_PATH, "wb") as f:
        f.write(private_key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ))
    return private_key


def _load_private_key():
    """Load or generate private key."""
    if not os.path.exists(PRIVATE_KEY_PATH):
        return _generate_keys()
    with open(PRIVATE_KEY_PATH, "rb") as f:
        return serialization.load_pem_private_key(f.read(), password=None, backend=default_backend())


def _load_public_key():
    """Load or generate public key."""
    if not os.path.exists(PUBLIC_KEY_PATH):
        _generate_keys()
    with open(PUBLIC_KEY_PATH, "rb") as f:
        return serialization.load_pem_public_key(f.read(), backend=default_backend())


def hash_credential(credential_data: dict) -> str:
    """Create SHA-256 hash of credential data."""
    canonical = json.dumps(credential_data, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def sign_credential(credential_hash: str) -> str:
    """Sign a credential hash with the issuer's private key."""
    private_key = _load_private_key()
    signature = private_key.sign(
        credential_hash.encode("utf-8"),
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    return base64.b64encode(signature).decode("utf-8")


def verify_signature(credential_hash: str, signature_b64: str) -> bool:
    """Verify a credential's digital signature."""
    try:
        public_key = _load_public_key()
        signature = base64.b64decode(signature_b64)
        public_key.verify(
            signature,
            credential_hash.encode("utf-8"),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return True
    except Exception:
        return False


def verify_integrity(credential_data: dict, stored_hash: str) -> bool:
    """Check if credential data matches the stored hash (tamper detection)."""
    current_hash = hash_credential(credential_data)
    return current_hash == stored_hash
