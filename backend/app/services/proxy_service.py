"""
Proxy Checker service.

Parses all supported proxy formats, tests live connectivity through the proxy,
then fetches geo/risk intelligence on the exit IP.
"""

from __future__ import annotations

import asyncio
import logging
import re
from typing import Optional

from app.schemas.proxy import ProxyCheckResponse, BulkCheckResponse
from app.utils.providers import (
    aggregate_ip_data,
    test_proxy_connectivity,
)

logger = logging.getLogger(__name__)

# ── Proxy format parser ───────────────────────────────────────────────────────

_FORMAT_PATTERNS = [
    # USER:PASS@IP:PORT
    re.compile(
        r"^(?P<username>[^:@]+):(?P<password>[^@]+)@(?P<host>[\w.\-]+):(?P<port>\d+)$"
    ),
    # IP:PORT:USER:PASS
    re.compile(
        r"^(?P<host>[\w.\-]+):(?P<port>\d+):(?P<username>[^:]+):(?P<password>.+)$"
    ),
    # IP:PORT
    re.compile(r"^(?P<host>[\w.\-]+):(?P<port>\d+)$"),
]


def parse_proxy(proxy_str: str) -> Optional[dict]:
    """
    Parse a proxy string into its components.
    Returns a dict with keys: host, port, username, password.
    Returns None if the format is not recognised.
    """
    proxy_str = proxy_str.strip()
    for pattern in _FORMAT_PATTERNS:
        m = pattern.match(proxy_str)
        if m:
            groups = m.groupdict()
            return {
                "host": groups["host"],
                "port": int(groups["port"]),
                "username": groups.get("username"),
                "password": groups.get("password"),
            }
    return None


# ── Anonymity detection ───────────────────────────────────────────────────────

def _detect_anonymity(exit_ip: Optional[str], host: str) -> str:
    """
    Determine proxy anonymity level based on exit IP vs proxy host.
    elite   → exit IP differs from host and no identifying headers sent
    anonymous → exit IP differs from host
    transparent → exit IP matches host (proxy reveals origin)
    """
    if not exit_ip:
        return "unknown"
    if exit_ip == host:
        return "transparent"
    return "elite"


# ── Single proxy check ────────────────────────────────────────────────────────

async def check_proxy(proxy_str: str) -> ProxyCheckResponse:
    """
    Full check for a single proxy string.
    1. Parse format
    2. Test HTTP connectivity
    3. If alive, enrich with geo/risk data on the exit IP
    """
    parsed = parse_proxy(proxy_str)
    if not parsed:
        return ProxyCheckResponse(
            proxy=proxy_str,
            is_alive=False,
            error=f"Unrecognised proxy format: {proxy_str!r}",
        )

    host: str = parsed["host"]
    port: int = parsed["port"]
    username: Optional[str] = parsed.get("username")
    password: Optional[str] = parsed.get("password")

    # Test HTTP through proxy
    conn = await test_proxy_connectivity(host, port, username, password, "http")

    if not conn.get("is_alive"):
        return ProxyCheckResponse(
            proxy=proxy_str,
            host=host,
            port=port,
            username=username,
            password=password,
            is_alive=False,
            error=conn.get("error"),
        )

    exit_ip: Optional[str] = conn.get("exit_ip")
    anonymity = _detect_anonymity(exit_ip, host)

    # Fetch geo/risk data on exit IP concurrently with HTTPS probe
    geo_data, https_conn = await asyncio.gather(
        aggregate_ip_data(exit_ip or host),
        test_proxy_connectivity(host, port, username, password, "https"),
        return_exceptions=True,
    )

    geo: dict = geo_data if isinstance(geo_data, dict) else {}
    https_alive = (
        isinstance(https_conn, dict) and https_conn.get("is_alive", False)
    )

    return ProxyCheckResponse(
        proxy=proxy_str,
        host=host,
        port=port,
        username=username,
        password=password,
        is_alive=True,
        ping_ms=conn.get("ping_ms"),
        response_time_ms=conn.get("response_time_ms"),
        exit_ip=exit_ip,
        country=geo.get("country"),
        country_code=geo.get("country_code"),
        isp=geo.get("isp"),
        asn=geo.get("asn"),
        is_residential=geo.get("is_residential"),
        is_datacenter=geo.get("is_datacenter"),
        anonymous_level=anonymity,
        supports_http=True,
        supports_https=https_alive,
        supports_socks4=None,  # requires separate SOCKS probe
        supports_socks5=None,
        is_vpn=geo.get("is_vpn"),
        is_tor=geo.get("is_tor"),
        proxy_score=geo.get("risk_score"),
        fraud_score=geo.get("fraud_score"),
        blacklist_status=geo.get("abuse_score", 0) > 0 if geo.get("abuse_score") is not None else None,
    )


# ── Bulk proxy check ──────────────────────────────────────────────────────────

async def check_proxies_bulk(proxy_list: list[str]) -> BulkCheckResponse:
    """Check multiple proxies concurrently and aggregate stats."""
    results = await asyncio.gather(
        *[check_proxy(p) for p in proxy_list],
        return_exceptions=True,
    )

    normalised: list[ProxyCheckResponse] = []
    for proxy_str, result in zip(proxy_list, results):
        if isinstance(result, Exception):
            normalised.append(
                ProxyCheckResponse(
                    proxy=proxy_str, is_alive=False, error=str(result)
                )
            )
        else:
            normalised.append(result)

    live_count = sum(1 for r in normalised if r.is_alive)
    return BulkCheckResponse(
        total=len(normalised),
        live=live_count,
        dead=len(normalised) - live_count,
        results=normalised,
    )
    
