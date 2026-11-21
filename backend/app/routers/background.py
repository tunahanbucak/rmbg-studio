from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from app.config import DEVICE, MODEL_ID
from app.schemas import HealthResponse, RemoveBgResponse
from app.services.segmentation import segmentation_service
from app.utils.image import bytes_to_rgb_image, pil_to_base64

router = APIRouter(prefix="/api", tags=["Background Studio"])


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Sunucu ve aktif derin öğrenme modelinin durumunu döner."""
    return HealthResponse(
        status="ok",
        model=MODEL_ID,
        device=DEVICE.upper(),
    )


@router.post("/remove-bg", response_model=RemoveBgResponse)
async def remove_background(
    file: UploadFile = File(...),
    threshold: int = Form(12, ge=0, le=250, description="Düşük olasılıklı halo gürültüsü eşiği (0-250)"),
    feather: float = Form(0.0, ge=0.0, le=10.0, description="Kenar yumuşatma Gaussian Blur yarıçapı"),
) -> RemoveBgResponse:
    """
    Yüklenen fotoğrafın arka planını siler ve alfa maskesini iyileştirir.
    Hem şeffaf (RGBA) görseli hem de modelin ürettiği alfa maskesini Base64 olarak döner.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, detail="Lütfen geçerli bir resim dosyası yükleyin."
        )

    try:
        image_bytes = await file.read()
        original_image = bytes_to_rgb_image(image_bytes)
        width, height = original_image.size

        transparent_image, mask_image, elapsed_ms = (
            segmentation_service.remove_background(
                original_image, threshold=threshold, feather=feather
            )
        )

        return RemoveBgResponse(
            success=True,
            model=MODEL_ID,
            device=DEVICE.upper(),
            inference_time_ms=elapsed_ms,
            width=width,
            height=height,
            transparent_image=pil_to_base64(transparent_image),
            mask_image=pil_to_base64(mask_image),
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Görüntü işlenirken hata oluştu: {str(e)}"
        )
