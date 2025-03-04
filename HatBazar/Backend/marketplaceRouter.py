from typing import List
from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlmodel import select
from Marketplace import Marketplace
from Product import Product
from Farm import Farm
from schemas import GetProductResponse
from AuthHandler import AuthHandler
from models import FarmTable
from Database import Database
from fastapi import HTTPException
from ImageHandler import ImageHandler
from pydantic import BaseModel


marketplace_router = APIRouter()


market = Marketplace()

class GetProductResponse(BaseModel):
    product_id: int
    product_name: str
    product_image: str
    rating: float | None
    unit_price: float
    stock_amount: int
    farm_name: str
    farm_addresss: str
    production_procedure: str

@marketplace_router.get("/", response_model=List[GetProductResponse])   
def browseProducts():
    return market.browseProducts()


@marketplace_router.post("/addproduct")
def addProduct(name: str= Form(...), image: UploadFile = File(...), price: float= Form(...), stock: int= Form(...), production_procedure:str= Form(...), current_user = Depends(AuthHandler.get_current_user)):
    query = select(FarmTable).where(FarmTable.username == current_user.username)
    db_farm = Database.read_one(query=query)

    if not db_farm:
        raise HTTPException(status_code=404, detail="Not registered Farmer")
    farm_id = db_farm.id

    image_url = f"http://127.0.0.1:8000{ImageHandler.uploadProductImage(image)}"


    product = Product(
        name=name, image=image_url, 
        price=price, stockAmount=stock,
        productionProcedure=production_procedure, farmName=db_farm.username,
        farmAddress= db_farm.address
        )
    
    product = market.addProduct(farm_id=farm_id, product=product)
    
    return {"message":f"{product._name} created Successfully."}



@marketplace_router.delete("/deleteproduct/{product_id}")
def deleteProduct(product_id: int):
    return market.deleteProduct(product_id)
