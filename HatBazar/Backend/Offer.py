from Database import Database
from schemas import PostResponse, CommentResponse
from sqlmodel import select, update
from models import PostTable, CommentTable
from typing import List
from datetime import datetime, timezone

class Offer:
          def votePost(post_id, vote, currentUser):
                    with Database.get_session() as session:
                              selectQuery = select(PostTable).where(PostTable.id == post_id)
                              post = session.exec(selectQuery).first()

                              if not post:
                                        return {"error": "Post not found"}

                              if vote == 1:
                                        up_count = post.upvote_count + 1
                                        do_count = post.downvote_count
                              else:
                                        up_count = post.upvote_count
                                        do_count = post.downvote_count + 1

                              updateQuery = update(PostTable).where(PostTable.id == post_id).values(
                                        downvote_count=do_count, 
                                        upvote_count=up_count
                              )
                              session.exec(updateQuery)
                              session.commit()

                    return {'message': 'Vote added successfully'}

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
