import base64
import io
from PIL import Image, ImageFilter


def bytes_to_rgb_image(image_bytes: bytes) -> Image.Image:
    """Ham byte verisini RGB formatında PIL Image nesnesine dönüştürür."""
    return Image.open(io.BytesIO(image_bytes)).convert("RGB")


def refine_alpha_mask(
    mask: Image.Image, threshold: int = 12, feather: float = 0.0
) -> Image.Image:
    """
    Derin öğrenme modelinin ürettiği olasılık maskesini (Alpha Matte) iyileştirir:
    1. Threshold (Eşikleme): Düşük olasılıklı arka plan gürültülerini (halo) temizler.
    2. Feather (Yumuşatma): Keskin kenar geçişlerini Gaussian Blur ile yumuşatır.
    """
    gray_mask = mask.convert("L")

    if threshold > 0:
        lut = [0 if i < threshold else i for i in range(256)]
        gray_mask = gray_mask.point(lut)

    if feather > 0:
        gray_mask = gray_mask.filter(ImageFilter.GaussianBlur(radius=feather))

    return gray_mask


def pil_to_base64(image: Image.Image) -> str:
    """PIL Image nesnesini diske kaydetmeden RAM üzerinde Base64 PNG Data URL'ine çevirir."""
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"
