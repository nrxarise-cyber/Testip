"""
IP Checker service — aggregates data from multiple providers and
normalises the result into an IPCheckResponse.
"""

from __future__ import annotations

import logging
from typing import Any

from app.schemas.ip import IPCheckResponse, BlacklistEntry
from app.utils.providers import aggregate_ip_data

logger = logging.getLogger(__name__)


async def check_ip(ip: str) -> IPCheckResponse:
    """
    Run a full IP intelligence check against all configured providers
    and return a unified IPCheckResponse.
    """
    data: dict[str, Any] = await aggregate_ip_data(ip)

    # Normalise blacklist_status from raw list of dicts
    blacklist_raw = data.get("blacklist_status")
    blacklist: list[BlacklistEntry] | None = None
    if blacklist_raw and isinstance(blacklist_raw, list):
        blacklist = [
            BlacklistEntry(**entry) if isinstance(entry, dict) else entry
            for entry in blacklist_raw
        ]

    return IPCheckResponse(
        ip=data.get("ip", ip),
        country=data.get("country"),
        country_code=data.get("country_code"),
        country_flag=data.get("country_flag"),
        city=data.get("city"),
        region=data.get("region"),
        timezone=data.get("timezone"),
        isp=data.get("isp"),
        asn=data.get("asn"),
        organization=data.get("organization"),
        hostname=data.get("hostname"),
        latitude=data.get("latitude"),
        longitude=data.get("longitude"),
        is_residential=data.get("is_residential"),
        is_datacenter=data.get("is_datacenter"),
        is_vpn=data.get("is_vpn"),
        is_proxy=data.get("is_proxy"),
        is_tor=data.get("is_tor"),
        risk_score=data.get("risk_score"),
        fraud_score=data.get("fraud_score"),
        abuse_score=data.get("abuse_score"),
        blacklist_status=blacklist,
    )
