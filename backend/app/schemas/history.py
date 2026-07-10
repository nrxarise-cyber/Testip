"""
Pydantic schemas for History endpoints.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel


class HistoryEntryResponse(BaseModel):
    id: int
    check_type: str
    input_data: str
    result: Any
    created_at: datetime

    model_config = {"from_attributes": True}


class HistoryListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[HistoryEntryResponse]
