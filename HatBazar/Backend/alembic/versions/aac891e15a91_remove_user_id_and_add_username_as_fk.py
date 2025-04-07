"""Remove user_id and add username as FK

Revision ID: aac891e15a91
Revises: 5d69ae7b7ac0
Create Date: 2025-03-03 12:21:44.829657

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'aac891e15a91'
down_revision: Union[str, None] = '5d69ae7b7ac0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade():
    # Remove the user_id column
    op.drop_column("farm", "user_id")

    # Add the username column as a foreign key
    op.add_column(
        "farm",
        sa.Column("username", sa.String(), sa.ForeignKey("user.username"), nullable=True),
    )


def downgrade():
    # Reverse the operations in case of downgrade
    op.add_column(
        "farm",
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.id"), nullable=True),
    )
    
    op.drop_column("farm", "username")