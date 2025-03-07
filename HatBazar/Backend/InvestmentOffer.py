from Database import Database
from schemas import OfferCreate, InvestmentResponse
from sqlmodel import select, update
from models import InvestmentOfferTable, FarmTable, InvestmentBidTable
from typing import List
from datetime import datetime, timezone
from fastapi import HTTPException
from Investment import Investment

class Offer:

          def postInvestment(self, investmentOffer, currentUser):
                    with Database.get_session() as session:
                              query=select(FarmTable).where(FarmTable.username==currentUser.username)
                              farmId=session.exec(query).first().id

                    newOffer=InvestmentOfferTable(
                              farm_id=farmId,
                              user_name=currentUser.username,
                              offer_description=investmentOffer.offer_description,
                              offer_creation_time=investmentOffer.offer_creation_time,
                              offer_investment_principle=investmentOffer.offer_investment_principle,
                              offer_investment_rate=investmentOffer.offer_investment_rate,
                              offer_share_dividing_period_month=investmentOffer.offer_share_dividing_period_month,
                              offer_investment_duration_month=investmentOffer.offer_investment_duration_month
                    )

                    tableRow=Database.write(newOffer)

                    if not tableRow:
                              raise HTTPException(status_code=500, detail="Error offer creating")
                    
                    return {'message': 'Offer created successfully'}  

          def acceptOffer(self, offerId, currentUser):
                    query=select(InvestmentOfferTable).where(InvestmentOfferTable.id==offerId)
                    offer=Database.read_one(query)
                    farmId=offer.farm_id
                    userId=currentUser.id

                    investmentResponse=InvestmentResponse(
                              principle=offer.offer_investment_principle,
                              rate=offer.offer_investment_rate,
                              share_dividing_month=offer.offer_share_dividing_period_month,
                              duration_month=offer.offer_investment_duration_month
                              
                    )


                    investment=Investment()
                    message=investment.makeOffer(farmId, userId, investmentResponse)
                    if not message:
                              raise HTTPException(status_code=500, detail="Error returning offer message")
                    return {'message': 'Offer accepted successfully'}

          def deleteOffer(self, offerId):
                    query = select(InvestmentBidTable).where(InvestmentBidTable.investment_offer_id == offerId)
                    bidtables = Database.read_all(query)


                    for bidtable in bidtables:
                              Database.delete(bidtable)

                    query=select(InvestmentOfferTable).where(InvestmentOfferTable.id==offerId)
                    offertable=Database.read_one(query)
                    Database.delete(offertable)

                    


          