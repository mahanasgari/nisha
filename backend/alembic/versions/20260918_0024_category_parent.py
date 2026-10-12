"""Add parent_id for product category nesting (one level)."""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "20260918_0024"
down_revision = "20260918_0023"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "product_categories",
        sa.Column("parent_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_product_categories_parent_id",
        "product_categories",
        "product_categories",
        ["parent_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_index(
        "ix_product_categories_parent_id",
        "product_categories",
        ["parent_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_product_categories_parent_id", table_name="product_categories")
    op.drop_constraint("fk_product_categories_parent_id", "product_categories", type_="foreignkey")
    op.drop_column("product_categories", "parent_id")
