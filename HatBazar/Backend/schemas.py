from pydantic import BaseModel
from datetime import datetime, timezone, date
from fastapi import File, UploadFile

class UserCreate(BaseModel):
    username: str
    fullname: str
    email: str
    phoneNumber: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str


class UpdateUser(BaseModel):
    username: str | None
    fullname: str | None
    email: str | None
    phoneNumber: str | None


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class DashBoardResponse(BaseModel):
    username: str
    fullname: str
    email: str
    phone: str
    profile_photo_url: str | None

class CreateFarm(BaseModel):
    farmDescription: str
    address: str
    employee_count: int

class CreateFarmResponse(BaseModel):
    msg: str
    user_id: int      #farm id hower kotha

class FarmUpdate(BaseModel):
    address: str
    nid: str
    farm_description: str
    employee_count: int

class CreateProductResponse(BaseModel):
    msg: str
    # product_id: int
    product_name: str

class GetProductResponse(BaseModel):
    product_id: int
    product_name: str
    package_detail: str
    product_image: str
    rating: float | None
    unit_price: float
    stock_amount: int
    farm_name: str
    farm_addresss: str | None
    production_procedure: str | None


class PostResponse(BaseModel):
    post_id: int
    user_name: str
    post_title: str
    post_content: str
    upvote_count: int 
    downvote_count: int
    posted_time: datetime

class PostCreate(BaseModel):
    post_title: str
    post_content: str

class CommentResponse(BaseModel):
    comment_id: int
    user_name: str
    comment_text: str
    commented_time: str

class OfferResponse(BaseModel):
    offer_id: int
    user_name: str  
    offer_description: str 
    offer_creation_time: datetime 
    offer_investment_principle: float 
    offer_investment_rate: float 
    offer_share_dividing_period_month: int 
    offer_investment_duration_month: int 

class OfferCreate(BaseModel):
    offer_description: str
    offer_creation_time: datetime 
    offer_investment_principle: float 
    offer_investment_rate: float 
    offer_share_dividing_period_month: int 
    offer_investment_duration_month: int 

    
