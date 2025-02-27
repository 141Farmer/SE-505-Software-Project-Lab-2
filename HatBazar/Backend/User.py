from fastapi import HTTPException
from sqlmodel import select
from Database import Database
from AuthHandler import AuthHandler
from models import UserTable
from schemas import LoginResponse, DashBoardResponse


class User:

    def __init__(self, username=None, fullname=None, email=None, phoneNumber=None, hashedPassword=None):
        self._username = username
        self._fullname = fullname
        self._email = email
        self._phoneNumber = phoneNumber
        self._hashedPassword = hashedPassword


    def register(self, username, fullname, email, phone, password):
        self._username = username
        self._fullname = fullname
        self._email = email
        self._phoneNumber = phone

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
            
            self._username = db_user.username
            self._fullname = db_user.fullname
            self._email = db_user.email
            self._phoneNumber = db_user.phone
            
            access_token = AuthHandler.create_access_token(data={"sub": db_user.username})

            return LoginResponse(access_token=access_token, token_type="bearer")


    def viewDashboard(self) -> DashBoardResponse:
        return DashBoardResponse(
        username=self._username,
        fullname=self._fullname,
        email=self._email,
        phone=self._phoneNumber
    )


    def updateProfile(self, ):
        pass


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
            self.__init__()
            return {"message": "User deleted successfully"}
            


    def manageNotification(self, ):
        pass

    # def postInCommunity(self, ):
    #     pass
    #                                               #hampers single responsibility
    # def commentInPost(self, ):              
    #     pass


