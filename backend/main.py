from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import ALLOWED_ORIGINS
from app.routers.background import router as background_router

app = FastAPI(
    title="RMBG Studio API",
    description="Hugging Face (briaai/RMBG-1.4) tabanlı Modüler Arka Plan Ayrıştırma Servisi",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(background_router)
