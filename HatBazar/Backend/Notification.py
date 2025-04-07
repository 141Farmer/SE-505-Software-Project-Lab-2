from sqlmodel import select
from email_config import EmailSchema
from email_service import send_email
from fastapi import BackgroundTasks
from Database import Database
from models import UserTable, NotificationTable

class Notification:
    def __init__(self, notificationTitle=None, notificationContent=None):
        self._notificationID = None
        self._notificationTitle = notificationTitle
        self._notificationContent = notificationContent
        self._notificationStatus = "unseen"
    
    def sendNotification(self, background_tasks, email_to, subject):
        """Add email sending to background tasks"""
        user_db = Database.read_one(select(UserTable).where(UserTable.email == email_to))
        email = EmailSchema(
            email=[email_to],
            subject=f"{subject}",
            body=f"""
            <html>
            <body>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
                    <h1 style="color: #4CAF50;">HATBAZAR</h1>
                    <p style="color: #333;">Your Organic Farming Marketplace</p>
                </div>

                <div style="padding: 20px;">
                    <p style="color: #333;">Dear {user_db.fullname},</p>
                </div>

                <div style="padding: 20px;">
                    <h2 style="color: #4CAF50;">{self._notificationTitle}</h2>
                </div>

                <div style="padding: 20px;">
                    <p style="color: #333;">{self._notificationContent}</p>
                </div>

                <div style="background-color: #4CAF50; padding: 20px; text-align: center; color: white;">
                    <p>Best regards,</p>
                    <p><strong>HATBAZAR Team</strong></p>
                    <p>Follow us on <a href="[Your Social Media Link]" style="color: white;">Social Media</a></p>
                    <p>Contact us at <a href="mailto:support@hatbazar.com" style="color: white;">support@hatbazar.com</a></p>
                </div>
            </body>
        </html>
            """
        )
        
        # Add email sending to background tasks
        background_tasks.add_task(send_email, email)
        return {"message": "Email notification scheduled for sending"}
    
    def storeNotification(self, email_to):
        """Store notification in database (synchronous version)"""
        user_db = Database.read_one(select(UserTable).where(UserTable.email == email_to))
        db_notification = NotificationTable(
            user_id=user_db.id,
            title=self._notificationTitle,
            content=self._notificationContent
        )
        db_notification_entry = Database.write(db_notification)
        self._notificationID = db_notification_entry.id
        return {"message": "Notification stored successfully"}