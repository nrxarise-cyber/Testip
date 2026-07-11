# AEROX - IP & Proxy Intelligence API

## Overview

AEROX is a complete **IP and Proxy checking application** with both frontend and backend components. It provides real-time intelligence on IP addresses and proxy servers, including geolocation, risk scoring, and proxy anonymity detection.

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health check: `http://localhost:8000/api/v1/health`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### Docker Deployment

```bash
docker-compose up
```

---

## 📡 API Endpoints

### Health Check
- **GET** `/api/v1/health` - System health status

### IP Checker
- **POST** `/api/v1/ip/check`
  - Request: `{ "ip": "8.8.8.8" }`
  - Response: Geolocation, ISP, VPN/Proxy detection, risk scores, blacklist status
  - Auto-saves to history

### Proxy Checker
- **POST** `/api/v1/proxy/check`
  - Request: `{ "proxy": "192.168.1.1:8080" }`
  - Formats supported:
    - `ip:port`
    - `ip:port:username:password`
    - `username:password@ip:port`
  - Response: Live/dead status, exit IP, anonymity level, protocol support, risk scores
  - Auto-saves to history

### Bulk Checker
- **POST** `/api/v1/bulk/check`
  - Request: `{ "proxies": ["proxy1", "proxy2", ...] }`
  - Limit: 10 proxies per request
  - Response: Aggregated results with live/dead counts
  - Auto-saves to history

### History Management

#### List History (Paginated)
- **GET** `/api/v1/history`
  - Query params:
    - `page` (default: 1)
    - `page_size` (default: 20, max: 100)
    - `check_type` (optional: "ip", "proxy", "bulk")
  - Response: Paginated list with newest first

#### Get Single Entry
- **GET** `/api/v1/history/{entry_id}`
  - Response: Single history entry with full result data

#### History Statistics
- **GET** `/api/v1/history/stats/summary`
  - Response: Total count, breakdown by type, oldest/newest timestamps

#### Delete Single Entry
- **DELETE** `/api/v1/history/{entry_id}`
  - Status: 204 No Content

#### Clear All History
- **DELETE** `/api/v1/history`
  - Response: Count of deleted entries

#### Export History
- **POST** `/api/v1/history/export`
  - Query params:
    - `format` ("json" or "csv", default: "json")
    - `check_type` (optional: "ip", "proxy", "bulk")
  - Response: Serialized data in requested format

---

## 📊 Response Examples

### IP Check Response
```json
{
  "ip": "8.8.8.8",
  "country": "United States",
  "country_code": "US",
  "city": "Mountain View",
  "isp": "Google LLC",
  "asn": "AS15169",
  "latitude": 37.386,
  "longitude": -122.084,
  "is_residential": false,
  "is_datacenter": true,
  "is_vpn": false,
  "is_proxy": false,
  "is_tor": false,
  "risk_score": 0,
  "fraud_score": 0,
  "abuse_score": 0,
  "blacklist_status": []
}
```

### Proxy Check Response
```json
{
  "proxy": "192.168.1.1:8080",
  "host": "192.168.1.1",
  "port": 8080,
  "is_alive": true,
  "ping_ms": 45,
  "response_time_ms": 234,
  "exit_ip": "203.0.113.5",
  "country": "United Kingdom",
  "anonymity_level": "elite",
  "supports_http": true,
  "supports_https": true,
  "is_vpn": false,
  "is_tor": false,
  "proxy_score": 25
}
```

### Bulk Check Response
```json
{
  "total": 3,
  "live": 2,
  "dead": 1,
  "results": [
    { "proxy": "...", "is_alive": true, ... },
    { "proxy": "...", "is_alive": false, ... },
    { "proxy": "...", "is_alive": true, ... }
  ]
}
```

### History List Response
```json
{
  "total": 150,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "id": 150,
      "check_type": "ip",
      "input_data": "8.8.8.8",
      "result": { ... },
      "created_at": "2026-07-11T05:58:00Z"
    },
    ...
  ]
}
```

---

## ⚙️ Configuration

Backend settings in `backend/app/core/config.py`:

```python
# Application
app_name = "AEROX"
app_version = "1.0.0"

# Database
database_url = "sqlite+aiosqlite:///./aerox.db"

# CORS
cors_origins = ["*"]

# External APIs (optional)
ipinfo_token = ""           # https://ipinfo.io
proxycheck_api_key = ""     # https://proxycheck.io
abuseipdb_api_key = ""      # https://www.abuseipdb.com

# Proxy checking
proxy_check_timeout = 15    # seconds
proxy_check_target = "https://httpbin.org/ip"

# Bulk limits
bulk_max_proxies = 10
```

Set via `.env` file or environment variables.

---

## 🗄️ Database Schema

### CheckHistory Table
```sql
CREATE TABLE check_history (
  id INTEGER PRIMARY KEY,
  check_type VARCHAR(20) NOT NULL,      -- "ip", "proxy", "bulk"
  input_data TEXT NOT NULL,              -- Original input (IP or proxy string)
  result_json TEXT NOT NULL,             -- Full check result as JSON
  created_at DATETIME DEFAULT NOW()
);
```

