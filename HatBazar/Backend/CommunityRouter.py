from fastapi import APIRouter
from schemas import PostResponse
from Community import Community
from typing import List

router = APIRouter(prefix='',tags=['Community'])

@router.get("/getpost/", response_model=List[PostResponse])
def getCommunityPost(limit: int = 10, offset:int = 0):
        return Community.getPost(limit = limit, offset=offset)