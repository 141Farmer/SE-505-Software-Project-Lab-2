from fastapi import APIRouter, Depends
from Investment import Investment
from AuthHandler import AuthHandler
from typing import List
from schemas import OfferResponse, BidResponse, InvestmentResponse

router = APIRouter(prefix='', tags=['Investment'])
investment=Investment()

@router.post("/makeoffer/")
def makeInvestmentOffer(farm_id: int, user_id: int, investmentResponse: InvestmentResponse):
        return investment.makeOffer(farm_id, user_id, investmentResponse)


@router.get("/getoffer/", response_model=List[OfferResponse])
def getInvestmentOffer():
        return investment.getOffer()


@router.get("/getbid/", response_model=List[BidResponse])
def getInvestmentBid(offerId: int):
        return investment.getBid(offerId)