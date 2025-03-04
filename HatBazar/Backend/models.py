from datetime import datetime, timezone
from typing import Optional
from sqlmodel import Column, Field, SQLModel, Relationship, String  #text

class UserTable(SQLModel, table=True):
    __tablename__ = "user"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(sa_column_kwargs={"unique": True})
    fullname: str
    profile_photo: str | None
    phone: str = Field(sa_column_kwargs={"unique": True})
    email: str = Field(sa_column_kwargs={"unique": True})
    hashed_password: str
    updated_at: datetime = Field(default=datetime.now(timezone.utc))

    def __repr__(self):
        return self.fullname


class FarmTable(SQLModel, table=True):
    __tablename__ = "farm"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str | None = Field(foreign_key="user.username")
    farm_description: str | None
    address: str  | None
    employee_count: int | None
    updated_at: datetime = Field(default=datetime.now(timezone.utc))

    products: list['ProductTable'] | None = Relationship(back_populates="farm")

    
class ProductTable(SQLModel, table=True):
    __tablename__ = "product"
    id: Optional[int] = Field(default=None, primary_key=True)
    farm_id: int | None = Field(foreign_key="farm.id")
    product_name: str | None
    package_detail: str = Field(sa_column=Column(String(500)))
    product_image: str | None
    unit_price: float | None
    stock_amount: int | None
    production_procedure: str | None
    rating: float | None


    farm: FarmTable | None = Relationship(back_populates="products")
    
    def __repr__(self):
        return self.product_name