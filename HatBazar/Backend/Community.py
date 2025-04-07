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

        upvoteCount=Database.get_upvote_count(post_id)
        downvoteCount=Database.get_downvote_count(post_id)

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
            
            upvoteCount=Database.get_upvote_count(post.id)
            downvoteCount=Database.get_downvote_count(post.id)
            
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
