from Database import Database
from schemas import OfferCreate
from sqlmodel import select, update
from models import InvestmentOfferTable, FarmTable
from typing import List
from datetime import datetime, timezone
from fastapi import HTTPException

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


          '''
          def getOffers():
                    print('Post id is',post_id)
                    with Database.get_session() as session:
                              query = select(CommentTable).where(CommentTable.post_id == post_id)
                              comments = session.exec(query).all()
                              if not comments:
                                        raise ValueError("No post found")

                              commentResponses = [
                                        CommentResponse(
                                                  comment_id=comment.id,
                                                  user_name=comment.user_name,
                                                  comment_text=comment.comment_text,
                                                  commented_time=comment.commented_time
                                        )
                                        for comment in comments
                              ]

                              return commentResponses

          def commentCommunityPost(post_id: int, comment: str, currentUser):
                    with Database.get_session() as session:
                              new_comment = CommentTable(
                                        post_id=post_id,
                                        user_name=currentUser.username, 
                                        comment_text=comment,
                                        commented_time=datetime.now(timezone.utc)
                              )
                              session.add(new_comment)  
                              session.commit()
                              session.refresh(new_comment)

                    return {"message": "Comment added successfully"}
          '''