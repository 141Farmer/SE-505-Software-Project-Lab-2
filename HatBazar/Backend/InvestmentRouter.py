from fastapi import APIRouter, Depends
from Investment import Investment
from AuthHandler import AuthHandler
from typing import List
from schemas import OfferResponse, BidResponse, InvestmentResponse

router = APIRouter(prefix='', tags=['Investment'])
investment=Investment()

@router.post("/makeinvestment/{offerId}")
def makeInvestmentOffer(offerId: int, investmentResponse: InvestmentResponse, currentUser=Depends(AuthHandler.get_current_user)):
        return investment.makeInvestment(offerId, investmentResponse, currentUser)


@router.get("/getoffer/", response_model=List[OfferResponse])
def getInvestmentOffer():
        return investment.getOffer()


@router.get("/getbid/{offer_id}", response_model=List[BidResponse])
def getInvestmentBid(offer_id: int):
        return investment.getBid(offer_id)