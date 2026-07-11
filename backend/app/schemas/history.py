"""
Pydantic schemas for History endpoints.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any
from pydantic import BaseModel


class HistoryEntryResponse(BaseModel):
    """Single history entry response."""
    id: int
    check_type: str
    input_data: str
    result: Any
    created_at: datetime

    model_config = {"from_attributes": True}


class HistoryListResponse(BaseModel):
    """Paginated history list response."""
    total: int
    page: int
    page_size: int
    items: list[HistoryEntryResponse]


class HistoryStatsResponse(BaseModel):
    """History statistics response."""
    total: int
    by_type: dict[str, int]
    oldest_check: str | None
    newest_check: str | None


class HistoryExportResponse(BaseModel):
    """History export response."""
    format: str
    check_type: str
    content: str
