from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    libraries = relationship("Library", back_populates="category", cascade="all, delete-orphan")
    texts = relationship("TextDocument", back_populates="category", cascade="all, delete-orphan")


class Library(Base):
    __tablename__ = "libraries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="libraries")
    texts = relationship("TextDocument", back_populates="library", cascade="all, delete-orphan")


class TextDocument(Base):
    __tablename__ = "texts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, default="無題")
    content = Column(JSON, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    library_id = Column(Integer, ForeignKey("libraries.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    category = relationship("Category", back_populates="texts")
    library = relationship("Library", back_populates="texts")
