from fastapi import APIRouter, Depends, File, UploadFile
from schemas import LoginResponse, DashBoardResponse, UpdateUser, UserCreate, UserLogin
from AuthHandler import AuthHandler
from User import User
from ImageHandler import ImageHandler

user_router = APIRouter(prefix="", tags=["User"])

user = User()

@user_router.post("/signup/", response_model=LoginResponse)
def signup(userInfo: UserCreate):
    return user.register(userInfo.username, userInfo.fullname, userInfo.email, userInfo.phoneNumber, userInfo.password)

@user_router.post("/login/", response_model=LoginResponse)
def login(userLogin: UserLogin):
    return user.login(userLogin.username, userLogin.password)

@user_router.get("/dashboard/", response_model=DashBoardResponse)
def getDashBoard():
    return user.viewDashboard()

@user_router.put("/updateuser/", response_model=dict)
def updateUser(userToUpdate: UpdateUser):
    return user.updateProfile(userToUpdate.fullname, userToUpdate.email, userToUpdate.phoneNumber)

@user_router.delete("/deleteuser/", response_model=dict)
def deleteUser():
    return user.deleteAccount()

@user_router.post("/upload-profile-image/")
async def upload_profile_image(file: UploadFile = File(...), current_user=Depends(AuthHandler.get_current_user)):
    return ImageHandler.uploadProfilePhoto(file, current_user.username)