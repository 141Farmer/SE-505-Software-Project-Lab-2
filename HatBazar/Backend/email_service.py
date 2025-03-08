from fastapi import BackgroundTasks
from email_config import get_email_config, EmailSchema
from fastapi_mail import FastMail, MessageSchema

async def send_email(email: EmailSchema):
    """Send an email asynchronously"""
    message = MessageSchema(
        subject=email.subject,
        recipients=email.email,
        body=email.body,
        subtype="html"
    )
    
    fm = FastMail(get_email_config())
    await fm.send_message(message)
    return {"status": "email sent"}