from fastapi import APIRouter, Depends
from Investment import Investment
from AuthHandler import AuthHandler
from typing import List
from schemas import OfferResponse

router = APIRouter(prefix='', tags=['Post'])

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
        return Investment.getInvestmentOffer()
