import { API_BASE_URL } from "@/constants/studio-presets";
import { ProcessResult } from "@/types/studio";

export async function removeBackgroundApi(
  file: File | Blob,
  threshold = 12,
  feather = 0.0
): Promise<ProcessResult> {
  const formData = new FormData();
  formData.append("file", file, "input.jpg");
  formData.append("threshold", String(threshold));
  formData.append("feather", String(feather));

  const response = await fetch(`${API_BASE_URL}/api/remove-bg`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || "Görüntü işlenemedi.");
  }

  return response.json();
}

export async function fetchImageAsBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Örnek görsel indirilemedi.");
  }
  return response.blob();
}

export function warmUpBackendApi(): void {
  // Serverless (Scale-to-Zero) sunucuyu kullanıcı fotoğraf seçerken arka planda uyandırır (Pre-Warming)
  fetch(`${API_BASE_URL}/api/health`, { method: "GET" }).catch(() => {
    // Sessiz başarısızlık: kullanıcı arayüzünü etkilemez
  });
}
