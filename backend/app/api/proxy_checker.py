"""
Proxy Checker API route.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.proxy import ProxyCheckRequest, ProxyCheckResponse
from app.services.proxy_service import check_proxy
from app.services.history_service import save_history

router = APIRouter(prefix="/proxy", tags=["Proxy Checker"])


@router.post("/check", response_model=ProxyCheckResponse)
async def proxy_check(
    request: ProxyCheckRequest,
    db: AsyncSession = Depends(get_db),
) -> ProxyCheckResponse:
    """
    Check a single proxy and return live/dead status with detailed analytics.
    Results are saved to history.
    """
    result = await check_proxy(request.proxy)
    await save_history(
        db=db,
        check_type="proxy",
        input_data=request.proxy,
        result=result.model_dump(),
    )
    return result
