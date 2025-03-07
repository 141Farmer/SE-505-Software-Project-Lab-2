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

class PostTable(SQLModel, table=True):
    __tablename__ = "post"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_name: str | None = Field(foreign_key="user.username")
    post_title: str | None
    post_content: str | None
    upvote_count: int | None
    downvote_count: int | None
    posted_time: datetime = Field(default=datetime.now(timezone.utc))

class CommentTable(SQLModel, table=True):
    __tablename__ = "comment"
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: int | None = Field(foreign_key="post.id")
    user_name: str | None = Field(foreign_key="user.username")
    comment_text: str | None
    commented_time: datetime = Field(default=datetime.now(timezone.utc))

class VoteTable(SQLModel, table=True):
    __tablename__="vote"
    id: Optional[int] = Field(default=None, primary_key=True)
    post_id: int | None = Field(foreign_key="post.id")
    user_name: str | None = Field(foreign_key="user.username")
    value: int | None


class InvestmentOfferTable(SQLModel, table=True):
    __tablename__= "offer"
    id: Optional[int] = Field(default=None, primary_key=True)
    farm_id: int | None = Field(foreign_key="farm.id")
    user_name: str | None 
    offer_description: str | None
    offer_creation_time: datetime = Field(default=datetime.now(timezone.utc))
    offer_investment_principle: float | None
    offer_investment_rate: float | None
    offer_share_dividing_period_month: int | None 
    offer_investment_duration_month: int | None

class InvestmentBidTable(SQLModel, table=True):
    __tablename__= "bid"
    id: Optional[int] = Field(default=None, primary_key=True)
    investment_offer_id: int | None = Field(foreign_key="offer.id") 
    user_id: int | None = Field(foreign_key="user.id")
    user_name: str | None  
    bid_creation_time: datetime = Field(default=datetime.now(timezone.utc))
    bid_investment_principle: float | None
    bid_investment_rate: float | None
    bid_share_dividing_period_month: int | None 
    bid_investment_duration_month: int | None

class InvestmentTable(SQLModel, table=True):
    __tablename__="investment"
    id: Optional[int] = Field(default=None, primary_key=True)
    farm_id: int | None = Field(foreign_key="farm.id")
    user_id: int | None = Field(foreign_key="user.id")
    investment_creation_time: datetime = Field(default=datetime.now(timezone.utc))
    investment_principle: float | None
    investment_rate: float | None
    share_dividing_period_month: int | None 
    investment_duration_month: int | None 
    transaction_id: str | None


class PaymentTable(SQLModel, table=True):
    ___tablename__ = "paymenttble"
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(foreign_key="user.username")
    amount: float
    tran_id : str 
    indicator: str
    payment_time: datetime = Field(default=datetime.now(timezone.utc))


class AccountTable(SQLModel, table=True):
    __tablename__ = "account"
    id: Optional[int] = Field(default=None, primary_key=True)
    username : str = Field(foreign_key="user.username")
    balance_sales: float | None = Field(default=0)
    balance_investment: float | None = Field(default=0)
    total_balance: float | None = Field(default=0)
    
