from fastapi import APIRouter, Depends
from InvestmentOffer import Offer
from Investment import Investment
from AuthHandler import AuthHandler
from typing import List
from schemas import OfferResponse, OfferCreate, InvestmentResponse

router = APIRouter(prefix='', tags=['Offer'])

offer=Offer()

@router.post("/postoffer/")
def postInvestmentOffer(investmentOffer: OfferCreate, currentUser=Depends(AuthHandler.get_current_user)):
        return offer.postInvestment(investmentOffer, currentUser)

@router.post("/acceptoffer/")
def acceptInvestmentOffer(offerId: int, currentUser=Depends(AuthHandler.get_current_user)):
        return offer.acceptOffer(offerId, currentUser)

@router.delete("/deleteoffer/{offerId}")
def deleteInvestmentOffer(offerId: int):
        return offer.deleteOffer(offerId)



