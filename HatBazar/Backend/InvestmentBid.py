from Database import Database
from schemas import OfferResponse
from sqlmodel import select, update
from models import InvestmentBidTable
from typing import List
from datetime import datetime, timezone

class Investment:
          def makeInvestmentOffer(post_id):
                    with Database.get_session() as session:
                              newBid=InvestmentBidTable(
                                        user_name=currentUser.username,
                                        post_title=post.post_title,
                                        post_content=post.post_content,
                                        upvote_count=0,
                                        downvote_count=0,
                                        posted_time=datetime.now(timezone.utc)
                              )
                    session.add(newBid)
                    session.commit()
                    session.refresh(newBid)
                    return {'message': 'Bid created successfully'}

          

                    
