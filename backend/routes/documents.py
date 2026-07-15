from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends
)

from bson import ObjectId

from database import documents_collection
from services.pdf_service import extract_text_from_pdf
from utils.dependencies import get_current_user

router = APIRouter()


# ==========================
# Upload PDF
# ==========================
@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):

    # Allow only PDFs
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # Read uploaded file
    pdf_bytes = await file.read()

    # Extract text
    try:
        extracted_text = extract_text_from_pdf(pdf_bytes)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to read PDF."
        )

    # Check if PDF contains text
    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found in PDF."
        )

    # Save document
    document = {

        "user_id": current_user["user_id"],

        "filename": file.filename,

        "text": extracted_text,

        # AI summary will be generated later
        "summary": "",

        "created_at": datetime.now(timezone.utc)

    }

    result = documents_collection.insert_one(document)

    return {
        "message": "PDF uploaded successfully",
        "document_id": str(result.inserted_id),
        "filename": file.filename
    }


# ==========================
# Get All Documents
# ==========================
@router.get("/")
def get_documents(
    current_user: dict = Depends(get_current_user)
):

    documents = documents_collection.find({

        "user_id": current_user["user_id"]

    })

    document_list = []

    for document in documents:

        document_list.append({

            "id": str(document["_id"]),

            "filename": document["filename"],

            "summary": document.get("summary", ""),

            "created_at": document["created_at"]

        })

    return document_list


# ==========================
# Get Single Document
# ==========================
@router.get("/{document_id}")
def get_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):

    try:
        object_id = ObjectId(document_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid document ID."
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

    return {

        "id": str(document["_id"]),

        "filename": document["filename"],

        "text": document["text"],

        "summary": document.get("summary", ""),

        "created_at": document["created_at"]

    }


# ==========================
# Delete Document (Optional)
# ==========================
@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):

    try:
        object_id = ObjectId(document_id)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid document ID."
        )

    result = documents_collection.delete_one({

        "_id": object_id,

        "user_id": current_user["user_id"]

    })

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return {
        "message": "Document deleted successfully"
    }