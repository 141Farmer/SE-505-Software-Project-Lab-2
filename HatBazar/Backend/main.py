from fastapi import Depends, FastAPI, HTTPException
from sqlmodel import Session, select
from Database import Database
from User import User
from models import UserTable, InvestorTable, FarmTable, ProductTable
from schemas import UserCreate, UserLogin, LoginResponse, DashBoardResponse, UpdateUser
from schemas import CreateFarm, CreateFarmResponse, FarmUpdate
from schemas import CreateProduct, CreateProductResponse, GetProductResponse
from fastapi.middleware.cors import CORSMiddleware
# from HatBazar.Backend.AuthHandler import create_access_token, decode_access_token, get_password_hash, verify_password
# from current_user_handler import get_current_user
from AuthHandler import AuthHandler


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],  #origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Database.create_db_and_tables()
user = User()


@app.post("/signup/", response_model=LoginResponse)
def signup(userInfo: UserCreate):
    return user.register(userInfo.username, userInfo.fullname, userInfo.email, userInfo.phoneNumber, userInfo.password)


@app.post("/login/", response_model=LoginResponse)
def login(userLogin: UserLogin):
    return user.login(userLogin.username, userLogin.password)


@app.get("/dashboard/", response_model=DashBoardResponse)
def getDashBoard():
    return user.viewDashboard()


@app.put("/updateuser/", response_model=dict)
def updateUser(userToUpdate: UpdateUser):
    print(userToUpdate.fullname, userToUpdate.email, userToUpdate.phoneNumber)
    return user.updateProfile(userToUpdate.fullname, userToUpdate.email, userToUpdate.phoneNumber)


@app.delete("/deleteuser/", response_model=dict)
def deleteUser():
    return user.deleteAccount()


@app.post("/createfarm/", response_model=CreateFarmResponse)
def createFarm(createFarm: CreateFarm):
    with Database.get_session() as session:
        db_farm = FarmTable(user_id=createFarm.user_id)
        session.add(db_farm)
        session.commit()
        session.refresh(db_farm)
        return CreateFarmResponse(msg="Success", user_id=createFarm.user_id)



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



@app.post("/createproduct/", response_model=CreateProductResponse)
def createProduct(createProduct: CreateProduct):
    with Database.get_session() as session:
        db_product = ProductTable(
            farm_id=createProduct.farm_id,
            product_name=createProduct.product_name,
            product_image=createProduct.product_image,
            unit_price=createProduct.unit_price,
            stock_amount=createProduct.stock_amount,
            production_procedure=createProduct.production_procedure
        )
        session.add(db_product)
        session.commit()
        session.refresh(db_product)
        print(db_product)
        return CreateProductResponse(
            msg="Success",product_name=createProduct.product_name)



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