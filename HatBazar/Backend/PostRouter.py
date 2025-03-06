from fastapi import APIRouter, Depends
from Post import Post
from AuthHandler import AuthHandler
from typing import List
from schemas import CommentResponse

router = APIRouter(prefix='', tags=['Post'])
post=Post()

@router.post("/votepost/")
def voteCommunityPost(post_id: int, voteValue: int, currentUser=Depends(AuthHandler.get_current_user)):
        return post.votePost(post_id, voteValue, currentUser)

@router.post("/commentpost/")
def commentCommunityPost(post_id: int, comment: str, currentUser=Depends(AuthHandler.get_current_user)):
        return post.commentCommunityPost(post_id, comment, currentUser)  

@router.get("/getcomment/{post_id}", response_model=List[CommentResponse])
def getPostComment(post_id: int):
        return post.getComment(post_id)
