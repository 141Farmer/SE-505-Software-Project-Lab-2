from Database import Database
from schemas import PostResponse, CommentResponse
from sqlmodel import select, update
from models import PostTable, CommentTable, VoteTable
from typing import List
from datetime import datetime, timezone
from fastapi import HTTPException

class Post:
          def votePost(self, postId, voteValue, currentUser):
                    query=select(VoteTable).where((VoteTable.post_id == postId) & (VoteTable.user_name == currentUser.username))
                    vote = Database.read_one(query)

                    newVote=VoteTable(
                              post_id=postId,
                              user_name=currentUser.username,
                              value=voteValue
                    )


                    if not vote:
                              tableRow=Database.write(newVote)
                    else:
                              newVote.id=vote.id
                              tableRow=Database.update(newVote)

                    if not tableRow:
                              raise HTTPException(status_code=500, detail="Error vote adding")
                    return {'message': 'Vote added successfully'}

          def getComment(self, post_id: int) -> List[CommentResponse]:
                    query = select(CommentTable).where(CommentTable.post_id==post_id)
                    comments = Database.read_all(query=query)
                    if not comments:
                              raise HTTPException(status_code=404, detail="No comment found")
    
                    commentResponses=[]

                    for comment in comments:
                              commentResponses.append(
                                        CommentResponse(
                                                  comment_id=comment.id,
                                                  user_name=comment.user_name,
                                                  comment_text=comment.comment_text,
                                                  commented_time=comment.commented_time
                                        )
                              )
                    return commentResponses

          def commentCommunityPost(self, post_id: int, comment: str, currentUser):
                    newComment = CommentTable(
                              post_id=post_id,
                              user_name=currentUser.username, 
                              comment_text=comment,
                    )
                    tableRow=Database.write(newComment)
                    if not tableRow:
                              raise HTTPException(status_code=500, detail="Error comment creating")
                    return {'message': 'Comment added successfully'}
