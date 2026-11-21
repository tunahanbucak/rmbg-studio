export type ViewMode = "compare" | "studio" | "mask";

export type BgType = "transparent" | "color" | "gradient" | "bokeh" | "custom";

export type AspectRatioOption = "original" | "1:1" | "4:5" | "16:9";

export type InspectorTab = "background" | "adjust" | "mask";

export interface SubjectOffset {
  x: number; // Yüzdesel yatay kaydırma (-45 ile +45 arası)
  y: number; // Yüzdesel dikey kaydırma (-45 ile +45 arası)
}

export interface ProcessResult {
  success: boolean;
  model: string;
  device: string;
  inference_time_ms: number;
  width: number;
  height: number;
  transparent_image: string;
  mask_image: string;
}

export interface HistoryItem {
  id: string;
  originalImage: string;
  blob: File | Blob;
  result: ProcessResult;
  createdAt: string;
}

export interface EditorialColor {
  name: string;
  value: string;
}

export interface StudioGradient {
  name: string;
  css: string;
  colors: [string, string];
}

export interface SampleImage {
  title: string;
  subtitle: string;
  url: string;
}

export interface StudioCompositionConfig {
  bgType: BgType;
  aspectRatio: AspectRatioOption;
  selectedColor: string;
  selectedGradient: StudioGradient;
  customBgUrl: string | null;
  bokehBlur: number;
  shadowIntensity: number;
  subjectScale: number;
  subjectOffset: SubjectOffset;
  flipHorizontal: boolean;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
  outlineWidth: number;
  outlineColor: string;
}
