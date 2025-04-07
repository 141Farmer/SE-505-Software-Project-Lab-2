from Database import Database
from schemas import OfferResponse, InvestmentResponse
from sqlmodel import select, update
from models import InvestmentBidTable, InvestmentOfferTable
from Investment import Investment
from typing import List
from datetime import datetime, timezone

class InvestmentBid:

          def bidInvestment(self, offerId, investBid, currentUser):
                    newBid=InvestmentBidTable(
                              investment_offer_id=offerId,
                              user_name=currentUser.username,
                              bid_investment_principle=investBid.bid_investment_principle,
                              bid_investment_rate=investBid.bid_investment_rate,
                              bid_share_dividing_period_month=investBid.bid_share_dividing_period_month,
                              bid_investment_duration_month=investBid.bid_investment_duration_month
                    )

                    tableRow=Database.write(newBid)

                    if not tableRow:
                              raise HTTPException(status_code=500, detail="Error offer creating")
                    
                    return {'message': 'Bid created successfully'}

          def acceptBid(self, bidId, currentUser):
                    query1=select(InvestmentBidTable).where(InvestmentBidTable.id==bidId)
                    bid=Database.read_one(query1)

                    offerId=bid.investment_offer_id
                    query2=select(InvestmentOfferTable).where(InvestmentOfferTable.id==offerId)
                    offer=Database.read_one(query2)
                    farmId=offer.farm_id

                    userId=currentUser.id

                    investmentResponse=InvestmentResponse(
                              principle=bid.bid_investment_principle,
                              rate=bid.bid_investment_rate,
                              share_dividing_month=bid.bid_share_dividing_period_month,
                              duration_month=bid.bid_investment_duration_month
                              
                    )

                    investment=Investment()
                    message=investment.makeOffer(farmId, userId, investmentResponse)
                    if not message:
                              raise HTTPException(status_code=500, detail="Error returning bid message")
                    return {'message': 'Bid accepted successfully'}
          

                    
