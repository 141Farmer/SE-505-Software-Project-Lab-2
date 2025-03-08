
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr, BaseModel
from typing import List
from dotenv import load_dotenv
import os

load_dotenv()

class EmailSettings(BaseModel):
    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD")
    MAIL_FROM: str = os.getenv("MAIL_FROM")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", 587))
    MAIL_SERVER: str = os.getenv("MAIL_SERVER")
    MAIL_FROM_NAME: str = os.getenv("MAIL_FROM_NAME")

class EmailSchema(BaseModel):
    email: List[EmailStr]
    subject: str
    body: str

def get_email_config():
    email_settings = EmailSettings()
    
    conf = ConnectionConfig(
        MAIL_USERNAME=email_settings.MAIL_USERNAME,
        MAIL_PASSWORD=email_settings.MAIL_PASSWORD,
        MAIL_FROM=email_settings.MAIL_FROM,
        MAIL_PORT=email_settings.MAIL_PORT,
        MAIL_SERVER=email_settings.MAIL_SERVER,
        MAIL_FROM_NAME=email_settings.MAIL_FROM_NAME,
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True
    )
    
    return conf
