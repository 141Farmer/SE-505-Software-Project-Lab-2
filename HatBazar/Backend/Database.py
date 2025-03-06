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
      

    @classmethod
    def read_all(cls, query):
        with cls.get_session() as session:
            return session.exec(query).all()
        

    @classmethod
    def read_one(cls, query):
        with cls.get_session() as session:
            return session.exec(query).first()
        

    @classmethod
    def write(cls, tableElement):
        try:
            with cls.get_session() as session:
                session.add(tableElement)
                session.commit()
                session.refresh(tableElement)
                return tableElement
        except Exception as e:
            print(f"Error writing to database: {e}")
            return None
        
    
    @classmethod
    def delete(cls, tableElement):
        try:
            with cls.get_session() as session:
                session.delete(tableElement)
                session.commit()
                return True
        except Exception as e:
            print(f"Error deleting from database: {e}")
            return False
        

    @classmethod
    def update(cls, tableElement):
        try:
            with cls.get_session() as session:
                # Fetch the existing record
                existing_record = session.get(tableElement.__class__, tableElement.id)
                if not existing_record:
                    raise ValueError(f"Record with id {tableElement.id} not found in {tableElement.__class__.__name__}")

                # Update the fields of the existing record
                for key, value in tableElement.dict().items():
                    if key != "id":  # Avoid updating the primary key
                        setattr(existing_record, key, value)

                session.commit()
                session.refresh(existing_record)
                return existing_record
        except Exception as e:
            print(f"Error updating in database: {e}")
            return None
