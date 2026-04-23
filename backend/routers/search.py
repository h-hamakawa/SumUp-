from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List

from database import get_db
from models import Category, Library, TextDocument
from schemas import CategoryOut, LibraryOut, TextOut

router = APIRouter(prefix="/search", tags=["search"])


@router.get("/")
def search(q: str, db: Session = Depends(get_db)):
    categories = (
        db.query(Category)
        .filter(Category.name.ilike(f"%{q}%"))
        .limit(10)
        .all()
    )
    libraries = (
        db.query(Library)
        .filter(Library.name.ilike(f"%{q}%"))
        .limit(10)
        .all()
    )
    texts = (
        db.query(TextDocument)
        .filter(TextDocument.title.ilike(f"%{q}%"))
        .limit(10)
        .all()
    )
    return {
        "categories": [CategoryOut.model_validate(c) for c in categories],
        "libraries": [LibraryOut.model_validate(l) for l in libraries],
        "texts": [TextOut.model_validate(t) for t in texts],
    }
