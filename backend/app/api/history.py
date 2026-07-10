"""
History API route.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.history import HistoryListResponse
from app.services.history_service import list_history, clear_history

router = APIRouter(prefix="/history", tags=["History"])


@router.get("", response_model=HistoryListResponse)
async def get_history(
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> HistoryListResponse:
    """Return paginated check history, newest first."""
    return await list_history(db=db, page=page, page_size=page_size)


@router.delete("", status_code=200)
async def delete_history(
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Clear all check history entries."""
    deleted = await clear_history(db=db)
    return {"deleted": deleted, "message": "History cleared successfully."}
