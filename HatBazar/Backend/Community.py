from Database import Database
from schemas import PostResponse, PostCreate
from sqlmodel import select
from sqlalchemy import func
from models import PostTable, UserTable, VoteTable
from typing import List
from fastapi import HTTPException

class Community:

    def __init__(self):
            pass


    def addPost(self, post: PostCreate, currentUser):
        newPost=PostTable(
            user_name=currentUser.username,
            post_title=post.post_title,
            post_content=post.post_content,
            upvote_count=0,
            downvote_count=0,
        )
        tableRow = Database.write(newPost)
        if not tableRow:
            raise HTTPException(status_code=500, detail="Error post creating")
        return {'message': 'Post created successfully'}

    def deletePost(self):
        pass

    def getSinglePost(self, post_id) -> PostResponse:
        query=select(PostTable).where(PostTable.id==post_id)
        post=Database.read_one(query)
        if not post:
            raise HTTPException(status_code=404, detail="No post found")

        with Database.get_session() as session:
                upvote_query=select(func.count()).where(VoteTable.post_id == post.id, VoteTable.value == 1)
                upvoteCount = session.exec(upvote_query).first() or 0
        
                downvote_query = select(func.count()).where(VoteTable.post_id == post.id, VoteTable.value == -1)
                downvoteCount = session.exec(downvote_query).first() or 0

        postResponse=PostResponse(
                    post_id=post.id,
                    user_name=post.user_name,
                    post_title=post.post_title,
                    post_content=post.post_content,
                    upvote_count=upvoteCount,
                    downvote_count=downvoteCount,
                    posted_time=post.posted_time
                )
        return postResponse


    def getPost(self) -> List[PostResponse]:
        query = select(PostTable)
        posts = Database.read_all(query=query)
        if not posts:
            raise HTTPException(status_code=404, detail="No post found")
    
        postResponses=[]

        for post in posts:
            with Database.get_session() as session:
                upvote_query=select(func.count()).where(VoteTable.post_id == post.id, VoteTable.value == 1)
                upvoteCount = session.exec(upvote_query).first() or 0
        
                downvote_query = select(func.count()).where(VoteTable.post_id == post.id, VoteTable.value == -1)
                downvoteCount = session.exec(downvote_query).first() or 0

            postResponses.append(
                PostResponse(
                    post_id=post.id,
                    user_name=post.user_name,
                    post_title=post.post_title,
                    post_content=post.post_content,
                    upvote_count=upvoteCount,
                    downvote_count=downvoteCount,
                    posted_time=post.posted_time
                )
            )
        return postResponses
