import os

from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

# MongoDB Connection String
MONGO_URL = os.getenv("MONGO_URL")

# Connect to MongoDB Atlas
client = MongoClient(MONGO_URL)

# Database
database = client["study_workspace"]

# Collections
users_collection = database["users"]

documents_collection = database["documents"]