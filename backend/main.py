from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import DEVICE, MODEL_ID
from app.routers.background import router as background_router

app = FastAPI(
    title="RMBG Studio API",
    description="Hugging Face (briaai/RMBG-1.4) tabanlı Modüler Arka Plan Ayrıştırma Servisi",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Root"])
def root():
    return {
        "service": "RMBG Studio API",
        "status": "running",
        "model": MODEL_ID,
        "device": DEVICE.upper(),
        "docs": "/docs",
        "health": "/api/health",
    }


app.include_router(background_router)
