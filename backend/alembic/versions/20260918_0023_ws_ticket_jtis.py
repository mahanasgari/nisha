"""Persist consumed WebSocket ticket JTIs for multi-worker one-time use."""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "20260918_0023"
down_revision = "20260728_0022"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "ws_ticket_jtis",
        sa.Column("jti", sa.String(length=64), primary_key=True),
        sa.Column("consumed_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_ws_ticket_jtis_consumed_at", "ws_ticket_jtis", ["consumed_at"])


def downgrade() -> None:
    op.drop_index("ix_ws_ticket_jtis_consumed_at", table_name="ws_ticket_jtis")
    op.drop_table("ws_ticket_jtis")
