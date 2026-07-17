from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from pydantic import BaseModel
from bson import ObjectId

from database import documents_collection

from dependencies import get_current_user

from services.chat_service import ask_question


router = APIRouter()


# ==========================================
# Request Model
# ==========================================

class ChatRequest(BaseModel):
    question: str


# ==========================================
# Chat With Document
# ==========================================

@router.post("/{document_id}")
def chat_with_document(
    document_id: str,
    request: ChatRequest,
    current_user=Depends(get_current_user)
):

    try:

        object_id = ObjectId(document_id)

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid document id."
        )

    document = documents_collection.find_one({

        "_id": object_id,

        "user_id": current_user["user_id"]

    })

    if not document:

        raise HTTPException(

            status_code=404,

            detail="Document not found."

        )

    question = request.question.strip()

    if question == "":

        raise HTTPException(

            status_code=400,

            detail="Question cannot be empty."

        )

    answer = ask_question(

        document["text"],

        question

    )

    return {

        "document_id": document_id,

        "question": question,

        "answer": answer

    }