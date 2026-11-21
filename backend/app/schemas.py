from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    model: str
    device: str


class RemoveBgResponse(BaseModel):
    success: bool
    model: str
    device: str
    inference_time_ms: int
    width: int
    height: int
    transparent_image: str
    mask_image: str

