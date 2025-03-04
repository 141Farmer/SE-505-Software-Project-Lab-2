from pathlib import Path
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from Database import Database
from User import User
from CommunityRouter import router as community_router
from PostRouter import router as post_router
from Community import Community
from models import UserTable, FarmTable, ProductTable
from schemas import UserCreate, UserLogin, LoginResponse, DashBoardResponse, UpdateUser
from schemas import CreateProductResponse, GetProductResponse, PostResponse
from schemas import CreateFarm, CreateFarmResponse, FarmUpdate, LoginResponse
from fastapi.middleware.cors import CORSMiddleware
from config import PROFILE_UPLOAD_DIR, PRODUCT_UPLOAD_DIR
from userRouter import user_router
from marketplaceRouter import marketplace_router
from AuthHandler import AuthHandler
from Farm import Farm


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],  #origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Database.create_db_and_tables()
app.mount("/static", StaticFiles(directory="static"), name="static")


user = User()


app.include_router(user_router, prefix="", tags=["User"])
app.include_router(marketplace_router, prefix="/marketplace", tags=["Market"])



@app.post("/token", response_model=LoginResponse)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    return user.login(form_data.username, form_data.password)


@app.get("/user-role")
def getUserRole(current_user = Depends(AuthHandler.get_current_user)):
    query = select(FarmTable).where(FarmTable.username == current_user.username)
    if Database.read_one(query=query):
        return {"role": "farm"}
    return {"role": "user"}


@app.post("/createfarm/")              # response_model=CreateFarmResponse)
def createFarm(createFarm: CreateFarm, current_user = Depends(AuthHandler.get_current_user)):
    username = current_user.username
    query = select(UserTable).where(UserTable.username == username)
    db_user = Database.read_one(query=query)

    farm = Farm(username=username, fullname=db_user.fullname,
                email=db_user.email, phoneNumber= db_user.phone, profile_photo_url=db_user.profile_photo,
                hashed_password=db_user.hashed_password, farmDescription=createFarm.farmDescription,
                address=createFarm.address, employeeCount=createFarm.employee_count
                )
    if not farm:
        raise HTTPException(status_code=400, detail="Error creating farm")
    
    return {"message" : "farm created successfully"}
    


@app.get("/getfarm/{farm_id}")
def get_farm(farm_id: int):
    with Database.get_session() as session:
        query = select(FarmTable).where(FarmTable.id == farm_id)
        farm = session.exec(query).first()
        return farm



@app.put("/updatefarm/{farm_id}")
def update_farm(farm_id: int, farm_update: FarmUpdate):
    with Database.get_session() as session:
        farm = session.get(FarmTable, farm_id)
        if not farm:
            raise HTTPException(status_code=404, detail="Farm not found")
        if farm_update.address is not None:
            farm.address = farm_update.address
        if farm_update.nid is not None:
            farm.nid = farm_update.nid
        if farm_update.farm_description is not None:
            farm.farm_description = farm_update.farm_description
        if farm_update.employee_count is not None:
            farm.employee_count = farm_update.employee_count

        session.add(farm)
        session.commit()
        session.refresh(farm)
        return farm



# @app.post("/createproduct/", response_model=CreateProductResponse)
# def createProduct(createProduct: CreateProduct):
#     with Database.get_session() as session:
#         db_product = ProductTable(
#             farm_id=createProduct.farm_id,
#             product_name=createProduct.product_name,
#             product_image=createProduct.product_image,
#             unit_price=createProduct.unit_price,
#             stock_amount=createProduct.stock_amount,
#             production_procedure=createProduct.production_procedure
#         )
#         session.add(db_product)
#         session.commit()
#         session.refresh(db_product)
#         print(db_product)
#         return CreateProductResponse(
#             msg="Success",product_name=createProduct.product_name)



@app.get("/getproduct/{product_id}", response_model=GetProductResponse)
def get_product(product_id: int):
    with Database.get_session as session:
        query = select(ProductTable).where(ProductTable.id == product_id)
        product = session.exec(query).first()
        farm_id = product.farm_id
        print(farm_id)
        query = select(FarmTable).where(FarmTable.id == farm_id)
        farm = session.exec(query).first()
        user_id = farm.user_id
        print(user_id)
        query = select(User).where(User.id == user_id)
        user = session.exec(query).first()
        return GetProductResponse(
            product_image=product.product_image,
            product_name=product.product_name,
            rating=product.rating,
            unit_price=product.unit_price,
            stock_amount=product.stock_amount,
            farm_name=user.fullname,
            farm_addresss=product.farm.address,
            production_procedure=product.production_procedure
        )

app.include_router(community_router)

app.include_router(post_router)
