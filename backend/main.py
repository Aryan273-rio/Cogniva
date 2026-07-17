from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.documents import router as documents_router
from routes.ai import router as ai_router
from routes.quiz import router as quiz_router
from routes.analytics import router as analytics_router
from routes.chat import router as chat_router
from routes.flashcards import router as flashcards_router
from routes.bookmarks import router as bookmarks_router


app = FastAPI(
    title="Cogniva API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():

    return {

        "message": "Cogniva API Running"

    }


app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    documents_router,
    prefix="/documents",
    tags=["Documents"]
)

app.include_router(
    ai_router,
    prefix="/ai",
    tags=["AI"]
)

app.include_router(
    quiz_router,
    prefix="/quiz",
    tags=["Quiz"]
)

app.include_router(
    analytics_router,
    prefix="/analytics",
    tags=["Analytics"]
)

app.include_router(
    chat_router,
    prefix="/chat",
    tags=["AI Chat"]
)

app.include_router(
    flashcards_router,
    prefix="/flashcards",
    tags=["Flashcards"]
)

app.include_router(
    bookmarks_router,
    prefix="/bookmarks",
    tags=["Bookmarks"]
)