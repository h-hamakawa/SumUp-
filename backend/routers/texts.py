from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import TextDocument
from schemas import TextCreate, TextUpdate, TextOut

router = APIRouter(prefix="/texts", tags=["texts"])


@router.get("/", response_model=List[TextOut])
def list_texts(
    category_id: Optional[int] = None,
    library_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    q = db.query(TextDocument)
    if category_id is not None:
        q = q.filter(TextDocument.category_id == category_id)
    if library_id is not None:
        q = q.filter(TextDocument.library_id == library_id)
    return q.order_by(TextDocument.updated_at.desc()).all()


@router.post("/", response_model=TextOut, status_code=201)
def create_text(body: TextCreate, db: Session = Depends(get_db)):
    text = TextDocument(
        title=body.title,
        content=body.content,
        category_id=body.category_id,
        library_id=body.library_id,
    )
    db.add(text)
    db.commit()
    db.refresh(text)
    return text


@router.get("/{text_id}", response_model=TextOut)
def get_text(text_id: int, db: Session = Depends(get_db)):
    text = db.query(TextDocument).filter(TextDocument.id == text_id).first()
    if not text:
        raise HTTPException(status_code=404, detail="Text not found")
    return text


@router.patch("/{text_id}", response_model=TextOut)
def update_text(text_id: int, body: TextUpdate, db: Session = Depends(get_db)):
    text = db.query(TextDocument).filter(TextDocument.id == text_id).first()
    if not text:
        raise HTTPException(status_code=404, detail="Text not found")
    if body.title is not None:
        text.title = body.title
    if body.content is not None:
        text.content = body.content
    if body.category_id is not None:
        text.category_id = body.category_id
    if body.library_id is not None:
        text.library_id = body.library_id
    db.commit()
    db.refresh(text)
    return text


@router.delete("/{text_id}", status_code=204)
def delete_text(text_id: int, db: Session = Depends(get_db)):
    text = db.query(TextDocument).filter(TextDocument.id == text_id).first()
    if not text:
        raise HTTPException(status_code=404, detail="Text not found")
    db.delete(text)
    db.commit()
