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

# Upload directory
UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Enums
class UserRole(str, Enum):
    USER = "user"
    MODERATOR = "moderator"
    ADMIN = "admin"

class IdeaStatus(str, Enum):
    DISCUSSION = "discussion"
    APPROVED = "approved"
    REJECTED = "rejected"
    IN_PROGRESS = "in_progress"

class ReportStatus(str, Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    RESOLVED = "resolved"

class BadgeType(str, Enum):
    CONTRIBUTOR = "contributor"
    ACTIVE_VOTER = "active_voter"
    IDEA_CREATOR = "idea_creator"
    TOP_CONTRIBUTOR = "top_contributor"
    COMMUNITY_LEADER = "community_leader"

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    role: UserRole = UserRole.USER
    is_banned: bool = False
    badges: List[str] = []
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

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Attachment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    original_filename: str
    file_type: str
    file_size: int
    url: str
    uploaded_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Idea(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    tags: List[str] = []
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    status: IdeaStatus = IdeaStatus.DISCUSSION
    author_id: str
    author_name: str
    votes_up: int = 0
    votes_down: int = 0
    user_votes: dict = {}  # {user_id: "up" or "down"}
    comments_count: int = 0
    attachments: List[Attachment] = []
    is_reported: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: Optional[str] = None

class IdeaCreate(BaseModel):
    title: str
    description: str
    tags: List[str] = []
    category_id: Optional[str] = None

class IdeaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    category_id: Optional[str] = None
    status: Optional[IdeaStatus] = None

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

class Report(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content_type: str  # "idea" or "comment"
    content_id: str
    reporter_id: str
    reporter_name: str
    reason: str
    description: Optional[str] = None
    status: ReportStatus = ReportStatus.PENDING
    reviewed_by: Optional[str] = None
    resolution: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    reviewed_at: Optional[str] = None

class ReportCreate(BaseModel):
    content_type: str
    content_id: str
    reason: str
    description: Optional[str] = None

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # "comment", "reply", "vote", "badge", "status_change"
    title: str
    message: str
    link: Optional[str] = None
    is_read: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Poll(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    options: List[str]
    votes: Dict[str, int] = {}  # {option: count}
    user_votes: Dict[str, str] = {}  # {user_id: option}
    author_id: str
    author_name: str
    category_id: Optional[str] = None
    ends_at: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class PollCreate(BaseModel):
    title: str
    description: Optional[str] = None
    options: List[str]
    category_id: Optional[str] = None
    ends_at: Optional[str] = None

class PollVote(BaseModel):
    option: str

class Stats(BaseModel):
    participants: int
    proposals: int
    votes: int
    comments: int
    categories: int
    polls: int

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
        if user.get("is_banned", False):
            raise HTTPException(status_code=403, detail="User account is banned")
        return User(**user)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication")

async def get_current_moderator(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.MODERATOR, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Moderator access required")
    return current_user

async def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

async def award_badge(user_id: str, badge_type: BadgeType):
    """Award a badge to a user if they don't already have it"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user and badge_type.value not in user.get("badges", []):
        await db.users.update_one(
            {"id": user_id},
            {"$push": {"badges": badge_type.value}}
        )
        # Create notification
        notification = Notification(
            user_id=user_id,
            type="badge",
            title="Nouveau badge obtenu!",
            message=f"Félicitations! Vous avez obtenu le badge '{badge_type.value}'",
        )
        await db.notifications.insert_one(notification.model_dump())

async def check_and_award_badges(user_id: str):
    """Check user activity and award appropriate badges"""
    # Count user's ideas
    ideas_count = await db.ideas.count_documents({"author_id": user_id})
    if ideas_count >= 1:
        await award_badge(user_id, BadgeType.IDEA_CREATOR)
    if ideas_count >= 10:
        await award_badge(user_id, BadgeType.TOP_CONTRIBUTOR)
    
    # Count user's votes
    ideas = await db.ideas.find({}, {"_id": 0, "user_votes": 1}).to_list(10000)
    votes_count = sum(1 for idea in ideas if user_id in idea.get("user_votes", {}))
    if votes_count >= 20:
        await award_badge(user_id, BadgeType.ACTIVE_VOTER)
    
    # Count user's comments
    comments_count = await db.comments.count_documents({"user_id": user_id})
    if comments_count >= 10:
        await award_badge(user_id, BadgeType.CONTRIBUTOR)

# Auth Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user - first user becomes admin
    users_count = await db.users.count_documents({})
    user_role = UserRole.ADMIN if users_count == 0 else UserRole.USER
    
    hashed_password = get_password_hash(user_data.password)
    user = User(email=user_data.email, name=user_data.name, role=user_role)
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

# Category Routes
@api_router.post("/categories", response_model=Category)
async def create_category(category: Category, admin: User = Depends(get_current_admin)):
    await db.categories.insert_one(category.model_dump())
    return category

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).sort("name", 1).to_list(100)
    return categories

@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, name: str, description: Optional[str] = None, 
                         icon: Optional[str] = None, color: Optional[str] = None,
                         admin: User = Depends(get_current_admin)):
    category = await db.categories.find_one({"id": category_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = {"name": name}
    if description is not None:
        update_data["description"] = description
    if icon is not None:
        update_data["icon"] = icon
    if color is not None:
        update_data["color"] = color
    
    await db.categories.update_one({"id": category_id}, {"$set": update_data})
    updated_category = await db.categories.find_one({"id": category_id}, {"_id": 0})
    return Category(**updated_category)

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, admin: User = Depends(get_current_admin)):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"success": True}

# Ideas Routes
@api_router.post("/ideas", response_model=Idea)
async def create_idea(idea_data: IdeaCreate, current_user: User = Depends(get_current_user)):
    # Get category name if category_id provided
    category_name = None
    if idea_data.category_id:
        category = await db.categories.find_one({"id": idea_data.category_id}, {"_id": 0})
        if category:
            category_name = category["name"]
    
    idea = Idea(
        **idea_data.model_dump(),
        author_id=current_user.id,
        author_name=current_user.name,
        category_name=category_name
    )
    await db.ideas.insert_one(idea.model_dump())
    
    # Award badge for creating ideas
    await check_and_award_badges(current_user.id)
    
    return idea

@api_router.get("/ideas", response_model=List[Idea])
async def get_ideas(sort: Optional[str] = "recent", search: Optional[str] = None, 
                   tag: Optional[str] = None, category_id: Optional[str] = None,
                   status: Optional[IdeaStatus] = None):
    query = {}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    if tag:
        query["tags"] = tag
    if category_id:
        query["category_id"] = category_id
    if status:
        query["status"] = status.value
    
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

@api_router.put("/ideas/{idea_id}", response_model=Idea)
async def update_idea(idea_id: str, update_data: IdeaUpdate, current_user: User = Depends(get_current_user)):
    idea = await db.ideas.find_one({"id": idea_id}, {"_id": 0})
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    # Only author, moderator or admin can update
    if idea["author_id"] != current_user.id and current_user.role not in [UserRole.MODERATOR, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to update this idea")
    
    # Only moderator/admin can change status
    update_dict = {}
    if update_data.title is not None:
        update_dict["title"] = update_data.title
    if update_data.description is not None:
        update_dict["description"] = update_data.description
    if update_data.tags is not None:
        update_dict["tags"] = update_data.tags
    if update_data.category_id is not None:
        category = await db.categories.find_one({"id": update_data.category_id}, {"_id": 0})
        if category:
            update_dict["category_id"] = update_data.category_id
            update_dict["category_name"] = category["name"]
    
    if update_data.status is not None:
        if current_user.role not in [UserRole.MODERATOR, UserRole.ADMIN]:
            raise HTTPException(status_code=403, detail="Only moderators can change status")
        update_dict["status"] = update_data.status.value
        
        # Notify author of status change
        if idea["author_id"] != current_user.id:
            notification = Notification(
                user_id=idea["author_id"],
                type="status_change",
                title="Statut de votre proposition modifié",
                message=f"Le statut de votre proposition '{idea['title']}' a été changé en '{update_data.status.value}'",
                link=f"/ideas/{idea_id}"
            )
            await db.notifications.insert_one(notification.model_dump())
    
    if update_dict:
        update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.ideas.update_one({"id": idea_id}, {"$set": update_dict})
    
    updated_idea = await db.ideas.find_one({"id": idea_id}, {"_id": 0})
    return Idea(**updated_idea)

@api_router.delete("/ideas/{idea_id}")
async def delete_idea(idea_id: str, current_user: User = Depends(get_current_user)):
    idea = await db.ideas.find_one({"id": idea_id}, {"_id": 0})
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    # Only author, moderator or admin can delete
    if idea["author_id"] != current_user.id and current_user.role not in [UserRole.MODERATOR, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this idea")
    
    # Delete idea and related comments
    await db.ideas.delete_one({"id": idea_id})
    await db.comments.delete_many({"idea_id": idea_id})
    
    return {"success": True}

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
            # Notify author of upvote
            if idea["author_id"] != current_user.id:
                notification = Notification(
                    user_id=idea["author_id"],
                    type="vote",
                    title="Nouveau vote sur votre proposition",
                    message=f"{current_user.name} a voté pour votre proposition '{idea['title']}'",
                    link=f"/ideas/{idea_id}"
                )
                await db.notifications.insert_one(notification.model_dump())
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
    
    # Check and award badges
    await check_and_award_badges(current_user.id)
    
    return {"success": True, "votes_up": idea["votes_up"], "votes_down": idea["votes_down"]}

# Comments Routes
@api_router.post("/comments", response_model=Comment)
async def create_comment(comment_data: CommentCreate, current_user: User = Depends(get_current_user)):
    # Get idea to notify author
    idea = await db.ideas.find_one({"id": comment_data.idea_id}, {"_id": 0})
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
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
    
    # Notify idea author
    if idea["author_id"] != current_user.id:
        notification = Notification(
            user_id=idea["author_id"],
            type="comment",
            title="Nouveau commentaire",
            message=f"{current_user.name} a commenté votre proposition '{idea['title']}'",
            link=f"/ideas/{comment_data.idea_id}"
        )
        await db.notifications.insert_one(notification.model_dump())
    
    # Check and award badges
    await check_and_award_badges(current_user.id)
    
    return comment

@api_router.get("/comments/{idea_id}", response_model=List[Comment])
async def get_comments(idea_id: str):
    comments = await db.comments.find({"idea_id": idea_id}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return comments

@api_router.delete("/comments/{comment_id}")
async def delete_comment(comment_id: str, current_user: User = Depends(get_current_user)):
    comment = await db.comments.find_one({"id": comment_id}, {"_id": 0})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Only author, moderator or admin can delete
    if comment["user_id"] != current_user.id and current_user.role not in [UserRole.MODERATOR, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")
    
    await db.comments.delete_one({"id": comment_id})
    await db.ideas.update_one(
        {"id": comment["idea_id"]},
        {"$inc": {"comments_count": -1}}
    )
    
    return {"success": True}

# Report Routes
@api_router.post("/reports", response_model=Report)
async def create_report(report_data: ReportCreate, current_user: User = Depends(get_current_user)):
    # Verify content exists
    if report_data.content_type == "idea":
        content = await db.ideas.find_one({"id": report_data.content_id}, {"_id": 0})
        if content:
            await db.ideas.update_one({"id": report_data.content_id}, {"$set": {"is_reported": True}})
    elif report_data.content_type == "comment":
        content = await db.comments.find_one({"id": report_data.content_id}, {"_id": 0})
    else:
        raise HTTPException(status_code=400, detail="Invalid content type")
    
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    report = Report(
        **report_data.model_dump(),
        reporter_id=current_user.id,
        reporter_name=current_user.name
    )
    await db.reports.insert_one(report.model_dump())
    return report

@api_router.get("/reports", response_model=List[Report])
async def get_reports(status: Optional[ReportStatus] = None, moderator: User = Depends(get_current_moderator)):
    query = {}
    if status:
        query["status"] = status.value
    
    reports = await db.reports.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return reports

@api_router.put("/reports/{report_id}")
async def resolve_report(report_id: str, resolution: str, action: Optional[str] = None, 
                        moderator: User = Depends(get_current_moderator)):
    report = await db.reports.find_one({"id": report_id}, {"_id": 0})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Handle action (delete content, warn user, etc.)
    if action == "delete_content":
        if report["content_type"] == "idea":
            await db.ideas.delete_one({"id": report["content_id"]})
        elif report["content_type"] == "comment":
            comment = await db.comments.find_one({"id": report["content_id"]}, {"_id": 0})
            if comment:
                await db.comments.delete_one({"id": report["content_id"]})
                await db.ideas.update_one(
                    {"id": comment["idea_id"]},
                    {"$inc": {"comments_count": -1}}
                )
    
    # Update report
    await db.reports.update_one(
        {"id": report_id},
        {"$set": {
            "status": ReportStatus.RESOLVED.value,
            "resolution": resolution,
            "reviewed_by": moderator.id,
            "reviewed_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {"success": True}

# Notification Routes
@api_router.get("/notifications", response_model=List[Notification])
async def get_notifications(current_user: User = Depends(get_current_user)):
    notifications = await db.notifications.find(
        {"user_id": current_user.id}, 
        {"_id": 0}
    ).sort("created_at", -1).limit(50).to_list(50)
    return notifications

@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, current_user: User = Depends(get_current_user)):
    notification = await db.notifications.find_one({"id": notification_id, "user_id": current_user.id}, {"_id": 0})
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    await db.notifications.update_one(
        {"id": notification_id},
        {"$set": {"is_read": True}}
    )
    return {"success": True}

@api_router.put("/notifications/read-all")
async def mark_all_notifications_read(current_user: User = Depends(get_current_user)):
    await db.notifications.update_many(
        {"user_id": current_user.id, "is_read": False},
        {"$set": {"is_read": True}}
    )
    return {"success": True}

@api_router.get("/notifications/unread-count")
async def get_unread_count(current_user: User = Depends(get_current_user)):
    count = await db.notifications.count_documents({"user_id": current_user.id, "is_read": False})
    return {"count": count}

# Poll Routes
@api_router.post("/polls", response_model=Poll)
async def create_poll(poll_data: PollCreate, current_user: User = Depends(get_current_user)):
    # Initialize votes dict with 0 for each option
    votes = {option: 0 for option in poll_data.options}
    
    poll = Poll(
        **poll_data.model_dump(),
        author_id=current_user.id,
        author_name=current_user.name,
        votes=votes
    )
    await db.polls.insert_one(poll.model_dump())
    return poll

@api_router.get("/polls", response_model=List[Poll])
async def get_polls(category_id: Optional[str] = None):
    query = {}
    if category_id:
        query["category_id"] = category_id
    
    polls = await db.polls.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return polls

@api_router.get("/polls/{poll_id}", response_model=Poll)
async def get_poll(poll_id: str):
    poll = await db.polls.find_one({"id": poll_id}, {"_id": 0})
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    return Poll(**poll)

@api_router.post("/polls/{poll_id}/vote")
async def vote_poll(poll_id: str, vote: PollVote, current_user: User = Depends(get_current_user)):
    poll = await db.polls.find_one({"id": poll_id}, {"_id": 0})
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    # Check if option is valid
    if vote.option not in poll["options"]:
        raise HTTPException(status_code=400, detail="Invalid option")
    
    # Check if poll has ended
    if poll.get("ends_at"):
        ends_at = datetime.fromisoformat(poll["ends_at"])
        if datetime.now(timezone.utc) > ends_at:
            raise HTTPException(status_code=400, detail="Poll has ended")
    
    user_votes = poll.get("user_votes", {})
    votes = poll.get("votes", {})
    
    # Remove previous vote if exists
    previous_vote = user_votes.get(current_user.id)
    if previous_vote:
        votes[previous_vote] = votes.get(previous_vote, 1) - 1
    
    # Add new vote
    user_votes[current_user.id] = vote.option
    votes[vote.option] = votes.get(vote.option, 0) + 1
    
    await db.polls.update_one(
        {"id": poll_id},
        {"$set": {
            "votes": votes,
            "user_votes": user_votes
        }}
    )
    
    return {"success": True, "votes": votes}

@api_router.delete("/polls/{poll_id}")
async def delete_poll(poll_id: str, current_user: User = Depends(get_current_user)):
    poll = await db.polls.find_one({"id": poll_id}, {"_id": 0})
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    
    # Only author, moderator or admin can delete
    if poll["author_id"] != current_user.id and current_user.role not in [UserRole.MODERATOR, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this poll")
    
    await db.polls.delete_one({"id": poll_id})
    return {"success": True}

# File Upload Routes
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    # Validate file size (max 10MB)
    file_size = 0
    content = await file.read()
    file_size = len(content)
    if file_size > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Create attachment record
    attachment = Attachment(
        filename=unique_filename,
        original_filename=file.filename,
        file_type=file.content_type,
        file_size=file_size,
        url=f"/api/files/{unique_filename}"
    )
    
    return attachment.model_dump()

@api_router.get("/files/{filename}")
async def get_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

@api_router.post("/ideas/{idea_id}/attachments")
async def add_attachment_to_idea(idea_id: str, attachment_data: Dict[str, Any], 
                                current_user: User = Depends(get_current_user)):
    idea = await db.ideas.find_one({"id": idea_id}, {"_id": 0})
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    # Only author can add attachments
    if idea["author_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    attachment = Attachment(**attachment_data)
    await db.ideas.update_one(
        {"id": idea_id},
        {"$push": {"attachments": attachment.model_dump()}}
    )
    
    return {"success": True}

# Admin Routes
@api_router.get("/admin/users", response_model=List[User])
async def get_all_users(admin: User = Depends(get_current_admin)):
    users = await db.users.find({}, {"_id": 0, "password": 0}).sort("created_at", -1).to_list(1000)
    return [User(**user) for user in users]

@api_router.put("/admin/users/{user_id}/role")
async def update_user_role(user_id: str, role: UserRole, admin: User = Depends(get_current_admin)):
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"role": role.value}}
    )
    
    # Notify user
    notification = Notification(
        user_id=user_id,
        type="role_change",
        title="Votre rôle a été modifié",
        message=f"Votre rôle a été changé en '{role.value}'"
    )
    await db.notifications.insert_one(notification.model_dump())
    
    return {"success": True}

@api_router.put("/admin/users/{user_id}/ban")
async def ban_user(user_id: str, banned: bool, admin: User = Depends(get_current_admin)):
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Cannot ban admin
    if user.get("role") == UserRole.ADMIN.value:
        raise HTTPException(status_code=400, detail="Cannot ban admin user")
    
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"is_banned": banned}}
    )
    
    return {"success": True}

@api_router.get("/admin/stats")
async def get_admin_stats(admin: User = Depends(get_current_admin)):
    total_users = await db.users.count_documents({})
    banned_users = await db.users.count_documents({"is_banned": True})
    moderators = await db.users.count_documents({"role": {"$in": [UserRole.MODERATOR.value, UserRole.ADMIN.value]}})
    
    total_ideas = await db.ideas.count_documents({})
    reported_ideas = await db.ideas.count_documents({"is_reported": True})
    
    total_comments = await db.comments.count_documents({})
    pending_reports = await db.reports.count_documents({"status": ReportStatus.PENDING.value})
    
    # Ideas by status
    ideas_by_status = {
        "discussion": await db.ideas.count_documents({"status": IdeaStatus.DISCUSSION.value}),
        "approved": await db.ideas.count_documents({"status": IdeaStatus.APPROVED.value}),
        "rejected": await db.ideas.count_documents({"status": IdeaStatus.REJECTED.value}),
        "in_progress": await db.ideas.count_documents({"status": IdeaStatus.IN_PROGRESS.value}),
    }
    
    return {
        "users": {
            "total": total_users,
            "banned": banned_users,
            "moderators": moderators
        },
        "content": {
            "ideas": total_ideas,
            "reported_ideas": reported_ideas,
            "comments": total_comments,
            "pending_reports": pending_reports
        },
        "ideas_by_status": ideas_by_status
    }

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