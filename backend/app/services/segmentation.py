import time
from typing import Any, Tuple, cast
import torch
from PIL import Image
from transformers import pipeline
from app.config import DEVICE, MODEL_ID
from app.utils.image import refine_alpha_mask


class SegmentationService:
    """Hugging Face briaai/RMBG-1.4 modelini yöneten ve arka plan ayrıştırma yapan servis."""

    def __init__(self) -> None:
        print(f"[INFO] Model yukleniyor: {MODEL_ID} (Device: {DEVICE.upper()})")
        self.pipe: Any = pipeline(
            "image-segmentation",
            model=MODEL_ID,
            trust_remote_code=True,
            device=DEVICE,
        )
        # RMBG-1.4'ün özel MyPipe sınıfı __init__ içinde yalnızca cuda/cpu kontrolü
        # yaptığı için Apple Silicon (MPS) cihazlarda modeli açıkça MPS GPU'ya taşıyoruz:
        if DEVICE == "mps":
            mps_device = torch.device("mps")
            self.pipe.device = mps_device
            self.pipe.model.to(mps_device)
        print(f"[INFO] Model hazir ({DEVICE.upper()} aktif).")

    def remove_background(
        self,
        original_image: Image.Image,
        threshold: int = 12,
        feather: float = 0.0,
    ) -> Tuple[Image.Image, Image.Image, int]:
        """
        Verilen RGB görüntüyü işleyerek (transparent_rgba, alpha_mask, elapsed_ms) döner.
        """
        start_time = time.perf_counter()

        # 1. Modeli çalıştırarak ham olasılık maskesini (Alpha Matte) üret
        raw_output = self.pipe(original_image, return_mask=True)
        raw_mask = cast(Image.Image, raw_output)

        # 2. Post-Processing: Halo gürültüsünü temizle ve kenar iyileştirmesi uygula
        refined_mask = refine_alpha_mask(
            raw_mask, threshold=threshold, feather=feather
        )

        # 3. Orijinal RGB resmin 4. kanalına (Alpha) iyileştirilmiş maskeyi ekle
        transparent_image = original_image.copy()
        transparent_image.putalpha(refined_mask)

        elapsed_ms = round((time.perf_counter() - start_time) * 1000)
        return transparent_image, refined_mask, elapsed_ms


# Uygulama genelinde tek bir model örneği (Singleton)
segmentation_service = SegmentationService()