---

## 🔧 Architecture

```
Backend (FastAPI)
├── app/
│   ├── api/              -- Route handlers
│   │   ├── ip_checker.py
│   │   ├── proxy_checker.py
│   │   ├── bulk_checker.py
│   │   ├── history.py
│   │   └── router.py
│   ├── core/             -- Configuration & DB
│   │   ├── config.py
│   │   └── database.py
│   ├── models/           -- SQLAlchemy ORM
│   │   └── history.py
│   ├── schemas/          -- Pydantic validation
│   │   ├── ip.py
│   │   ├── proxy.py
│   │   └── history.py
│   ├── services/         -- Business logic
│   │   ├── ip_service.py
│   │   ├── proxy_service.py
│   │   └── history_service.py
│   ├── utils/            -- Utilities
│   │   └── providers.py   -- External API integration
│   └── main.py           -- App entry point

Frontend (React + Vite)
├── src/
│   ├── pages/            -- Page components
│   ├── components/       -- Reusable components
│   ├── services/         -- API calls
│   ├── hooks/            -- Custom hooks
│   ├── types/            -- TypeScript types
│   ├── App.tsx           -- Main router
│   └── main.tsx          -- Entry point
```

---

## 🔌 Proxy Format Support

All three formats are automatically detected and parsed:

1. **IP:Port** (basic)
   ```
   192.168.1.1:8080
   ```

2. **IP:Port:User:Pass** (colon-separated)
   ```
   192.168.1.1:8080:admin:password123
   ```

3. **User:Pass@IP:Port** (standard format)
   ```
   admin:password123@192.168.1.1:8080
   ```

---

## 🧪 Testing the API

### Quick cURL Examples

**Check IP:**
```bash
curl -X POST "http://localhost:8000/api/v1/ip/check" \
  -H "Content-Type: application/json" \
  -d '{"ip":"8.8.8.8"}'
```

**Check Proxy:**
```bash
curl -X POST "http://localhost:8000/api/v1/proxy/check" \
  -H "Content-Type: application/json" \
  -d '{"proxy":"192.168.1.1:8080"}'
```

**Bulk Check:**
```bash
curl -X POST "http://localhost:8000/api/v1/bulk/check" \
  -H "Content-Type: application/json" \
  -d '{"proxies":["192.168.1.1:8080","10.0.0.1:3128"]}'
```

**Get History:**
```bash
curl "http://localhost:8000/api/v1/history?page=1&page_size=20"
```

**Filter by Type:**
```bash
curl "http://localhost:8000/api/v1/history?check_type=proxy&page=1"
```

**Get Stats:**
```bash
curl "http://localhost:8000/api/v1/history/stats/summary"
```

**Export to JSON:**
```bash
curl -X POST "http://localhost:8000/api/v1/history/export?format=json"
```

**Export to CSV:**
```bash
curl -X POST "http://localhost:8000/api/v1/history/export?format=csv"
```

---

## 📋 Features

✅ **IP Intelligence:**
- Geolocation (country, city, coordinates)
- Network info (ISP, ASN, organization)
- Classification (residential, datacenter, VPN, proxy, Tor)
- Risk scoring and fraud detection
- Blacklist status

✅ **Proxy Testing:**
- Live/dead detection via HTTP connectivity
- Exit IP identification
- Anonymity level detection (elite/anonymous/transparent)
- Protocol support (HTTP, HTTPS, SOCKS detection ready)
- Response time measurement

✅ **Bulk Operations:**
- Check up to 10 proxies concurrently
- Aggregated statistics
- Detailed per-proxy results

✅ **History Management:**
- Automatic result persistence
- Paginated browsing
- Filtering by check type
- Statistics summary
- JSON/CSV export

✅ **External Integrations:**
- ipinfo.io - Geolocation & IP intelligence
- ProxyCheck.io - Proxy validation
- AbuseIPDB - Abuse score & blacklist status
- Graceful fallbacks when APIs unavailable

---

## 🚢 Deployment

### Docker
```bash
docker-compose up -d
```

### Heroku
```bash
git push heroku main
```

Uses `Procfile` for process management.

### Manual (VPS/Local)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## 📝 Environment Variables

```bash
# Application
APP_NAME=AEROX
APP_VERSION=1.0.0
DEBUG=false

# Database
DATABASE_URL=sqlite+aiosqlite:///./aerox.db

# CORS
CORS_ORIGINS=*

# External APIs
IPINFO_TOKEN=your_token_here
PROXYCHECK_API_KEY=your_key_here
ABUSEIPDB_API_KEY=your_key_here

# Proxy checking
PROXY_CHECK_TIMEOUT=15
PROXY_CHECK_TARGET=https://httpbin.org/ip

# Limits
BULK_MAX_PROXIES=10
```

---

## 📞 Support

For issues or questions:
1. Check FastAPI docs at `/docs`
2. Review ReDoc at `/redoc`
3. Check logs in backend console
4. Verify environment variables are set

---

**Version:** 1.0.0  
**Last Updated:** 2026-07-11  
**Status:** ✅ Complete
