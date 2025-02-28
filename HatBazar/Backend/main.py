from fastapi import Depends, FastAPI, HTTPException
from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import User, Investor, Farm, Product
from schemas import UserCreate, UserLogin, LoginResponse, DashBoardResponse
from schemas import CreateFarm, CreateFarmResponse, FarmUpdate
from schemas import CreateProduct, CreateProductResponse, GetProductResponse
from fastapi.middleware.cors import CORSMiddleware
from jwt_handler import create_access_token, decode_access_token, get_password_hash, verify_password
from current_user_handler import get_current_user


app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5173/",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5173/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_db_and_tables()



@app.post("/signup/", response_model=LoginResponse)
def signup(user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, fullname=user.fullname, email=user.email, phone=user.phoneNumber, hashed_password=hashed_password)
    with Session(engine) as session:
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        login_response = login(userLogin=UserLogin(username=user.username, password=user.password))
        return LoginResponse(access_token=login_response.access_token, token_type=login_response.token_type)



@app.post("/login/", response_model=LoginResponse)
def login(userLogin: UserLogin):
    with Session(engine) as session:
        query = select(User).where(User.username == userLogin.username)
        db_user = session.exec(query).first()
        
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found!")
        
        if not verify_password(userLogin.password, db_user.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect password!")
        
        access_token = create_access_token(data={"sub": db_user.username})

        return LoginResponse(access_token=access_token, token_type="bearer")



@app.get("/dashboard/", response_model=DashBoardResponse)
def getDashBoard(current_user: User = Depends(get_current_user)):
    return DashBoardResponse(
        username=current_user.username,
        fullname=current_user.fullname,
        email=current_user.email,
        phone=current_user.phone
    )



@app.post("/createfarm/", response_model=CreateFarmResponse)
def createFarm(createFarm: CreateFarm):
    with Session(engine) as session:
        db_farm = Farm(user_id=createFarm.user_id)
        session.add(db_farm)
        session.commit()
        session.refresh(db_farm)
        return CreateFarmResponse(msg="Success", user_id=createFarm.user_id)



@app.get("/getfarm/{farm_id}")
def get_farm(farm_id: int):
    with Session(engine) as session:
        query = select(Farm).where(Farm.id == farm_id)
        farm = session.exec(query).first()
        return farm



@app.put("/updatefarm/{farm_id}")
def update_farm(farm_id: int, farm_update: FarmUpdate):
    with Session(engine) as session:
        farm = session.get(Farm, farm_id)
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
    with Session(engine) as session:
        db_product = Product(
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
        return CreateProductResponse(msg="Success",product_name=createProduct.product_name)



@app.get("/getproduct/{product_id}", response_model=GetProductResponse)
def get_product(product_id: int):
    with Session(engine) as session:
        query = select(Product).where(Product.id == product_id)
        product = session.exec(query).first()
        farm_id = product.farm_id
        print(farm_id)
        query = select(Farm).where(Farm.id == farm_id)
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