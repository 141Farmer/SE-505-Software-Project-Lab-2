from Database import Database
from schemas import PostResponse, CommentResponse, CommentCreate, VoteCreate, VoteCount
from sqlmodel import select, update
from sqlalchemy import func
from models import PostTable, CommentTable, VoteTable
from typing import List
from datetime import datetime, timezone
from fastapi import HTTPException

class Post:
          def votePost(self, voteCreate: VoteCreate, currentUser):
                    query=select(VoteTable).where((VoteTable.post_id == voteCreate.post_id) & (VoteTable.user_name == currentUser.username))
                    vote = Database.read_one(query)

                    newVote=VoteTable(
                              post_id=voteCreate.post_id,
                              user_name=currentUser.username,
                              value=voteCreate.voteValue
                    )


                    if not vote:
                              tableRow=Database.write(newVote)
                    else:
                              newVote.id=vote.id
                              tableRow=Database.update(newVote)

                    if not tableRow:
                              raise HTTPException(status_code=500, detail="Error vote adding")
                    with Database.get_session() as session:
                              upvote_query=select(func.count()).where(VoteTable.post_id == voteCreate.post_id, VoteTable.value == 1)
                              upvoteCount = session.exec(upvote_query).first() or 0
        
                              downvote_query = select(func.count()).where(VoteTable.post_id == voteCreate.post_id, VoteTable.value == -1)
                              downvoteCount = session.exec(downvote_query).first() or 0
                    return VoteCount(
                              upvote_count=upvoteCount,
                              downvote_count=downvoteCount
                    )
                    

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

          def commentCommunityPost(self, commentCreate: CommentCreate, currentUser):
                    newComment = CommentTable(
                              post_id=commentCreate.post_id,
                              user_name=currentUser.username, 
                              comment_text=commentCreate.comment,
                    )
                    tableRow=Database.write(newComment)
                    if not tableRow:
                              raise HTTPException(status_code=500, detail="Error comment creating")
                    return {'message': 'Comment added successfully'}
