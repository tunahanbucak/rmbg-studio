import torch

MODEL_ID = "briaai/RMBG-1.4"

# MacBook Apple Silicon (MPS), NVIDIA (CUDA) veya CPU otomatik seçimi
DEVICE = (
    "mps"
    if torch.backends.mps.is_available()
    else ("cuda" if torch.cuda.is_available() else "cpu")
)

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*",
]

