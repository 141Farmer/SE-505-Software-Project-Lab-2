"""Removed nid column from farm table

Revision ID: 5d69ae7b7ac0
Revises: 
Create Date: 2025-03-02 22:45:32.744686

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5d69ae7b7ac0'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('farm', 'nid')


def downgrade() -> None:
    op.add_column('farm', sa.Column('nid', sa.String(), nullable=True))
