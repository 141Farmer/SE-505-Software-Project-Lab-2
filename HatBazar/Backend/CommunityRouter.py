from fastapi import APIRouter
from schemas import PostResponse, PostCreate
from Community import Community
from typing import List

router = APIRouter(prefix='',tags=['Community'])

@router.get("/getpost/", response_model=List[PostResponse])
def getCommunityPost(limit: int = 10, offset:int = 0):
        return Community.getPost(limit = limit, offset=offset)

@router.post("/addpost/")
def addCommunityPost(post: PostCreate):
        return Community.addPost(post)