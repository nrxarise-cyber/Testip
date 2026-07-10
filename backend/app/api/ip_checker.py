"""
IP Checker API route — thin wrapper delegating to ip_service.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.ip import IPCheckRequest, IPCheckResponse
from app.services.ip_service import check_ip
from app.services.history_service import save_history

router = APIRouter(prefix="/ip", tags=["IP Checker"])


@router.post("/check", response_model=IPCheckResponse)
async def ip_check(
    request: IPCheckRequest,
    db: AsyncSession = Depends(get_db),
) -> IPCheckResponse:
    """
    Check a single IP address and return comprehensive intelligence data.
    Results are automatically saved to history.
    """
    result = await check_ip(request.ip)
    await save_history(
        db=db,
        check_type="ip",
        input_data=request.ip,
        result=result.model_dump(),
    )
    return result
