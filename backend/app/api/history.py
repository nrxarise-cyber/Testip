"""
History API route — fetch, filter, and manage check history.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.history import HistoryListResponse, HistoryEntryResponse
from app.services.history_service import (
    list_history,
    get_history_by_id,
    clear_history,
    delete_history_entry,
    filter_history_by_type,
    export_history,
)

router = APIRouter(prefix="/history", tags=["History"])


@router.get("", response_model=HistoryListResponse)
async def get_all_history(
    page: int = Query(default=1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    check_type: str | None = Query(
        default=None,
        description="Filter by check type: 'ip', 'proxy', or 'bulk'",
    ),
    db: AsyncSession = Depends(get_db),
) -> HistoryListResponse:
    """
    Get paginated check history, newest first.
    
    Optional filter by check_type (ip, proxy, bulk).
    """
    if check_type and check_type not in ("ip", "proxy", "bulk"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid check_type. Must be 'ip', 'proxy', or 'bulk'.",
        )

    if check_type:
        return await filter_history_by_type(
            db=db,
            check_type=check_type,
            page=page,
            page_size=page_size,
        )

    return await list_history(db=db, page=page, page_size=page_size)


@router.get("/{entry_id}", response_model=HistoryEntryResponse)
async def get_single_history(
    entry_id: int = Query(..., gt=0, description="History entry ID"),
    db: AsyncSession = Depends(get_db),
) -> HistoryEntryResponse:
    """
    Retrieve a single history entry by ID.
    """
    entry = await get_history_by_id(db=db, entry_id=entry_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History entry {entry_id} not found.",
        )
    return entry


@router.get("/stats/summary", response_model=dict)
async def get_history_summary(
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Get summary statistics of all checks.
    Returns: total count, breakdown by type, and oldest/newest check timestamps.
    """
    from app.services.history_service import get_history_stats

    return await get_history_stats(db=db)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_single_history(
    entry_id: int = Query(..., gt=0, description="History entry ID"),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete a single history entry by ID.
    """
    deleted = await delete_history_entry(db=db, entry_id=entry_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History entry {entry_id} not found.",
        )


@router.delete("", status_code=status.HTTP_200_OK)
async def delete_all_history(
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Clear all check history entries.
    
    **WARNING**: This action cannot be undone.
    """
    deleted = await clear_history(db=db)
    return {
        "deleted": deleted,
        "message": f"Successfully deleted {deleted} history entries.",
    }


@router.post("/export", status_code=status.HTTP_200_OK)
async def export_history_data(
    format: str = Query(
        default="json",
        regex="^(json|csv)$",
        description="Export format: 'json' or 'csv'",
    ),
    check_type: str | None = Query(
        default=None,
        description="Filter export by check type",
    ),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Export history data in JSON or CSV format.
    Optionally filter by check_type.
    """
    if check_type and check_type not in ("ip", "proxy", "bulk"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid check_type. Must be 'ip', 'proxy', or 'bulk'.",
        )

    content = await export_history(
        db=db,
        format=format,
        check_type=check_type,
    )

    return {
        "format": format,
        "check_type": check_type or "all",
        "content": content,
    }
