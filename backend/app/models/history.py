"""
SQLAlchemy ORM model for check history entries.
"""

import json
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class CheckHistory(Base):
    """Stores every IP / proxy / bulk check result for the history page."""

    __tablename__ = "check_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    check_type: Mapped[str] = mapped_column(
        String(20), nullable=False, index=True
    )  # "ip" | "proxy" | "bulk"
    input_data: Mapped[str] = mapped_column(Text, nullable=False)
    result_json: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    @property
    def result(self) -> Any:
        """Deserialize JSON result."""
        return json.loads(self.result_json)

    @result.setter
    def result(self, value: Any) -> None:
        """Serialize result to JSON string."""
        self.result_json = json.dumps(value, default=str)
