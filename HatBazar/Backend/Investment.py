from Database import Database
from schemas import OfferResponse
from sqlmodel import select, update
from models import InvestmentOfferTable
from typing import List
from datetime import datetime, timezone

class Investment:
          def makeInvestmentOffer(post_id, vote, currentUser):
                   

                    return {'message': 'Vote added successfully'}

          def makeInvestmentOffer(post_id: int):
                    pass
                              

          def getInvestmentOffer():
                    with Database.get_session() as session:
                              query=select(InvestmentOfferTable)
                              offers=session.exec(query).all()
                              

                              if not offers:
                                        raise ValueError("No offer found")

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

                    
