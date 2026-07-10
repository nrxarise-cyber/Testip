# AEROX — Telegram Mini App (V1)

A production-ready Telegram Mini App designed for mobile-first, high-performance IP and Proxy verification. 

## Features

- 🌐 **IP Checker**: Resolve complete IP intelligence (Country flag, ISP, ASN, VPN, TOR, risk assessment).
- 🔌 **Proxy Checker**: Test any proxy format (`IP:PORT`, `USER:PASS@IP:PORT`, `IP:PORT:USER:PASS`) for live connectivity, exit IP, ping, and protocols.
- 📋 **Bulk Checker**: Check up to 10 proxies in parallel.
- 📜 **History**: Complete record of previous checks stored locally via SQLite (`aiosqlite`).

---

## Directory Structure

```
AEROX/
├── backend/            # FastAPI (Python 3.12+)
│   ├── app/
│   │   ├── api/        # Endpoint routers
│   │   ├── core/       # Database & config
│   │   ├── models/     # DB models
│   │   ├── schemas/    # Pydantic schemas
│   │   ├── services/   # Business logic services
│   │   └── utils/      # External API wrappers
│   └── requirements.txt
├── frontend/           # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
└── docker-compose.yml
```

---

## Setup & Running

### Requirements
- Docker & Docker Compose **OR** Python 3.12+ and Node.js (v18+)

### Option A: Run via Docker Compose

```bash
docker-compose up --build
```
- Backend will be available at: http://localhost:8000
- Frontend (Vite dev) will be available at: http://localhost:5173

### Option B: Run Locally (Bare-metal)

#### 1. Start the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

#### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables (`backend/.env`)

Configure the following variables in the backend environment:

- `DATABASE_URL`: Path to sqlite database (Defaults to `sqlite+aiosqlite:///./aerox.db`).
- `IPINFO_TOKEN`: Optional API key from [ipinfo.io](https://ipinfo.io/signup).
- `PROXYCHECK_API_KEY`: Optional API key from [proxycheck.io](https://proxycheck.io).
- `ABUSEIPDB_API_KEY`: Optional API key from [AbuseIPDB](https://www.abuseipdb.com/register).

---

## Railway & Heroku Deployment

This repository is ready for deploy out of the box:

- **Heroku**: Ready with the `backend/Procfile` web script.
- **Railway**: Automatically detects the `docker-compose.yml` or the sub-service directories. Mount a persistent disk volume for `aerox.db` database consistency.
