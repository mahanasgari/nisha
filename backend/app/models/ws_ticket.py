"""Persisted one-time WebSocket ticket JTIs (cross-process consumption)."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class WsTicketJti(Base):
    __tablename__ = "ws_ticket_jtis"

    jti: Mapped[str] = mapped_column(String(64), primary_key=True)
    consumed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
