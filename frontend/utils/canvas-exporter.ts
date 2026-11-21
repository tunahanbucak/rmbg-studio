import {
  AspectRatioOption,
  ProcessResult,
  StudioCompositionConfig,
} from "@/types/studio";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function triggerDownload(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export function getCanvasDimensions(
  origW: number,
  origH: number,
  ratio: AspectRatioOption
): { width: number; height: number } {
  const baseSize = Math.max(origW, origH);
  switch (ratio) {
    case "1:1":
      return { width: baseSize, height: baseSize };
    case "4:5":
      return { width: Math.round(baseSize * 0.8), height: baseSize };
    case "16:9":
      return { width: baseSize, height: Math.round(baseSize * (9 / 16)) };
    default:
      return { width: origW, height: origH };
  }
}

export function buildSubjectCssFilter(
  brightness: number,
  contrast: number,
  saturation: number,
  outlineWidth: number,
  outlineColor: string,
  shadowIntensity: number,
  bgType: string
): string {
  const filters: string[] = [];

  if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
  if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
  if (saturation !== 100) filters.push(`saturate(${saturation}%)`);

  // Sticker / Ürün Dış Kontur Çizgisi (8 yönlü simetrik drop-shadow ile pürüzsüz kontur)
  if (outlineWidth > 0) {
    const w = outlineWidth;
    const d = Math.round(w * 0.7);
    filters.push(
      `drop-shadow(${w}px 0 0 ${outlineColor})`,
      `drop-shadow(-${w}px 0 0 ${outlineColor})`,
      `drop-shadow(0 ${w}px 0 ${outlineColor})`,
      `drop-shadow(0 -${w}px 0 ${outlineColor})`,
      `drop-shadow(${d}px ${d}px 0 ${outlineColor})`,
      `drop-shadow(-${d}px ${d}px 0 ${outlineColor})`,
      `drop-shadow(${d}px -${d}px 0 ${outlineColor})`,
      `drop-shadow(-${d}px -${d}px 0 ${outlineColor})`
    );
  }

  if (shadowIntensity > 0 && bgType !== "transparent") {
    const blur = Math.round(shadowIntensity * 0.6);
    const alpha = ((shadowIntensity / 100) * 0.65).toFixed(2);
    filters.push(`drop-shadow(0 16px ${blur}px rgba(0,0,0,${alpha}))`);
  }

  return filters.length > 0 ? filters.join(" ") : "none";
}

async function renderStudioToCanvas(
  result: ProcessResult,
  originalImage: string | null,
  config: StudioCompositionConfig,
  onlyTransparent = false
): Promise<HTMLCanvasElement> {
  const {
    bgType,
    aspectRatio,
    selectedColor,
    selectedGradient,
    customBgUrl,
    bokehBlur,
    shadowIntensity,
    subjectScale,
    subjectOffset,
    flipHorizontal,
    rotation,
    brightness,
    contrast,
    saturation,
    outlineWidth,
    outlineColor,
  } = config;

  const { width, height } = onlyTransparent
    ? { width: result.width, height: result.height }
    : getCanvasDimensions(result.width, result.height, aspectRatio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  if (onlyTransparent) {
    const fgImg = await loadImage(result.transparent_image);
    ctx.drawImage(fgImg, 0, 0, width, height);
    return canvas;
  }

  // 1. Arka Plan Katmanı
  if (bgType === "color") {
    ctx.fillStyle = selectedColor;
    ctx.fillRect(0, 0, width, height);
  } else if (bgType === "gradient") {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, selectedGradient.colors[0]);
    grad.addColorStop(1, selectedGradient.colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (bgType === "bokeh" && originalImage) {
    const origImg = await loadImage(originalImage);
    ctx.save();
    ctx.filter = `blur(${bokehBlur * 2}px)`;
    ctx.drawImage(origImg, -40, -40, width + 80, height + 80);
    ctx.restore();
  } else if (bgType === "custom" && customBgUrl) {
    const bgImg = await loadImage(customBgUrl);
    ctx.drawImage(bgImg, 0, 0, width, height);
  }

  // 2. Ön Plan Katmanı (Orantılı Sığdırma + Ölçek + Konum + Döndürme + Aynalama + Kontur + Işık/Gölge)
  const fgImg = await loadImage(result.transparent_image);

  const fitScale = Math.min(width / result.width, height / result.height);
  const scale = (subjectScale / 100) * fitScale;
  const targetW = result.width * scale;
  const targetH = result.height * scale;

  const centerX = width / 2 + (subjectOffset.x / 100) * width;
  const centerY = height / 2 + (subjectOffset.y / 100) * height;

  ctx.save();
  ctx.translate(centerX, centerY);
  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }
  if (flipHorizontal) {
    ctx.scale(-1, 1);
  }

  // Eğer Dış Kontur (Outline) aktifse önce kontur silüetini 16 açıdan çiz
  if (outlineWidth > 0) {
    const scaledOutline = Math.max(2, Math.round((width / 600) * outlineWidth));
    const offCanvas = document.createElement("canvas");
    offCanvas.width = Math.ceil(targetW + scaledOutline * 4);
    offCanvas.height = Math.ceil(targetH + scaledOutline * 4);
    const offCtx = offCanvas.getContext("2d");

    if (offCtx) {
      const ox = scaledOutline * 2;
      const oy = scaledOutline * 2;
      const steps = 16;
      for (let i = 0; i < steps; i++) {
        const angle = (i * 2 * Math.PI) / steps;
        const dx = Math.cos(angle) * scaledOutline;
        const dy = Math.sin(angle) * scaledOutline;
        offCtx.drawImage(fgImg, ox + dx, oy + dy, targetW, targetH);
      }
      offCtx.globalCompositeOperation = "source-in";
      offCtx.fillStyle = outlineColor;
      offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);

      ctx.drawImage(
        offCanvas,
        -targetW / 2 - ox,
        -targetH / 2 - oy,
        offCanvas.width,
        offCanvas.height
      );
    }
  }

  // Gölge ve Renk/Işık Filtreleri
  const colorFilters: string[] = [];
  if (brightness !== 100) colorFilters.push(`brightness(${brightness}%)`);
  if (contrast !== 100) colorFilters.push(`contrast(${contrast}%)`);
  if (saturation !== 100) colorFilters.push(`saturate(${saturation}%)`);
  if (colorFilters.length > 0) {
    ctx.filter = colorFilters.join(" ");
  }

  if (shadowIntensity > 0 && bgType !== "transparent") {
    const alpha = (shadowIntensity / 100) * 0.65;
    ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
    ctx.shadowBlur = Math.round(width * 0.03 * (shadowIntensity / 50));
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = Math.round(height * 0.012);
  }

  ctx.drawImage(fgImg, -targetW / 2, -targetH / 2, targetW, targetH);
  ctx.restore();

  return canvas;
}

export async function exportStudioComposition(
  result: ProcessResult,
  originalImage: string | null,
  config: StudioCompositionConfig,
  onlyTransparent = false
): Promise<void> {
  if (onlyTransparent) {
    triggerDownload(result.transparent_image, "cutout-transparent.png");
    return;
  }

  const canvas = await renderStudioToCanvas(
    result,
    originalImage,
    config,
    onlyTransparent
  );
  const dataUrl = canvas.toDataURL("image/png");
  triggerDownload(dataUrl, `studio-export-${Date.now()}.png`);
}

export async function copyStudioToClipboard(
  result: ProcessResult,
  originalImage: string | null,
  config: StudioCompositionConfig
): Promise<boolean> {
  const canvas = await renderStudioToCanvas(result, originalImage, config, false);

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve(false);
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        resolve(true);
      } catch {
        resolve(false);
      }
    }, "image/png");
  });
}
