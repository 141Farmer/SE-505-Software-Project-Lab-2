from Database import Database
from schemas import PostResponse, PostCreate
from sqlmodel import select, update
from models import PostTable, UserTable
from typing import List
from datetime import datetime, timezone

class Post:
          def votePost(post_id, vote, currentUser):
                    with Database.get_session() as session:
                              selectQuery=select(PostTable).where(post_id==PostTable.id)
                              post=session.exec(selectQuery).first()
                              
                              if not post:
                                        return {"error": "Post not found"}
                              
                              if vote==1:
                                        up_count=post.upvote_count+1
                                        do_count=post.do_count
                              else:
                                        up_count=post.upvote_count
                                        do_count=post.do_count+1

                              updateQuery=update(post).values(downvote_count=do_count, upvote_count=up_count)
                              
                              session.exec(updateQuery)

                    session.commit()
                    session.refresh()
                    return {'message': 'Vote addedd successfully'}


          def getComment(post_id: int):
                    with Database.get_session() as session:
                              query=select(CommentTable).where(post_id=CommentTable.post_id)
                              comments=session.exec(query).all() 

                              if not comments:
                                        raise ValueError("No post found")

                              commentResponses=[]

                              for comment in comments:
                                        commentResponses.append(
                                                  commentResponse(
                                                            comment_id=comment.id,
                                                            user_name=comment.user_name,
                                                            comment_text=comment.comment_text,
                                                            commented_time=comment.commented_time
                                                  )
                                        )
                    return commentResponses

          def commentCommunityPost(post_id: int, comment: str, currentUser):
                    with Database.get_session() as session:
                              new_comment = CommentTable(
                                        post_id=post_id,
                                        user_name=current_user.username, 
                                        comment_text=comment_text,
                                        commented_time=datetime.now(timezone.utc)
                              )

                    session.add(new_comment)
                    session.commit()
                    session.refresh(new_comment)

                    return {"message": "Comment added successfully"}
