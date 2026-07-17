from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends
)

from bson import ObjectId

from database import (
    documents_collection,
    quizzes_collection
)

from services.pdf_service import extract_text_from_pdf

from dependencies import get_current_user

router = APIRouter()


# ==========================================
# Upload PDF
# ==========================================

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    pdf_bytes = await file.read()

    try:
        extracted_text = extract_text_from_pdf(pdf_bytes)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to read PDF."
        )

    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found."
        )

    document = {
        "user_id": str(current_user["_id"]),
        "filename": file.filename,
        "text": extracted_text,
        "summary": "",
        "created_at": datetime.now(timezone.utc)
    }

    result = await documents_collection.insert_one(document)

    return {
        "message": "PDF uploaded successfully",
        "document_id": str(result.inserted_id),
        "filename": file.filename
    }


# ==========================================
# Get All Documents
# ==========================================

@router.get("/")
async def get_documents(
    current_user: dict = Depends(get_current_user)
):

    documents = await documents_collection.find({
        "user_id": str(current_user["_id"])
    }).to_list(length=1000)

    result = []

    for document in documents:

        quiz = await quizzes_collection.find_one({
            "document_id": str(document["_id"])
        })

        result.append({
            "id": str(document["_id"]),
            "filename": document["filename"],
            "summary": document.get("summary", ""),
            "has_quiz": quiz is not None,
            "created_at": document["created_at"]
        })

    return result


# ==========================================
# Get One Document
# ==========================================

@router.get("/{document_id}")
async def get_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):

    try:
        object_id = ObjectId(document_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid document id."
        )

    document = await documents_collection.find_one({
        "_id": object_id,
        "user_id": str(current_user["_id"])
    })

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    quiz = await quizzes_collection.find_one({
        "document_id": document_id
    })

    return {
        "id": str(document["_id"]),
        "filename": document["filename"],
        "text": document["text"],
        "summary": document.get("summary", ""),
        "has_quiz": quiz is not None,
        "created_at": document["created_at"]
    }


# ==========================================
# Delete Document
# ==========================================

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):

    try:
        object_id = ObjectId(document_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid document id."
        )

    result = await documents_collection.delete_one({
        "_id": object_id,
        "user_id": str(current_user["_id"])
    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    await quizzes_collection.delete_many({
        "document_id": document_id
    })

    return {
        "message": "Document deleted successfully"
    }