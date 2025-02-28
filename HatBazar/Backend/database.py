from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os
# from models import User, Post, Comment

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///default.db")


engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# def get_session():
#     with Session(engine) as session:
#         yield session