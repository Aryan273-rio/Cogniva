from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from database import (
    documents_collection,
    flashcards_collection,
)
from dependencies import get_current_user
from services.flashcard_service import generate_flashcards


router = APIRouter()


@router.post("/generate/{document_id}")
async def generate_document_flashcards(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):

    if not ObjectId.is_valid(document_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid document id."
        )

    document = await documents_collection.find_one(
        {
            "_id": ObjectId(document_id)
        }
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    existing = await flashcards_collection.find_one(
        {
            "document_id": document_id,
            "user_id": current_user["user_id"]  # Fixed here
        }
    )

    if existing:
        return {
            "flashcards_id": str(existing["_id"]),
            "flashcards": existing["flashcards"]
        }

    flashcards = generate_flashcards(
        document["text"]
    )

    if len(flashcards) == 0:
        raise HTTPException(
            status_code=500,
            detail="Unable to generate flashcards."
        )

    flashcard_document = {
        "user_id": current_user["user_id"],  # Fixed here
        "document_id": document_id,
        "flashcards": flashcards,
        "created_at": datetime.utcnow()
    }

    result = await flashcards_collection.insert_one(
        flashcard_document
    )

    return {
        "flashcards_id": str(result.inserted_id),
        "flashcards": flashcards
    }


@router.get("/{document_id}")
async def get_flashcards(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):

    flashcards = await flashcards_collection.find_one(
        {
            "document_id": document_id,
            "user_id": current_user["user_id"]  # Fixed here
        }
    )

    if not flashcards:
        raise HTTPException(
            status_code=404,
            detail="Flashcards not found."
        )

    return {
        "flashcards_id": str(flashcards["_id"]),
        "flashcards": flashcards["flashcards"]
    }


@router.delete("/{document_id}")
async def delete_flashcards(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):

    result = await flashcards_collection.delete_one(
        {
            "document_id": document_id,
            "user_id": current_user["user_id"]  # Fixed here
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Flashcards not found."
        )

    return {
        "message": "Flashcards deleted successfully."
    }