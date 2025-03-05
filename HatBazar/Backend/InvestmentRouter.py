from fastapi import APIRouter, Depends
from Investment import Investment
from AuthHandler import AuthHandler
from typing import List
from schemas import OfferResponse, BidResponse

router = APIRouter(prefix='', tags=['Investment'])
investment=Investment()

@router.post("/makeoffer/")
def makeInvestmentOffer():
        return 

'''
@router.post("/commentpost/")
def returnInvestmentShare():
        return   
'''

@router.get("/getoffer/", response_model=List[OfferResponse])
def getInvestmentOffer():
        return investment.getOffer()


@router.get("/getbid/", response_model=List[BidResponse])
def getInvestmentBid(offerId: int):
        return investment.getBid(offerId)