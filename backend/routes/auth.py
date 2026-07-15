from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from database import users_collection
from utils.security import hash_password, verify_password, create_access_token


router = APIRouter()


# Data required for registration
class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: str


# Data required for login
class LoginUser(BaseModel):
    email: EmailStr
    password: str


# REGISTER ROUTE
@router.post("/register")
def register(user: RegisterUser):

    # Check if user already exists
    existing_user = users_collection.find_one({
        "email": user.email
    })

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = hash_password(user.password)

    # Create user document
    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    }

    # Save user in MongoDB
    users_collection.insert_one(new_user)

    return {
        "message": "User registered successfully"
    }


# LOGIN ROUTE
@router.post("/login")
def login(user: LoginUser):

    # Find user in MongoDB
    existing_user = users_collection.find_one({
        "email": user.email
    })

    # Check if user exists
    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Generate JWT token
    access_token = create_access_token({
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"]
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }