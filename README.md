# Nexora — Next-Generation Career & Talent Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/PostgreSQL-Supabase-emerald.svg)](https://supabase.com)
[![Currency](https://img.shields.io/badge/Currency-INR%20(%E2%82%B9)-amber.svg)](https://en.wikipedia.org/wiki/Indian_rupee)

Nexora is a full-stack, enterprise-grade talent platform connecting candidates and recruiters through transparent AI job matching, live browser-based coding assessments, verifiable skills benchmarking, and deep ATS resume optimization.

🌐 **Live Demo:** https://nexora-eight-ivory.vercel.app
🔗 **API Backend:** https://nexora-6rof.onrender.com

---

## 🌟 Key Portals & Architecture

### 1. Candidate Portal (`/candidate/*`)
* **Job Board & Transparent Match:** Real-time job browsing with detailed match percentages, missing skill breakdowns, and transparent criteria.
* **ATS Resume Checker & Studio:** Comprehensive resume evaluation scoring ATS keyword compatibility, formatting compliance, and role suitability.
* **Skill Assessments & Coding Sandbox:** Live, multi-language technical challenges executed in isolated runtime sandboxes (Python 3, Java 17 JDK, JavaScript Node.js, and SQL).
* **AI Career Assistant:** Interactive conversational assistant powered by Google Gemini 3 with domain-specific career advice, resume tuning, and interview preparation.
* **Career GPS & Roadmaps:** Step-by-step career path visualization, average compensation insights (INR ₹), and milestone tracking.
* **Application Tracking:** Real-time pipeline status from *Submitted* to *Reviewing*, *Shortlisted*, *Interviewing*, and *Offered*.

### 2. Recruiter Portal (`/recruiter/*`)
* **Recruiter Cockpit & Analytics:** Pipeline metrics, applicant throughput, and candidate breakdown.
* **Job Posting & Verification:** Rich job specifications with salary ranges in Indian Rupees (₹), skill tags, remote/hybrid mode, and Scam Shield pre-screening.
* **Applicant Screening & ATS Scoring:** Candidate ranking with match percentages, objective quiz scores, and verified coding benchmark results.
* **Company Profile Management:** Verification submission, employer branding, and verified company badge approval.

### 3. Admin Portal (`/admin/*`)
* **Admin Overview & Pipeline Charts:** Visual approval rates, scam clearance metrics, and platform health.
* **Recruiter & Employer Verification:** Document review and approval workflow for new recruiting organizations.
* **Job Moderation & Scam Shield:** Real-time flag queue for suspicious postings (upfront fees, cryptocurrency, unofficial contact channels).
* **User Management & Audit Logs:** Role-based access control (Admin, Recruiter, Candidate) and comprehensive action logs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide Icons, Framer Motion, React Lazy & Suspense |
| **Backend** | Python 3.12, Django 5.0, Django REST Framework (DRF), django-cors-headers |
| **Database** | PostgreSQL 17 (Supabase Session Pooler with SSL) + SQLite local development fallback |
| **Code Execution** | Isolated subprocess runner (Python 3.12 `-I`), Node.js, in-memory SQLite, Judge0 (JDK 17) |
| **AI Intelligence** | Google Gemini 3 Flash Preview (API integration) |
| **Authentication** | Knox Token Authentication, Google OAuth 2.0, GitHub OAuth App (RFC 6749) |
| **Email Delivery** | Gmail SMTP SSL/TLS with queued notification pipeline |

---

## 📁 Repository Structure

```
nexora/
├── backend/
│   ├── apps/
│   │   ├── accounts/          # Auth, User model, Profiles, Roles (Admin, Recruiter, Candidate)
│   │   ├── applications/      # Job applications & status pipeline
│   │   ├── assessments/       # Quizzes, questions & isolated code sandbox (Python, Java, JS, SQL)
│   │   ├── assistant/         # AI Career Assistant powered by Gemini 3
│   │   ├── ats/               # ATS Resume Checker & optimization engine
│   │   ├── candidates/        # Candidate profiles & career preferences
│   │   ├── career/            # Career GPS & Target Roles (INR compensation data)
│   │   ├── companies/         # Recruiter companies & employer verification
│   │   ├── jobs/              # Job postings, search, filters & moderation
│   │   ├── matching/          # Deterministic skill matching algorithms
│   │   ├── moderation/        # Scam Shield rules & report handling
│   │   ├── notifications/     # In-app notifications & email delivery
│   │   └── resumes/           # Resume storage & Open Studio
│   ├── config/
│   │   ├── settings.py        # Environment-driven Django settings (PostgreSQL / SQLite)
│   │   ├── urls.py            # API routing
│   │   └── wsgi.py
│   ├── scripts/               # Migration, verification, and audit utilities
│   ├── manage.py
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components & layouts
│   │   ├── context/           # AuthContext & state providers
│   │   ├── lib/               # Utility functions (formatINR, clsx, twMerge)
│   │   ├── pages/
│   │   │   ├── admin/         # Admin portal pages
│   │   │   ├── candidate/     # Candidate portal pages
│   │   │   ├── recruiter/     # Recruiter portal pages
│   │   │   └── public/        # Home, Jobs, Job Details, Auth
│   │   ├── services/          # API client & endpoints
│   │   ├── App.jsx            # Route definitions with React.lazy() & Suspense
│   │   └── main.jsx
│   ├── vite.config.js         # Optimized manual chunking & proxy
│   └── .env.example
├── .gitignore                 # Strict exclusion of secrets, database backups & media
├── START_LOCAL.bat            # One-click local development launcher
└── STOP_SERVERS.bat           # Graceful server shutdown utility
```

---

## 🚀 Quick Start (Development)

### Prerequisites
* **Python 3.12+**
* **Node.js 20+**
* **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AdilBasha18/Nexora.git
   cd Nexora
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env      # Configure your secrets in .env
   python manage.py migrate
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env      # Configure your client IDs in .env
   ```

4. **Run with One-Click Launchers (Windows):**
   * Double-click `START_LOCAL.bat` to launch both backend (`:8000`) and frontend (`:5173`).
   * Double-click `STOP_SERVERS.bat` anytime to shut down all processes.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
| :--- | :--- |
| `DEBUG` | Set `False` in production, `True` in development |
| `SECRET_KEY` | Cryptographic secret for Django sessions and token signing |
| `DATABASE_URL` | Supabase PostgreSQL URI (falls back to SQLite if unset) |
| `ALLOWED_HOSTS` | Comma-separated allowed domain names |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed frontend origins |
| `GEMINI_API_KEY` | Google Gemini 3 API key for AI Assistant |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth Client Secret |
| `EMAIL_HOST_USER` | Gmail sender address |
| `EMAIL_HOST_PASSWORD` | Google App Password (16-character) |

### Frontend (`frontend/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Public Client ID |
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth App Public Client ID |
| `VITE_GITHUB_REDIRECT_URI` | GitHub OAuth callback URL (`http://localhost:5173/login`) |
| `VITE_API_BASE_URL` | Optional backend API base URL for decoupled hosting |

---

## 🌐 Production Deployment Architecture

```
                                  ┌────────────────────────┐
                                  │   Vercel / Cloudflare  │
                                  │   (React / Vite SPA)   │
                                  └───────────┬────────────┘
                                              │ API Calls (/api/v1/*)
                                              ▼
                                  ┌────────────────────────┐
                                  │ Render / Railway / VPS │
                                  │ (Django REST API Gunicorn)│
                                  └─────┬────────────┬─────┘
                                        │            │
                   ┌────────────────────▼───┐    ┌───▼────────────────────┐
                   │  Supabase PostgreSQL   │    │ Isolated Worker / Code │
                   │  (Cloud Database 17)   │    │ Sandbox (Judge0 / VM)  │
                   └────────────────────────┘    └────────────────────────┘
```

### 1. Frontend Hosting (Vercel / Netlify / Cloudflare Pages)
* The React frontend is fully static and production-ready (`npm run build`).
* Output directory: `frontend/dist/`.
* Set environment variable `VITE_API_BASE_URL=https://your-backend.onrender.com`.

### 2. Backend Hosting (Render / Railway / DigitalOcean VPS / AWS EC2)
* **DO NOT** deploy the Django backend to Vercel (Vercel is serverless and cannot support persistent Python background processes, long-running sandbox executions, or WebSocket connections).
* Recommended: **Render Web Service** or **Railway** using `gunicorn config.wsgi:application`.
* Connect directly to **Supabase PostgreSQL** via `DATABASE_URL`.

### 3. Code Execution Sandbox Hosting
* For high-traffic production, untrusted code execution (Python/Java) should run in an isolated environment (such as an external Judge0 instance, isolated Docker container, or sandboxed AWS Lambda worker) with CPU and memory limits.

---

## 🔐 Security & Email Deliverability

### Current Email Delivery
* All automated platform emails (verification, applications, recruiter alerts) are delivered via Gmail SMTP with a queued notification pipeline.
* In-app reminders notify candidates and recruiters to whitelist the sender.

### Future Custom Domain DNS Recommendations
When migrating to a custom domain, configure these DNS records:
1. **SPF (Sender Policy Framework):**
   ```txt
   v=spf1 include:_spf.google.com ~all
   ```
2. **DKIM (DomainKeys Identified Mail):**
   Generate 2048-bit DKIM keys in your mail provider dashboard and add the TXT record to your DNS root.
3. **DMARC (Domain-based Message Authentication, Reporting, and Conformance):**
   ```txt
   v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourdomain.com; pct=100
   ```

---

## 📄 License
Nexora is proprietary software developed for high-trust career and talent intelligence. All rights reserved.
