from Database import Database
from schemas import OfferResponse, BidResponse, InvestmentResponse
from sqlmodel import select, update
from models import InvestmentOfferTable, InvestmentBidTable, InvestmentTable
from typing import List
from datetime import datetime, timezone

class Investment:

          def makeInvestment(self, farmId: int, userId: int, investmentResponse: InvestmentResponse):
                    newInvestment=InvestmentTable(
                              farm_id=farmId,
                              user_id=userId,
                              investment_principle=investmentResponse.principle,
                              investment_rate=investmentResponse.rate,
                              share_dividing_period_month=investmentResponse.share_dividing_month,
                              investment_duration_month=investmentResponse.duration_month,
                              transaction_id=f''
                    )

                    tableRow=Database.write(newInvestment)

                    if not tableRow:
                              raise HTTPException(status_code=500, detail="Error investment creating")
                    
                    return {'message': 'Investment created successfully'}


          def getOffer(self):
                    query=select(InvestmentOfferTable)
                    offers=Database.read_all(query)
                              
                    if not offers:
                              raise HTTPException(status_code=404, detail="No Offer found")

                    offerResponses=[]

                    for offer in offers:
                              offerResponses.append(
                                        OfferResponse(
                                                  offer_id=offer.id,
                                                  user_name=offer.user_name,
                                                  offer_description=offer.offer_description,
                                                  offer_creation_time=offer.offer_creation_time,
                                                  offer_investment_principle=offer.offer_investment_principle,
                                                  offer_investment_rate=offer.offer_investment_rate,
                                                  offer_share_dividing_period_month=offer.offer_share_dividing_period_month,
                                                  offer_investment_duration_month=offer.offer_investment_duration_month
                                        )
                              )
                    return offerResponses
          

          def getBid(self, offerId):
                    query=select(InvestmentBidTable).where(InvestmentBidTable.investment_offer_id==offerId)
                    bids=Database.read_all(query)
                              
                    if not bids:
                              raise HTTPException(status_code=404, detail="No Bid found")

                    bidResponses=[]

                    for bid in bids:
                              bidResponses.append(
                                        BidResponse(
                                                  bid_id=bid.id,
                                                  user_name=bid.user_name,
                                                  bid_creation_time=bid.bid_creation_time,
                                                  bid_investment_principle=bid.bid_investment_principle,
                                                  bid_investment_rate=bid.bid_investment_rate,
                                                  bid_share_dividing_period_month=bid.bid_share_dividing_period_month,
                                                  bid_investment_duration_month=bid.bid_investment_duration_month
                                        )
                              )
                    return bidResponses