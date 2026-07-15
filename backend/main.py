from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router

from routes.documents import router as documents_router

from routes.ai import router as ai_router

app = FastAPI()

app.add_middleware(

    CORSMiddleware,

    allow_origins=["http://localhost:5173"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]

)

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


@app.get("/")

def home():

    return {

        "message": "Cogniva Backend Running"

    }