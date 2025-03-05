from fastapi import APIRouter, Depends
from InvestmentBid import InvestmentBid
from AuthHandler import AuthHandler
from typing import List
from schemas import BidCreate

router = APIRouter(prefix='', tags=['Bid'])
investmentBid=InvestmentBid()


@router.post("/makebid/")
def makeInvestmentBid(offerId: int, investBid: BidCreate, currentUser=Depends(AuthHandler.get_current_user)):
        return investmentBid.bidInvestment(offerId, investBid, currentUser)


