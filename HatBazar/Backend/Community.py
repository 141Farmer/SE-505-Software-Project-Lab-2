from Database import Database
from schemas import PostResponse, PostCreate
from sqlmodel import select
from models import PostTable, UserTable
from typing import List
from datetime import datetime, timezone

class Community:
          def addPost(post: PostCreate):
                    with Database.get_session() as session:
                              newPost=PostTable(
                                        user_name=post.user_name,
                                        post_title=post.post_title,
                                        post_content=post.post_content,
                                        upvote_count=0,
                                        downvote_count=0,
                                        posted_time=datetime.now(timezone.utc)
                              )
                    session.add(newPost)
                    session.commit()
                    session.refresh(newPost)
                    return {'message': 'Post created successfully'}

          def deletePost():
                    pass

          def getPost(limit: int = 10, offset: int = 0) -> List[PostResponse]:
                    with Database.get_session() as session:
                              posts = session.exec(select(PostTable).limit(limit).offset(offset)).all() 

                              if not posts:
                                        raise ValueError("No post found")

                              postResponses=[]

                              for post in posts:
                                        postResponses.append(
                                                  PostResponse(
                                                            post_id=post.id,
                                                            user_name=post.user_name,
                                                            post_title=post.post_title,
                                                            post_content=post.post_content,
                                                            upvote_count=post.upvote_count,
                                                            downvote_count=post.downvote_count,
                                                            posted_time=post.posted_time
                                                  )
                                        )
                              print(postResponses)
                              return postResponses
