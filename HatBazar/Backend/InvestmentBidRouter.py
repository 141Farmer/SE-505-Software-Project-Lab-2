from fastapi import APIRouter, Depends
from InvestmentBid import InvestmentBid
from Investment import Investment
from AuthHandler import AuthHandler
from typing import List
from schemas import BidCreate, InvestmentResponse

router = APIRouter(prefix='', tags=['Bid'])
investmentBid=InvestmentBid()



@router.post("/makebid/{offerId}")
def makeInvestmentBid(offerId: int, investBid: BidCreate, currentUser=Depends(AuthHandler.get_current_user)):
        return investmentBid.bidInvestment(offerId, investBid, currentUser)

@router.post("/acceptbid/")
def acceptInvestmentBid(offerId: int, currentUser=Depends(AuthHandler.get_current_user)):
        return investmentBid.acceptBid(offerId, currentUser)
