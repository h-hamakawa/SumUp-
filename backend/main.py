from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import categories, libraries, texts, search

app = FastAPI(title="SumUp API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories.router)
app.include_router(libraries.router)
app.include_router(texts.router)
app.include_router(search.router)


@app.get("/")
def root():
    return {"message": "SumUp API is running"}
