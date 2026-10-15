from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel

from search import SemanticIndex
from sentiment import analyze
from analytics import compute

app = FastAPI(title="Neighborhood Service Finder - AI Service")
index = SemanticIndex()


class ServiceItem(BaseModel):
    id: int
    name: str
    category: Optional[str] = ""
    description: Optional[str] = ""
    location: Optional[str] = ""


class IndexRequest(BaseModel):
    services: list[ServiceItem]


class SearchRequest(BaseModel):
    query: str
    top_k: int = 10


class ReviewRequest(BaseModel):
    text: str


class BookingRow(BaseModel):
    id: Optional[int] = None
    date: Optional[str] = None
    status: Optional[str] = ""
    category: Optional[str] = ""
    service: Optional[str] = ""
    provider: Optional[str] = ""
    price: Optional[float] = 0.0


class ReviewRow(BaseModel):
    rating: Optional[int] = None
    sentiment: Optional[str] = None
    provider: Optional[str] = ""
    service: Optional[str] = ""


class AnalyticsRequest(BaseModel):
    bookings: list[BookingRow] = []
    reviews: list[ReviewRow] = []


@app.get("/health")
def health():
    return {"status": "ok", "indexed": len(index.ids)}


@app.post("/index")
def build_index(req: IndexRequest):
    return {"indexed": index.build(req.services)}


@app.post("/search")
def search(req: SearchRequest):
    return {"results": index.search(req.query, req.top_k)}


@app.post("/review/analyze")
def review_analyze(req: ReviewRequest):
    return analyze(req.text)


@app.post("/analytics")
def analytics(req: AnalyticsRequest):
    return compute(
        [b.model_dump() for b in req.bookings],
        [r.model_dump() for r in req.reviews],
    )