from fastapi import APIRouter, Depends
from schemas import PostResponse, PostCreate
from Community import Community
from typing import List
from AuthHandler import AuthHandler

router = APIRouter(prefix='',tags=['Community'])


community = Community()

@router.get("/getpost/", response_model=List[PostResponse])
def getCommunityPost():
        return community.getPost()

@router.get("/getpost/{post_id}", response_model=PostResponse)
def getSingleCommunityPost(post_id):
        return community.getSinglePost(post_id)

@router.post("/addpost/")
def addCommunityPost(post: PostCreate, currentUser=Depends(AuthHandler.get_current_user)):
        return community.addPost(post, currentUser)

'''
community--                post
getpost--                  votepost
addpost--                  commentpost
deletepost               getcomment
'''