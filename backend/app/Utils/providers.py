"""
Pluggable API provider wrappers.

Each provider is an independent async function that fetches data and returns
a normalized dict (or None on failure). Services combine providers via
asyncio.gather so any provider can be added/removed without touching routes.
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any, Optional

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# ── Shared async HTTPX client ─────────────────────────────────────────────────

_client: Optional[httpx.AsyncClient] = None


def get_http_client() -> httpx.AsyncClient:
    global _client
    if _client is None or _client.is_closed:
        _client = httpx.AsyncClient(timeout=10.0, follow_redirects=True)
    return _client


async def close_http_client() -> None:
    global _client
    if _client and not _client.is_closed:
        await _client.aclose()


# ── Country flag emoji helper ─────────────────────────────────────────────────

def country_code_to_flag(code: str) -> str:
    """Convert a 2-letter ISO country code to its flag emoji."""
    if not code or len(code) != 2:
        return "🏳️"
    return "".join(chr(0x1F1E6 + ord(c) - ord("A")) for c in code.upper())


# ── Provider: ip-api.com ──────────────────────────────────────────────────────

async def fetch_ip_api(ip: str) -> dict[str, Any]:
    """
    ip-api.com free tier – 45 req/min, no key required.
    Returns geo, ISP, ASN, proxy/VPN/tor detection.
    """
    url = (
        f"http://ip-api.com/json/{ip}"
        "?fields=status,message,country,countryCode,region,regionName,"
        "city,zip,lat,lon,timezone,isp,org,as,hosting,proxy,mobile,query"
    )
    try:
        resp = await get_http_client().get(url)
        resp.raise_for_status()
        data = resp.json()
        if data.get("status") != "success":
            return {}
        asn_raw: str = data.get("as", "")
        asn = asn_raw.split(" ")[0] if asn_raw else None
        return {
            "ip": data.get("query"),
            "country": data.get("country"),
            "country_code": data.get("countryCode"),
            "country_flag": country_code_to_flag(data.get("countryCode", "")),
            "city": data.get("city"),
            "region": data.get("regionName"),
            "timezone": data.get("timezone"),
            "isp": data.get("isp"),
            "organization": data.get("org"),
            "asn": asn,
            "latitude": data.get("lat"),
            "longitude": data.get("lon"),
            "is_datacenter": data.get("hosting", False),
            "is_proxy": data.get("proxy", False),
        }
    except Exception as exc:
        logger.warning("ip-api fetch failed for %s: %s", ip, exc)
        return {}


# ── Provider: ipinfo.io ───────────────────────────────────────────────────────

async def fetch_ipinfo(ip: str) -> dict[str, Any]:
    """
    ipinfo.io – 50k req/month free; optional token for higher limits.
    Provides hostname and additional org info.
    """
    token_param = f"?token={settings.ipinfo_token}" if settings.ipinfo_token else ""
    url = f"https://ipinfo.io/{ip}/json{token_param}"
    try:
        resp = await get_http_client().get(url)
        resp.raise_for_status()
        data = resp.json()
        loc = data.get("loc", "")
        lat, lon = None, None
        if loc and "," in loc:
            parts = loc.split(",")
            lat = float(parts[0])
            lon = float(parts[1])
        return {
            "hostname": data.get("hostname"),
            "organization": data.get("org"),
            "country_code": data.get("country"),
            "country_flag": country_code_to_flag(data.get("country", "")),
            "latitude": lat,
            "longitude": lon,
        }
    except Exception as exc:
        logger.warning("ipinfo fetch failed for %s: %s", ip, exc)
        return {}


# ── Provider: proxycheck.io ───────────────────────────────────────────────────

async def fetch_proxycheck(ip: str) -> dict[str, Any]:
    """
    proxycheck.io – free 100/day without key, higher with key.
    Returns proxy, VPN, TOR detection and risk score.
    """
    params = {"vpn": 1, "asn": 1, "risk": 1, "seen": 1}
    if settings.proxycheck_api_key:
        params["key"] = settings.proxycheck_api_key
    url = f"https://proxycheck.io/v2/{ip}"
    try:
        resp = await get_http_client().get(url, params=params)
        resp.raise_for_status()
        data = resp.json()
        entry = data.get(ip, {})
        risk_raw = entry.get("risk", 0)
        try:
            risk = int(risk_raw)
        except (ValueError, TypeError):
            risk = 0
        return {
            "is_vpn": entry.get("vpn", "no").lower() == "yes",
            "is_proxy": entry.get("proxy", "no").lower() == "yes",
            "is_tor": entry.get("type", "").lower() == "tor",
            "risk_score": risk,
            "fraud_score": risk,
            "asn": entry.get("asn"),
            "isp": entry.get("provider"),
            "country": entry.get("country"),
            "country_code": entry.get("isocode"),
        }
    except Exception as exc:
        logger.warning("proxycheck fetch failed for %s: %s", ip, exc)
        return {}


# ── Provider: AbuseIPDB ───────────────────────────────────────────────────────

async def fetch_abuseipdb(ip: str) -> dict[str, Any]:
    """
    AbuseIPDB – free 1k/day with API key (skipped if no key provided).
    Returns abuse confidence score and ISP.
    """
    if not settings.abuseipdb_api_key:
        return {}
    url = "https://api.abuseipdb.com/api/v2/check"
    headers = {"Key": settings.abuseipdb_api_key, "Accept": "application/json"}
    params = {"ipAddress": ip, "maxAgeInDays": 90}
    try:
        resp = await get_http_client().get(url, headers=headers, params=params)
        resp.raise_for_status()
        data = resp.json().get("data", {})
        return {
            "abuse_score": data.get("abuseConfidenceScore", 0),
            "isp": data.get("isp"),
            "country_code": data.get("countryCode"),
            "hostname": data.get("hostnames", [None])[0],
            "blacklist_status": [
                {
                    "source": "AbuseIPDB",
                    "listed": data.get("abuseConfidenceScore", 0) > 0,
                }
            ],
        }
    except Exception as exc:
        logger.warning("AbuseIPDB fetch failed for %s: %s", ip, exc)
        return {}


# ── Aggregated IP lookup ──────────────────────────────────────────────────────

async def aggregate_ip_data(ip: str) -> dict[str, Any]:
    """
    Fetch from all providers concurrently and merge results.
    Later providers override earlier ones for the same key (higher quality data).
    """
    ip_api_data, ipinfo_data, proxycheck_data, abuseipdb_data = await asyncio.gather(
        fetch_ip_api(ip),
        fetch_ipinfo(ip),
        fetch_proxycheck(ip),
        fetch_abuseipdb(ip),
        return_exceptions=True,
    )

    merged: dict[str, Any] = {}
    for source in [ip_api_data, ipinfo_data, proxycheck_data, abuseipdb_data]:
        if isinstance(source, dict):
            for k, v in source.items():
                if v is not None:
                    merged[k] = v

    # Derive residential from datacenter flag
    if "is_datacenter" in merged:
        merged["is_residential"] = not merged["is_datacenter"]

    return merged


# ── Proxy connectivity test ───────────────────────────────────────────────────

async def test_proxy_connectivity(
    host: str,
    port: int,
    username: Optional[str],
    password: Optional[str],
    protocol: str = "http",
) -> dict[str, Any]:
    """
    Attempt an HTTP request through the proxy and measure response time.
    Returns connectivity info dict.
    """
    import time

    auth = f"{username}:{password}@" if username and password else ""
    proxy_url = f"{protocol}://{auth}{host}:{port}"

    try:
        start = time.perf_counter()
        async with httpx.AsyncClient(
            proxy=proxy_url,
            timeout=settings.proxy_check_timeout,
            follow_redirects=True,
        ) as client:
            resp = await client.get(settings.proxy_check_target)
            elapsed = (time.perf_counter() - start) * 1000
            exit_ip: Optional[str] = None
            try:
                exit_ip = resp.json().get("origin", "").split(",")[0].strip()
            except Exception:
                pass
            return {
                "is_alive": True,
                "ping_ms": round(elapsed, 2),
                "response_time_ms": round(elapsed, 2),
                "exit_ip": exit_ip,
            }
    except Exception as exc:
        logger.debug("Proxy %s:%d failed: %s", host, port, exc)
        return {"is_alive": False, "error": str(exc)}
