from fastapi import APIRouter, Depends
from Investment import Investment
from AuthHandler import AuthHandler
from typing import List
from schemas import OfferResponse

router = APIRouter(prefix='', tags=['Post'])

@router.post("/makebid/")
def makeInvestmentOffer():
        return 


