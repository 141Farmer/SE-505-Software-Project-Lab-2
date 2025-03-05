from Database import Database
from schemas import PostResponse, PostCreate
from sqlmodel import select
from models import PostTable, UserTable
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

    def getPost(self) -> List[PostResponse]:
        query = select(PostTable)
        posts = Database.read_all(query=query)
        if not posts:
            raise HTTPException(status_code=404, detail="No post found")
    
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
        return postResponses
