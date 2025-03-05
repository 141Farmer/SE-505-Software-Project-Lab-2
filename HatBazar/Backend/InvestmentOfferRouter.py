from fastapi import APIRouter, Depends
from InvestmentOffer import Offer
from AuthHandler import AuthHandler
from typing import List
from schemas import OfferResponse, OfferCreate

router = APIRouter(prefix='', tags=['Offer'])

offer=Offer()


@router.post("/postoffer/")
def postInvestmentOffer(investmentOffer: OfferCreate, currentUser=Depends(AuthHandler.get_current_user)):
        return offer.postInvestment(investmentOffer, currentUser)


'''
@router.post("/commentpost/")
def commentCommunityPost(post_id: int, comment: str, currentUser=Depends(AuthHandler.get_current_user)):
        return Post.commentCommunityPost(post_id, comment, currentUser)  

@router.get("/getoffer/", response_model=List[OfferResponse])
def getInvestmentOffer():
        return Offer.getComment()


offer               bid                 investment
postoffer           postbid
acceptbid
                                        showoffer
                                        saveoffer
'''