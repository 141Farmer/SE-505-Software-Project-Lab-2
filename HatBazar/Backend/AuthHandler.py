from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import select
import os
from Database import Database
from models import UserTable

load_dotenv()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class AuthHandler:
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM")
    ACCESS_TOKEN_EXPIRE_DAYS = int(os.getenv("ACCESS_TOKEN_EXPIRE_DAYS", 7))  # Default to 7 days
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


    @classmethod
    def get_password_hash(cls, password: str) -> str:
        return cls.pwd_context.hash(password)


    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        return cls.pwd_context.verify(plain_password, hashed_password)


    @classmethod
    def create_access_token(cls, data: dict, expires_delta: timedelta | None = None) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta if expires_delta else timedelta(days=cls.ACCESS_TOKEN_EXPIRE_DAYS))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, cls.SECRET_KEY, algorithm=cls.ALGORITHM)


    @classmethod
    def decode_access_token(cls, token: str) -> dict | None:
        try:
            return jwt.decode(token, cls.SECRET_KEY, algorithms=[cls.ALGORITHM])
        except JWTError:
            return None
        

    @classmethod
    def get_current_user(cls, token: str = Depends(oauth2_scheme)):
        print("Received Token:", token)  # ✅ Debug: Check token
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        payload = cls.decode_access_token(token)
        print("Decoded Token:", payload)  # ✅ Debug: Check decoded content

        if payload is None:
            raise credentials_exception

        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception

        with Database.get_session() as session:
            query = select(UserTable).where(UserTable.username == username)
            db_user = session.exec(query).first()
            if db_user is None:
                raise credentials_exception

        print("Authenticated User:", db_user.username)  # ✅ Debug: Check retrieved user
        return db_user

