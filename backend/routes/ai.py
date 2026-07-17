from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from bson import ObjectId

from database import documents_collection

from dependencies import get_current_user

from services.ai_service import generate_summary

router = APIRouter()


@router.post("/summary/{document_id}")

def create_summary(

    document_id: str,

    current_user=Depends(get_current_user)

):

    document = documents_collection.find_one(

        {

            "_id": ObjectId(document_id),

            "user_id": current_user["user_id"]

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

    documents_collection.update_one(

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