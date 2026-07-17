from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from database import (
    flashcards_collection,
    bookmarks_collection
)

from dependencies import get_current_user


router = APIRouter()


@router.post("/{document_id}/{card_index}")
async def bookmark_flashcard(
    document_id: str,
    card_index: int,
    current_user: dict = Depends(get_current_user)
):

    flashcard_document = await flashcards_collection.find_one(

        {
            "document_id": document_id,
            "user_id": str(current_user["_id"])
        }

    )

    if not flashcard_document:

        raise HTTPException(
            status_code=404,
            detail="Flashcards not found."
        )

    flashcards = flashcard_document["flashcards"]

    if card_index < 0 or card_index >= len(flashcards):

        raise HTTPException(
            status_code=400,
            detail="Invalid flashcard index."
        )

    existing = await bookmarks_collection.find_one(

        {
            "user_id": str(current_user["_id"]),
            "document_id": document_id,
            "card_index": card_index
        }

    )

    if existing:

        return {
            "message": "Already bookmarked."
        }

    card = flashcards[card_index]

    bookmark = {

        "user_id": str(current_user["_id"]),

        "document_id": document_id,

        "card_index": card_index,

        "question": card["question"],

        "answer": card["answer"],

        "created_at": datetime.utcnow()

    }

    await bookmarks_collection.insert_one(bookmark)

    return {

        "message": "Bookmark added successfully."

    }


@router.get("/")
async def get_bookmarks(

    current_user: dict = Depends(get_current_user)

):

    bookmarks = []

    cursor = bookmarks_collection.find(

        {
            "user_id": str(current_user["_id"])
        }

    )

    async for bookmark in cursor:

        bookmarks.append(

            {

                "id": str(bookmark["_id"]),

                "document_id": bookmark["document_id"],

                "card_index": bookmark["card_index"],

                "question": bookmark["question"],

                "answer": bookmark["answer"],

                "created_at": bookmark["created_at"]

            }

        )

    return {

        "bookmarks": bookmarks

    }


@router.delete("/{bookmark_id}")
async def delete_bookmark(

    bookmark_id: str,

    current_user: dict = Depends(get_current_user)

):

    if not ObjectId.is_valid(bookmark_id):

        raise HTTPException(

            status_code=400,

            detail="Invalid bookmark id."

        )

    result = await bookmarks_collection.delete_one(

        {

            "_id": ObjectId(bookmark_id),

            "user_id": str(current_user["_id"])

        }

    )

    if result.deleted_count == 0:

        raise HTTPException(

            status_code=404,

            detail="Bookmark not found."

        )

    return {

        "message": "Bookmark deleted successfully."

    }