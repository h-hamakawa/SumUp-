from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any


# --- Category ---
class CategoryBase(BaseModel):
    name: str


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None


class CategoryOut(CategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# --- Library ---
class LibraryBase(BaseModel):
    name: str
    category_id: Optional[int] = None


class LibraryCreate(LibraryBase):
    pass


class LibraryUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None


class LibraryOut(LibraryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# --- TextDocument ---
class TextBase(BaseModel):
    title: Optional[str] = "無題"
    content: Optional[Any] = None
    category_id: Optional[int] = None
    library_id: Optional[int] = None


class TextCreate(TextBase):
    pass


class TextUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[Any] = None
    category_id: Optional[int] = None
    library_id: Optional[int] = None


class TextOut(TextBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
