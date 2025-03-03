from fastapi import APIRouter, Depends
from sqlmodel import select
from Marketplace import Marketplace
from Product import Product
from Farm import Farm
from schemas import CreateProduct
from AuthHandler import AuthHandler
from models import FarmTable
from Database import Database

marketplace_router = APIRouter()


market = Marketplace()

@marketplace_router.get("/")
def browseProducts():
    market.browseProducts()


@marketplace_router.post("/addproduct")
def addProduct(productReceived: CreateProduct, current_user = Depends(AuthHandler.get_current_user)):
    query = select(FarmTable).where(FarmTable.username == current_user.username)
    db_farm = Database.read_one(query=query)
    farm_id = db_farm.id

    product = Product(
        name=productReceived.product_name, image=productReceived.product_image, 
        price=productReceived.unit_price, stockAmount=productReceived.stock_amount,
        productionProcedure=productReceived.production_procedure, farmName=db_farm.username,
        farmAddress= db_farm.address
        )
    
    market.addProduct(farm_id=farm_id, product=product)
