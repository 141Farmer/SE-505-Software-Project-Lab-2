from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os

load_dotenv()



class Database:
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL is not set in the environment variables.")
    
    engine = create_engine(DATABASE_URL, echo=True)


    @classmethod
    def create_db_and_tables(cls):
        SQLModel.metadata.create_all(cls.engine)


    @classmethod
    def get_session(cls):
        return Session(cls.engine)