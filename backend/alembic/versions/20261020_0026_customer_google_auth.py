"""Add Google auth fields on customer_accounts."""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "20261020_0026"
down_revision = "20260918_0025"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "customer_accounts",
        sa.Column("google_sub", sa.String(length=255), nullable=True),
    )
    op.create_index(
        "ix_customer_accounts_google_sub",
        "customer_accounts",
        ["google_sub"],
        unique=True,
    )
    op.alter_column(
        "customer_accounts",
        "password_hash",
        existing_type=sa.String(length=255),
        nullable=True,
    )


def downgrade() -> None:
    op.execute(
        "UPDATE customer_accounts SET password_hash = '' WHERE password_hash IS NULL"
    )
    op.alter_column(
        "customer_accounts",
        "password_hash",
        existing_type=sa.String(length=255),
        nullable=False,
    )
    op.drop_index("ix_customer_accounts_google_sub", table_name="customer_accounts")
    op.drop_column("customer_accounts", "google_sub")
