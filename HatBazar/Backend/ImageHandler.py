from fastapi import Depends, File, HTTPException, UploadFile, status
import shutil
from uuid import uuid4
from sqlmodel import select
from Database import Database
from models import UserTable
from config import PROFILE_UPLOAD_DIR, PRODUCT_UPLOAD_DIR


class ImageHandler:
    @classmethod    
    def uploadProfilePhoto(cls, file: UploadFile, username):
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        file_extension = file.filename.split(".")[-1].lower()
        if file_extension not in ["jpg", "jpeg", "png", "gif"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only JPG, PNG, and GIF files are allowed"
            )
        
        filename = f"{username}_{uuid4()}.{file_extension}"
        file_path = PROFILE_UPLOAD_DIR / filename
        
        try:
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save image: {str(e)}"
            )
        finally:
            file.file.close()
        
        try:
            image_url = f"/static/profile_images/{filename}"
            
            with Database.get_session() as session:
                query = select(UserTable).where(UserTable.username == username)
                userOfProfile = session.exec(query).first()

                if not userOfProfile:
                    return HTTPException(status_code=404, detail="User not found!!")
                
                userOfProfile.profile_photo = image_url
                session.add(userOfProfile)
                session.commit()
                session.refresh(userOfProfile)

                return {
                    "imageUrl": image_url,
                    "message": "Profile photo updated successfully"
                }
        except Exception as e:
            if file_path.exists():
                file_path.unlink()
            
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update profile image in database: {str(e)}"
            )
        
    @classmethod
    def uploadProductImage(cls, file: UploadFile):
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        file_extension = file.filename.split(".")[-1].lower()
        if file_extension not in ["jpg", "jpeg", "png", "gif"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only JPG, PNG, and GIF files are allowed"
            )
        
        filename = f"product_{uuid4()}.{file_extension}"
        file_path = PRODUCT_UPLOAD_DIR / filename
        
        try:
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save image: {str(e)}"
            )
        finally:
            file.file.close()
        
        try:
            image_url = f"/static/product_images/{filename}"
            return image_url
        
        except Exception as e:
            raise HTTPException(status_code=404, detail="This file path not found!!")
        





