from fastapi import APIRouter, Depends
from Offer import Offer
from AuthHandler import AuthHandler
from typing import List
from schemas import OfferResponse

router = APIRouter(prefix='', tags=['Offer'])

@router.post("/votepost/{post_id}")
def voteCommunityPost(post_id: int, vote: int, currentUser=Depends(AuthHandler.get_current_user)):
        return Post.votePost(post_id, vote, currentUser)

@router.post("/commentpost/")
def commentCommunityPost(post_id: int, comment: str, currentUser=Depends(AuthHandler.get_current_user)):
        return Post.commentCommunityPost(post_id, comment, currentUser)  

@router.get("/getoffer/", response_model=List[OfferResponse])
def getInvestmentOffer():
        return Offer.getComment()

'''
offer               bid                 investment
postoffer           postbid
acceptbid
                                        showoffer
                                        saveoffer
'''