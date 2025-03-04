from fastapi import APIRouter, Depends
from Post import Post
from AuthHandler import AuthHandler
from typing import List
from schemas import CommentResponse

router = APIRouter(prefix='', tags=['Post'])

@router.post("/votepost/{post_id}")
def voteCommunityPost(post_id: int, vote: int, currentUser=Depends(AuthHandler.get_current_user)):
        return Post.votePost(post_id, vote, currentUser)

@router.post("/commentpost/")
def commentCommunityPost(post_id: int, comment: str, currentUser=Depends(AuthHandler.get_current_user)):
        return Post.commentCommunityPost(post_id, comment, currentUser)  

@router.get("/getcomment/{post_id}", response_model=List[CommentResponse])
def getPostComment(post_id: int):
        return Post.getComment(post_id)
