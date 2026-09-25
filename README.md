# LifeKey 🔐

> Decentralized, privacy-first verifiable credentials with Zero-Knowledge (ZK) proofs, cryptographically signed credentials, purpose-bound consent requests, and burn tokens.

---

## 🌟 Overview

**LifeKey** is a modern credential verification and identity management platform. It empowers students, academic institutions, and employers to issue, verify, and share credentials securely with mathematical integrity guarantees.

- **Cryptographic Signatures (RSA & SHA-256)**: Tamper-evident credential hashing and digital signatures.
- **Zero-Knowledge Proofs (ZKPs)**: Verify eligibility without exposing sensitive underlying data.
- **Purpose-Bound Consent**: Fine-grained data disclosures tailored to specific employer requests.
- **Burn Tokens**: Expiring, single-use, or self-destructing access tokens for sensitive data.
- **Role-Based Portals**: Tailored interfaces for Students, Institutions, and Employers.

---

## 🏗️ Architecture

```
LifeKey/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── auth.py          # JWT authentication and password hashing
│   │   ├── crypto.py        # RSA signatures, hashing & ZK logic
│   │   ├── database.py      # SQLAlchemy SQLite engine & session
│   │   ├── main.py          # REST API endpoints & route handlers
│   │   ├── models.py        # Database models
│   │   └── schemas.py       # Pydantic validation schemas
│   ├── requirements.txt     # Python dependencies
│   ├── run.py               # Development server runner
│   └── seed.py              # Database seeder with demo accounts
│
├── frontend/                 # Next.js 15 App Router frontend
│   ├── src/
│   │   ├── app/             # Application routes (login, dashboard, verify, burn)
│   │   ├── components/      # UI components & layouts
│   │   └── lib/             # API client & utilities
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 🚀 Quick Start

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create and activate virtual environment (optional)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with initial demo accounts
python seed.py

# Run the FastAPI server
python run.py
```

The API will be live at `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.

#### Demo Credentials
- **Student**: `parth@lifekey.id` / `password123`
- **Institution**: `admin@abcpoly.edu.in` / `password123`
- **Employer**: `hr@technova.com` / `password123`

---

### 2. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🔒 Security & Privacy Features

- **No Plaintext Private Key Storage**: RSA keys are generated on-demand and kept local.
- **Zero Knowledge Claims**: Support for age/GPA/degree criteria verification without disclosing raw scores or dates.
- **Self-Destructing Burn Tokens**: Restrict temporal access to credential views.
