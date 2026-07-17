from bson import ObjectId
from fastapi import APIRouter
from fastapi import Depends

from database import (
    documents_collection,
    quizzes_collection,
    quiz_attempts_collection
)

from dependencies import get_current_user

router = APIRouter()

# ==========================================
# Analytics Dashboard
# ==========================================

@router.get("/")
async def get_analytics(  # 1. Added async
    current_user=Depends(get_current_user)
):

    user_id = current_user["user_id"]

    total_documents = await documents_collection.count_documents({  # 2. Added await
        "user_id": user_id
    })

    total_quizzes = await quizzes_collection.count_documents({  # 3. Added await
        "user_id": user_id
    })

    # 4. Changed list() to await ... .to_list(length=1000)
    attempts = await quiz_attempts_collection.find({
        "user_id": user_id
    }).sort("submitted_at", -1).to_list(length=1000)

    quizzes_attempted = len(attempts)

    if quizzes_attempted == 0:
        return {
            "total_documents": total_documents,
            "total_quizzes": total_quizzes,
            "quizzes_attempted": 0,
            "average_score": 0,
            "highest_score": 0,
            "lowest_score": 0,
            "recent_attempts": []
        }

    total_percentage = 0
    highest_score = 0
    lowest_score = 100

    recent_attempts = []

    for attempt in attempts:
        percentage = attempt["percentage"]
        total_percentage += percentage

        if percentage > highest_score:
            highest_score = percentage

        if percentage < lowest_score:
            lowest_score = percentage

        filename = "Unknown Document"

        try:
            document = await documents_collection.find_one({  # 5. Added await
                "_id": ObjectId(attempt["document_id"])
            })

            if document:
                filename = document["filename"]

        except Exception:
            pass

        recent_attempts.append({
            "quiz_id": attempt["quiz_id"],
            "document_name": filename,
            "score": attempt["score"],
            "total": attempt["total"],
            "percentage": percentage,
            "submitted_at": attempt["submitted_at"]
        })

    average_score = round(
        total_percentage / quizzes_attempted,
        2
    )

    return {
        "total_documents": total_documents,
        "total_quizzes": total_quizzes,
        "quizzes_attempted": quizzes_attempted,
        "average_score": average_score,
        "highest_score": highest_score,
        "lowest_score": lowest_score,
        "recent_attempts": recent_attempts[:5]
    }