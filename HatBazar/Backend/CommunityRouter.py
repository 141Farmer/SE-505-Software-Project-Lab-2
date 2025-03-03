from fastapi import APIRouter, Depends
from schemas import PostResponse, PostCreate
from Community import Community
from typing import List
from AuthHandler import AuthHandler

router = APIRouter(prefix='',tags=['Community'])

@router.get("/getpost/", response_model=List[PostResponse])
def getCommunityPost(limit: int = 10, offset:int = 0):
        return Community.getPost(limit = limit, offset=offset)

@router.post("/addpost/")
def addCommunityPost(post: PostCreate, currentUser=Depends(AuthHandler.get_current_user)):
        return Community.addPost(post, currentUser)