"""
Pydantic schemas for IP Checker request and response.
"""

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, field_validator, IPvAnyAddress


class IPCheckRequest(BaseModel):
    ip: str

    @field_validator("ip")
    @classmethod
    def validate_ip(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("IP address cannot be empty")
        return v


class BlacklistEntry(BaseModel):
    source: str
    listed: bool


class IPCheckResponse(BaseModel):
    # Core
    ip: str
    country: Optional[str] = None
    country_code: Optional[str] = None
    country_flag: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    timezone: Optional[str] = None

    # Network
    isp: Optional[str] = None
    asn: Optional[str] = None
    organization: Optional[str] = None
    hostname: Optional[str] = None

    # Geo
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    # Classification
    is_residential: Optional[bool] = None
    is_datacenter: Optional[bool] = None
    is_vpn: Optional[bool] = None
    is_proxy: Optional[bool] = None
    is_tor: Optional[bool] = None

    # Risk
    risk_score: Optional[int] = None
    fraud_score: Optional[int] = None
    abuse_score: Optional[int] = None
    blacklist_status: Optional[list[BlacklistEntry]] = None

    # Meta
    error: Optional[str] = None
