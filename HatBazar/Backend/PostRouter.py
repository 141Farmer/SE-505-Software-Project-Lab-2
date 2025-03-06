from fastapi import APIRouter, Depends
from Post import Post
from AuthHandler import AuthHandler
from typing import List
from schemas import CommentResponse, CommentCreate, VoteCreate

router = APIRouter(prefix='', tags=['Post'])
post=Post()

@router.post("/votepost/")
def voteCommunityPost(voteCreate: VoteCreate, currentUser=Depends(AuthHandler.get_current_user)):
        return post.votePost(voteCreate, currentUser)

@router.post("/commentpost/")
def commentCommunityPost(commentCreate: CommentCreate, currentUser=Depends(AuthHandler.get_current_user)):
        return post.commentCommunityPost(commentCreate, currentUser)  

@router.get("/getcomment/{post_id}", response_model=List[CommentResponse])
def getPostComment(post_id: int):
        return post.getComment(post_id)
