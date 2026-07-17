from datetime import datetime, timezone

from bson import ObjectId
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException

from database import (
    documents_collection,
    quizzes_collection,
    quiz_attempts_collection
)

from services.quiz_service import generate_quiz
from dependencies import get_current_user

router = APIRouter()


class QuizSubmission(BaseModel):
    answers: list[str]


# ==========================================
# Generate Quiz
# ==========================================

@router.post("/generate/{document_id}")
async def generate(
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
            detail="Document not found."
        )

    quiz = generate_quiz(document["text"])

    quiz_document = {
        "user_id": str(current_user["_id"]),
        "document_id": document_id,
        "questions": quiz,
        "created_at": datetime.now(timezone.utc)
    }

    result = await quizzes_collection.insert_one(quiz_document)

    return {
        "quiz_id": str(result.inserted_id),
        "questions": quiz
    }


# ==========================================
# Get Quiz
# ==========================================

@router.get("/{quiz_id}")
async def get_quiz(
    quiz_id: str,
    current_user=Depends(get_current_user)
):

    quiz = await quizzes_collection.find_one(
        {
            "_id": ObjectId(quiz_id),
            "user_id": str(current_user["_id"])
        }
    )

    if not quiz:
        raise HTTPException(
            status_code=404,
            detail="Quiz not found."
        )

    return {
        "quiz_id": str(quiz["_id"]),
        "questions": quiz["questions"]
    }


# ==========================================
# Submit Quiz
# ==========================================

@router.post("/submit/{quiz_id}")
async def submit_quiz(
    quiz_id: str,
    submission: QuizSubmission,
    current_user=Depends(get_current_user)
):

    answers = submission.answers

    quiz = await quizzes_collection.find_one(
        {
            "_id": ObjectId(quiz_id),
            "user_id": str(current_user["_id"])
        }
    )

    if not quiz:
        raise HTTPException(
            status_code=404,
            detail="Quiz not found."
        )

    questions = quiz["questions"]

    score = 0
    results = []

    for i in range(len(questions)):
        correct_answer = questions[i]["answer"]
        student_answer = answers[i]

        if student_answer == correct_answer:
            score += 1

        results.append({
            "question": questions[i]["question"],
            "correct_answer": correct_answer,
            "student_answer": student_answer,
            "is_correct": student_answer == correct_answer
        })

    percentage = round(
        (score / len(questions)) * 100,
        2
    )

    attempt = {
        "user_id": str(current_user["_id"]),
        "quiz_id": quiz_id,
        "document_id": quiz["document_id"],
        "score": score,
        "total": len(questions),
        "percentage": percentage,
        "results": results,
        "submitted_at": datetime.now(timezone.utc)
    }

    await quiz_attempts_collection.insert_one(attempt)

    return {
        "score": score,
        "total": len(questions),
        "percentage": percentage,
        "results": results
    }