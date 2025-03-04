"""Add/modify package_detail column

Revision ID: 40850df03099
Revises: aac891e15a91
Create Date: 2025-03-04 15:05:35.677630

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '40850df03099'
down_revision: Union[str, None] = 'aac891e15a91'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Example change for adding or modifying a column
    op.add_column('product', sa.Column('package_detail', sa.String(length=500), nullable=True))

def downgrade():
    # Remove the column in case of rollback
    op.drop_column('product', 'package_detail')
