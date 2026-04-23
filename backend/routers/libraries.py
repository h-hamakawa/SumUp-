from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Library
from schemas import LibraryCreate, LibraryUpdate, LibraryOut

router = APIRouter(prefix="/libraries", tags=["libraries"])


@router.get("/", response_model=List[LibraryOut])
def list_libraries(category_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(Library)
    if category_id is not None:
        q = q.filter(Library.category_id == category_id)
    return q.order_by(Library.created_at.desc()).all()


@router.post("/", response_model=LibraryOut, status_code=201)
def create_library(body: LibraryCreate, db: Session = Depends(get_db)):
    library = Library(name=body.name, category_id=body.category_id)
    db.add(library)
    db.commit()
    db.refresh(library)
    return library


@router.get("/{library_id}", response_model=LibraryOut)
def get_library(library_id: int, db: Session = Depends(get_db)):
    library = db.query(Library).filter(Library.id == library_id).first()
    if not library:
        raise HTTPException(status_code=404, detail="Library not found")
    return library


@router.patch("/{library_id}", response_model=LibraryOut)
def update_library(library_id: int, body: LibraryUpdate, db: Session = Depends(get_db)):
    library = db.query(Library).filter(Library.id == library_id).first()
    if not library:
        raise HTTPException(status_code=404, detail="Library not found")
    if body.name is not None:
        library.name = body.name
    if body.category_id is not None:
        library.category_id = body.category_id
    db.commit()
    db.refresh(library)
    return library


@router.delete("/{library_id}", status_code=204)
def delete_library(library_id: int, db: Session = Depends(get_db)):
    library = db.query(Library).filter(Library.id == library_id).first()
    if not library:
        raise HTTPException(status_code=404, detail="Library not found")
    db.delete(library)
    db.commit()
