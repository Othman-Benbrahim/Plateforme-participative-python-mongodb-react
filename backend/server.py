from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
import shutil

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

class Idea(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    tags: List[str] = []
    author_id: str
    author_name: str
    votes_up: int = 0
    votes_down: int = 0
    user_votes: dict = {}  # {user_id: "up" or "down"}
    comments_count: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class IdeaCreate(BaseModel):
    title: str
    description: str
    tags: List[str] = []

class Comment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    idea_id: str
    user_id: str
    user_name: str
    text: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class CommentCreate(BaseModel):
    idea_id: str
    text: str

class VoteAction(BaseModel):
    action: str  # "up", "down", or "remove"

class Stats(BaseModel):
    participants: int
    proposals: int
    votes: int
    comments: int

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")

# Auth Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(email=user_data.email, name=user_data.name)
    user_dict = user.model_dump()
    user_dict["password"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc or not verify_password(credentials.password, user_doc["password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    user = User(**user_doc)
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Ideas Routes
@api_router.post("/ideas", response_model=Idea)
async def create_idea(idea_data: IdeaCreate, current_user: User = Depends(get_current_user)):
    idea = Idea(
        **idea_data.model_dump(),
        author_id=current_user.id,
        author_name=current_user.name
    )
    await db.ideas.insert_one(idea.model_dump())
    return idea

@api_router.get("/ideas", response_model=List[Idea])
async def get_ideas(sort: Optional[str] = "recent", search: Optional[str] = None, tag: Optional[str] = None):
    query = {}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    if tag:
        query["tags"] = tag
    
    # Sorting
    sort_order = [("created_at", -1)]  # default: recent
    if sort == "top":
        ideas_cursor = db.ideas.find(query, {"_id": 0})
        ideas = await ideas_cursor.to_list(1000)
        ideas.sort(key=lambda x: x["votes_up"] - x["votes_down"], reverse=True)
        return ideas
    elif sort == "active":
        sort_order = [("comments_count", -1), ("created_at", -1)]
    
    ideas = await db.ideas.find(query, {"_id": 0}).sort(sort_order).to_list(1000)
    return ideas

@api_router.get("/ideas/{idea_id}", response_model=Idea)
async def get_idea(idea_id: str):
    idea = await db.ideas.find_one({"id": idea_id}, {"_id": 0})
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    return Idea(**idea)

@api_router.post("/ideas/{idea_id}/vote")
async def vote_idea(idea_id: str, vote: VoteAction, current_user: User = Depends(get_current_user)):
    idea = await db.ideas.find_one({"id": idea_id}, {"_id": 0})
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    user_votes = idea.get("user_votes", {})
    previous_vote = user_votes.get(current_user.id)
    
    # Remove previous vote if exists
    if previous_vote == "up":
        idea["votes_up"] -= 1
    elif previous_vote == "down":
        idea["votes_down"] -= 1
    
    # Apply new vote
    if vote.action == "remove":
        user_votes.pop(current_user.id, None)
    elif vote.action in ["up", "down"]:
        user_votes[current_user.id] = vote.action
        if vote.action == "up":
            idea["votes_up"] += 1
        else:
            idea["votes_down"] += 1
    
    # Update database
    await db.ideas.update_one(
        {"id": idea_id},
        {"$set": {
            "votes_up": idea["votes_up"],
            "votes_down": idea["votes_down"],
            "user_votes": user_votes
        }}
    )
    
    return {"success": True, "votes_up": idea["votes_up"], "votes_down": idea["votes_down"]}

# Comments Routes
@api_router.post("/comments", response_model=Comment)
async def create_comment(comment_data: CommentCreate, current_user: User = Depends(get_current_user)):
    comment = Comment(
        **comment_data.model_dump(),
        user_id=current_user.id,
        user_name=current_user.name
    )
    await db.comments.insert_one(comment.model_dump())
    
    # Increment comment count
    await db.ideas.update_one(
        {"id": comment_data.idea_id},
        {"$inc": {"comments_count": 1}}
    )
    
    return comment

@api_router.get("/comments/{idea_id}", response_model=List[Comment])
async def get_comments(idea_id: str):
    comments = await db.comments.find({"idea_id": idea_id}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return comments

# Stats Route
@api_router.get("/stats", response_model=Stats)
async def get_stats():
    participants = await db.users.count_documents({})
    proposals = await db.ideas.count_documents({})
    
    # Count total votes
    ideas = await db.ideas.find({}, {"_id": 0, "votes_up": 1, "votes_down": 1}).to_list(10000)
    votes = sum(idea["votes_up"] + idea["votes_down"] for idea in ideas)
    
    comments = await db.comments.count_documents({})
    
    return Stats(
        participants=participants,
        proposals=proposals,
        votes=votes,
        comments=comments
    )

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()