from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from bson import ObjectId

from database import documents_collection
from dependencies import get_current_user
from services.ai_service import generate_summary

router = APIRouter()


@router.post("/summary/{document_id}")
async def create_summary(
    document_id: str,
    current_user=Depends(get_current_user)
):
    document = await documents_collection.find_one(
        {
            "_id": ObjectId(document_id),
            "user_id": str(current_user["_id"])
        }
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    summary = generate_summary(
        document["text"]
    )

    await documents_collection.update_one(
        {
            "_id": document["_id"]
        },
        {
            "$set": {
                "summary": summary
            }
        }
    )

    return {
        "message": "Summary Generated",
        "summary": summary
    }