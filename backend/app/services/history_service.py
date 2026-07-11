"""
History service — CRUD operations for check history.
"""

from __future__ import annotations

import csv
import json
import logging
from io import StringIO
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


async def get_history_by_id(db: AsyncSession, entry_id: int) -> HistoryEntryResponse | None:
    """Retrieve a single history entry by ID."""
    result = await db.execute(select(CheckHistory).where(CheckHistory.id == entry_id))
    row = result.scalar_one_or_none()

    if not row:
        return None

    return HistoryEntryResponse(
        id=row.id,
        check_type=row.check_type,
        input_data=row.input_data,
        result=row.result,
        created_at=row.created_at,
    )


async def filter_history_by_type(
    db: AsyncSession,
    check_type: str,
    page: int = 1,
    page_size: int = 20,
) -> HistoryListResponse:
    """Return paginated history filtered by check type."""
    offset = (page - 1) * page_size

    total_result = await db.execute(
        select(func.count(CheckHistory.id)).where(CheckHistory.check_type == check_type)
    )
    total: int = total_result.scalar_one()

    rows_result = await db.execute(
        select(CheckHistory)
        .where(CheckHistory.check_type == check_type)
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


async def get_history_stats(db: AsyncSession) -> dict:
    """Get summary statistics of all checks."""
    # Total count
    total_result = await db.execute(select(func.count(CheckHistory.id)))
    total: int = total_result.scalar_one()

    if total == 0:
        return {
            "total": 0,
            "by_type": {"ip": 0, "proxy": 0, "bulk": 0},
            "oldest_check": None,
            "newest_check": None,
        }

    # Count by type
    for check_type in ["ip", "proxy", "bulk"]:
        type_result = await db.execute(
            select(func.count(CheckHistory.id)).where(CheckHistory.check_type == check_type)
        )
        # Store in a dict (we'll build it below)

    # Get counts for each type
    ip_result = await db.execute(
        select(func.count(CheckHistory.id)).where(CheckHistory.check_type == "ip")
    )
    proxy_result = await db.execute(
        select(func.count(CheckHistory.id)).where(CheckHistory.check_type == "proxy")
    )
    bulk_result = await db.execute(
        select(func.count(CheckHistory.id)).where(CheckHistory.check_type == "bulk")
    )

    # Get oldest and newest
    oldest_result = await db.execute(
        select(CheckHistory.created_at).order_by(CheckHistory.created_at.asc()).limit(1)
    )
    oldest = oldest_result.scalar_one_or_none()

    newest_result = await db.execute(
        select(CheckHistory.created_at).order_by(CheckHistory.created_at.desc()).limit(1)
    )
    newest = newest_result.scalar_one_or_none()

    return {
        "total": total,
        "by_type": {
            "ip": ip_result.scalar_one(),
            "proxy": proxy_result.scalar_one(),
            "bulk": bulk_result.scalar_one(),
        },
        "oldest_check": oldest.isoformat() if oldest else None,
        "newest_check": newest.isoformat() if newest else None,
    }


async def delete_history_entry(db: AsyncSession, entry_id: int) -> bool:
    """Delete a single history entry. Returns True if deleted, False if not found."""
    result = await db.execute(delete(CheckHistory).where(CheckHistory.id == entry_id))
    return result.rowcount > 0


async def clear_history(db: AsyncSession) -> int:
    """Delete all history entries. Returns number of deleted rows."""
    result = await db.execute(delete(CheckHistory))
    return result.rowcount


async def export_history(
    db: AsyncSession,
    format: str = "json",
    check_type: str | None = None,
) -> str:
    """
    Export history data in JSON or CSV format.
    
    Args:
        db: AsyncSession
        format: "json" or "csv"
        check_type: Optional filter by "ip", "proxy", or "bulk"
    
    Returns:
        Serialized data as string (JSON or CSV)
    """
    # Build query
    query = select(CheckHistory)
    if check_type:
        query = query.where(CheckHistory.check_type == check_type)
    query = query.order_by(CheckHistory.created_at.desc())

    result = await db.execute(query)
    rows = result.scalars().all()

    if format == "csv":
        return _export_to_csv(rows)
    else:  # json
        return _export_to_json(rows)


def _export_to_json(rows: list[CheckHistory]) -> str:
    """Convert history rows to JSON string."""
    data = [
        {
            "id": row.id,
            "check_type": row.check_type,
            "input_data": row.input_data,
            "result": row.result,
            "created_at": row.created_at.isoformat(),
        }
        for row in rows
    ]
    return json.dumps(data, indent=2, default=str)


def _export_to_csv(rows: list[CheckHistory]) -> str:
    """Convert history rows to CSV string."""
    output = StringIO()
    fieldnames = ["id", "check_type", "input_data", "result", "created_at"]
    writer = csv.DictWriter(output, fieldnames=fieldnames)

    writer.writeheader()
    for row in rows:
        writer.writerow({
            "id": row.id,
            "check_type": row.check_type,
            "input_data": row.input_data,
            "result": json.dumps(row.result, default=str),
            "created_at": row.created_at.isoformat(),
        })

    return output.getvalue()
