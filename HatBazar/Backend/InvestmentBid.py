from Database import Database
from schemas import OfferResponse
from sqlmodel import select, update
from models import InvestmentBidTable
from typing import List
from datetime import datetime, timezone

class InvestmentBid:
          def bidInvestment(self, offerId, investBid, currentUser):
                    newBid=InvestmentBidTable(
                              investment_offer_id=offerId,
                              user_name=currentUser.username,
                              bid_creation_time=investBid.bid_creation_time,
                              bid_investment_principle=investBid.bid_investment_principle,
                              bid_investment_rate=investBid.bid_investment_rate,
                              bid_share_dividing_period_month=investBid.bid_share_dividing_period_month,
                              bid_investment_duration_month=investBid.bid_investment_duration_month
                    )

                    tableRow=Database.write(newBid)

                    if not tableRow:
                              raise HTTPException(status_code=500, detail="Error offer creating")
                    
                    return {'message': 'Bid created successfully'}  

          

                    
