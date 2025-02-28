from fastapi import HTTPException
from sqlmodel import select
from Database import Database
from AuthHandler import AuthHandler
from models import UserTable
from schemas import LoginResponse, DashBoardResponse



class User:

    def __init__(self, username=None, fullname=None, email=None, phoneNumber=None, profile_photo_url=None, hashedPassword=None):
        self._username = username
        self._fullname = fullname
        self._email = email
        self._phoneNumber = phoneNumber
        self._profile_photo_url = profile_photo_url
        self._hashedPassword = hashedPassword


    def register(self, username, fullname, email, phone, password):
        self.__init__(username, fullname, email, phone)

        db_user = UserTable(username=self._username, fullname=self._fullname, email=self._email, 
                            phone=self._phoneNumber, hashed_password=AuthHandler.get_password_hash(password))
        with Database.get_session() as session:
            session.add(db_user)
            session.commit()
            session.refresh(db_user)
            login_response = self.login(username, password)
            return LoginResponse(access_token=login_response.access_token, token_type=login_response.token_type)


    def login(self, username, password):

        with Database.get_session() as session:
            query = select(UserTable).where(UserTable.username == username)
            db_user = session.exec(query).first()
            
            if not db_user:
                raise HTTPException(status_code=404, detail="User not found!")
            
            if not AuthHandler.verify_password(password, db_user.hashed_password):
                raise HTTPException(status_code=401, detail="Incorrect password!")
            
            self.__init__(db_user.username, db_user.fullname, db_user.email, db_user.phone)
            
            access_token = AuthHandler.create_access_token(data={"sub": db_user.username})

            return LoginResponse(access_token=access_token, token_type="bearer")


    def viewDashboard(self) -> DashBoardResponse:
        with Database.get_session() as session:
            query = select(UserTable).where(UserTable.username==self._username)
            profile_photo_url_relative = session.exec(query).first().profile_photo
            self._profile_photo_url = f"http://127.0.0.1:8000{profile_photo_url_relative}"
            print(self._profile_photo_url)

            return DashBoardResponse(
                username=self._username,
                fullname=self._fullname,
                email=self._email,
                phone=self._phoneNumber,
                profile_photo_url=self._profile_photo_url
            )


    def updateProfile(self, fullname=None, email=None, phoneNumber=None):
        
        with Database.get_session() as session:
            query = select(UserTable).where(UserTable.username == self._username)
            userToUpdate = session.exec(query).first()

            if not userToUpdate:
                return HTTPException(status_code=404, detail="User not found!!")
            
            userToUpdate.fullname = fullname
            userToUpdate.email = email
            userToUpdate.phone = phoneNumber
            session.add(userToUpdate)
            session.commit()
            session.refresh(userToUpdate)
            self._fullname = fullname
            self._email = email
            self._phoneNumber = phoneNumber
            return {"message": "User updated successfully"}

        


    # def logout(self, ):               # handled in frontend
    #     pass                          #instead there should be deleteAccount()


    def deleteAccount(self) -> dict:
        with Database.get_session() as session:
            query = select(UserTable).where(UserTable.username == self._username)
            userToDelete = session.exec(query).first()

            if not userToDelete:
                return HTTPException(status_code=404, detail="User not found!!")
            
            session.delete(userToDelete)
            session.commit()
            session.refresh(userToDelete)
            self.__init__()
            return {"message": "User deleted successfully"}
            


    def manageNotification(self, ):
        pass

    # def postInCommunity(self, ):
    #     pass
    #                                               #hampers single responsibility
    # def commentInPost(self, ):              
    #     pass


