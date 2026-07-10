"""
History service — CRUD operations for check history.
"""

from __future__ import annotations

import json
import logging
from typing import Any

from sqlalchemy import func, select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.history import CheckHistory
from app.schemas.history import HistoryEntryResponse, HistoryListResponse

logger = logging.getLogger(__name__)


async def save_history(
    db: AsyncSession,
    check_type: str,
    input_data: str,
    result: Any,
) -> CheckHistory:
    """Persist a check result to the database."""
    entry = CheckHistory(
        check_type=check_type,
        input_data=input_data,
        result_json=json.dumps(result, default=str),
    )
    db.add(entry)
    await db.flush()
    await db.refresh(entry)
    return entry


async def list_history(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 20,
) -> HistoryListResponse:
    """Return paginated history entries ordered by newest first."""
    offset = (page - 1) * page_size

    total_result = await db.execute(select(func.count(CheckHistory.id)))
    total: int = total_result.scalar_one()

    rows_result = await db.execute(
        select(CheckHistory)
        .order_by(CheckHistory.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    rows = rows_result.scalars().all()

    items = [
        HistoryEntryResponse(
            id=row.id,
            check_type=row.check_type,
            input_data=row.input_data,
            result=row.result,
            created_at=row.created_at,
        )
        for row in rows
    ]

    return HistoryListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=items,
    )


async def clear_history(db: AsyncSession) -> int:
    """Delete all history entries. Returns number of deleted rows."""
    result = await db.execute(delete(CheckHistory))
    return result.rowcount
