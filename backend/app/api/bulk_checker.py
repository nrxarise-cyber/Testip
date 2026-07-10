"""
Bulk Checker API route — checks up to 10 proxies in parallel.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import get_db
from app.schemas.proxy import BulkCheckRequest, BulkCheckResponse
from app.services.proxy_service import check_proxies_bulk
from app.services.history_service import save_history

router = APIRouter(prefix="/bulk", tags=["Bulk Checker"])
settings = get_settings()


@router.post("/check", response_model=BulkCheckResponse)
async def bulk_check(
    request: BulkCheckRequest,
    db: AsyncSession = Depends(get_db),
) -> BulkCheckResponse:
    """
    Check up to 10 proxies in parallel.
    Each proxy can be in any supported format.
    """
    proxies = [p.strip() for p in request.proxies if p.strip()]
    if not proxies:
        raise HTTPException(status_code=400, detail="No proxies provided.")
    if len(proxies) > settings.bulk_max_proxies:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {settings.bulk_max_proxies} proxies allowed per bulk check.",
        )

    result = await check_proxies_bulk(proxies)
    await save_history(
        db=db,
        check_type="bulk",
        input_data="\n".join(proxies),
        result=result.model_dump(),
    )
    return result
