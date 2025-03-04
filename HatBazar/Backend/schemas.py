from pydantic import BaseModel
from datetime import datetime, timezone, date

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
    user_id: int 

class CreateFarmResponse(BaseModel):
    msg: str
    user_id: int      #farm id hower kotha

class FarmUpdate(BaseModel):
    address: str
    nid: str
    farm_description: str
    employee_count: int

class CreateProduct(BaseModel):
    farm_id: int
    product_name: str
    product_image: str
    unit_price: float
    stock_amount: int
    production_procedure: str

class CreateProductResponse(BaseModel):
    msg: str
    # product_id: int
    product_name: str

class GetProductResponse(BaseModel):
    # product_id: int # not be shown
    product_image: str
    product_name: str
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
    user_name: str
    post_title: str
    post_content: str

class CommentResponse(BaseModel):
    comment_id: int
    user_name: str
    comment_text: str
    commented_time: str

    
