"""
Pydantic schemas for Proxy Checker request and response.
"""

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel


class ProxyCheckRequest(BaseModel):
    proxy: str  # any supported format


class ProxyCheckResponse(BaseModel):
    # Input
    proxy: str
    host: Optional[str] = None
    port: Optional[int] = None
    username: Optional[str] = None
    password: Optional[str] = None

    # Status
    is_alive: bool = False
    ping_ms: Optional[float] = None
    response_time_ms: Optional[float] = None

    # Geo / Network
    country: Optional[str] = None
    country_code: Optional[str] = None
    isp: Optional[str] = None
    asn: Optional[str] = None
    exit_ip: Optional[str] = None

    # Classification
    is_residential: Optional[bool] = None
    is_datacenter: Optional[bool] = None
    anonymous_level: Optional[str] = None  # "transparent" | "anonymous" | "elite"

    # Protocol support
    supports_http: Optional[bool] = None
    supports_https: Optional[bool] = None
    supports_socks4: Optional[bool] = None
    supports_socks5: Optional[bool] = None

    # Risk
    is_vpn: Optional[bool] = None
    is_tor: Optional[bool] = None
    proxy_score: Optional[int] = None
    fraud_score: Optional[int] = None
    blacklist_status: Optional[bool] = None

    # Meta
    error: Optional[str] = None


class BulkCheckRequest(BaseModel):
    proxies: list[str]


class BulkCheckResponse(BaseModel):
    total: int
    live: int
    dead: int
    results: list[ProxyCheckResponse]
    
