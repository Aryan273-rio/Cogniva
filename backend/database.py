from motor.motor_asyncio import AsyncIOMotorClient

from config import settings


client = AsyncIOMotorClient(settings.MONGO_URL)

database = client[settings.DATABASE_NAME]


users_collection = database["users"]
documents_collection = database["documents"]
quizzes_collection = database["quizzes"]
quiz_attempts_collection = database["quiz_attempts"]
flashcards_collection = database["flashcards"]
bookmarks_collection = database["bookmarks"]