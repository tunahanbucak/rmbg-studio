"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { STUDIO_GRADIENTS } from "@/constants/studio-presets";
import {
  fetchImageAsBlob,
  removeBackgroundApi,
  warmUpBackendApi,
} from "@/services/api";
import {
  AspectRatioOption,
  BgType,
  HistoryItem,
  InspectorTab,
  ProcessResult,
  StudioCompositionConfig,
  StudioGradient,
  SubjectOffset,
  ViewMode,
} from "@/types/studio";
import {
  copyStudioToClipboard,
  exportStudioComposition,
} from "@/utils/canvas-exporter";

export function useStudio() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [currentBlob, setCurrentBlob] = useState<File | Blob | null>(null);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefiningMask, setIsRefiningMask] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Stüdyo Kompozisyon State'leri
  const [viewMode, setViewMode] = useState<ViewMode>("compare");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("background");
  const [bgType, setBgType] = useState<BgType>("transparent");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>("original");
  const [selectedColor, setSelectedColor] = useState<string>("#F4F1EA");
  const [selectedGradient, setSelectedGradient] = useState<StudioGradient>(
    STUDIO_GRADIENTS[0]
  );
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [bokehBlur, setBokehBlur] = useState<number>(14);
  const [shadowIntensity, setShadowIntensity] = useState<number>(35);
  const [subjectScale, setSubjectScale] = useState<number>(100);
  const [subjectOffset, setSubjectOffset] = useState<SubjectOffset>({
    x: 0,
    y: 0,
  });

  // Yeni Stüdyo Düzenleme State'leri (Aynalama, Döndürme, Işık/Renk, Sticker Kontur)
  const [flipHorizontal, setFlipHorizontal] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [outlineWidth, setOutlineWidth] = useState<number>(0);
  const [outlineColor, setOutlineColor] = useState<string>("#FFFFFF");

  // Derin Öğrenme Maske İyileştirme (Post-Processing) State'leri
  const [maskThreshold, setMaskThreshold] = useState<number>(12);
  const [maskFeather, setMaskFeather] = useState<number>(0);

  // UX Kısayol & Kopyalama State'leri
  const [isPeekingOriginal, setIsPeekingOriginal] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  // Sayfa ilk açıldığında Modal Serverless sunucusunu arka planda sessizce uyandır (Pre-Warming)
  useEffect(() => {
    warmUpBackendApi();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        result &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "BUTTON"
      ) {
        e.preventDefault();
        setIsPeekingOriginal(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsPeekingOriginal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [result]);

  useEffect(() => {
    return () => {
      if (customBgUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(customBgUrl);
      }
    };
  }, [customBgUrl]);

  const resetTransforms = useCallback(() => {
    setSubjectOffset({ x: 0, y: 0 });
    setSubjectScale(100);
    setFlipHorizontal(false);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setOutlineWidth(0);
  }, []);

  const processFile = async (
    file: File | Blob,
    previewUrl: string,
    threshold = 12,
    feather = 0
  ) => {
    setIsLoading(true);
    setError(null);
    setCurrentBlob(file);
    setOriginalImage(previewUrl);
    setMaskThreshold(threshold);
    setMaskFeather(feather);
    resetTransforms();

    try {
      const data = await removeBackgroundApi(file, threshold, feather);
      setResult(data);
      setHistory((prev) => {
        const newItem: HistoryItem = {
          id: `${Date.now()}`,
          originalImage: previewUrl,
          blob: file,
          result: data,
          createdAt: new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        return [newItem, ...prev.slice(0, 7)];
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Sunucu bağlantısı kurulamadı.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Maske slider'ları bırakıldığında (onPointerUp) resmi ekrandan kaybetmeden günceller
  const commitMaskRefinement = async (
    newThreshold = maskThreshold,
    newFeather = maskFeather
  ) => {
    if (!currentBlob || !originalImage) return;

    setIsRefiningMask(true);
    setError(null);
    try {
      const data = await removeBackgroundApi(
        currentBlob,
        newThreshold,
        newFeather
      );
      setResult(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Maske güncellenemedi.";
      setError(message);
    } finally {
      setIsRefiningMask(false);
    }
  };

  const selectHistoryItem = (item: HistoryItem) => {
    setOriginalImage(item.originalImage);
    setCurrentBlob(item.blob);
    setResult(item.result);
    setError(null);
    resetTransforms();
  };

  const handleFileSelect = (file: File) => {
    setViewMode("compare");
    processFile(file, URL.createObjectURL(file));
  };

  const handleSampleSelect = async (sampleUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setViewMode("compare");
      const blob = await fetchImageAsBlob(sampleUrl);
      await processFile(blob, URL.createObjectURL(blob));
    } catch {
      setError("Örnek görsel yüklenemedi.");
      setIsLoading(false);
    }
  };

  const handleCustomBgSelect = (file: File) => {
    setCustomBgUrl(URL.createObjectURL(file));
    setBgType("custom");
    setViewMode("studio");
  };

  const resetPosition = useCallback(() => {
    resetTransforms();
  }, [resetTransforms]);

  const resetToHome = useCallback(() => {
    setOriginalImage(null);
    setCurrentBlob(null);
    setResult(null);
    setError(null);
    resetTransforms();
  }, [resetTransforms]);

  const selectBgType = (type: BgType) => {
    setBgType(type);
    setViewMode("studio");
  };

  const selectAspectRatio = (ratio: AspectRatioOption) => {
    setAspectRatio(ratio);
    setViewMode("studio");
  };

  const selectSolidColor = (color: string) => {
    setSelectedColor(color);
    setBgType("color");
    setViewMode("studio");
  };

  const selectGradient = (gradient: StudioGradient) => {
    setSelectedGradient(gradient);
    setBgType("gradient");
    setViewMode("studio");
  };

  const updateSubjectScale = (scale: number) => {
    setSubjectScale(scale);
    setViewMode("studio");
  };

  const updateShadowIntensity = (intensity: number) => {
    setShadowIntensity(intensity);
    setViewMode("studio");
  };

  const toggleFlipHorizontal = () => {
    setFlipHorizontal((prev) => !prev);
    setViewMode("studio");
  };

  const updateRotation = (deg: number) => {
    setRotation(deg);
    setViewMode("studio");
  };

  const updateBrightness = (val: number) => {
    setBrightness(val);
    setViewMode("studio");
  };

  const updateContrast = (val: number) => {
    setContrast(val);
    setViewMode("studio");
  };

  const updateSaturation = (val: number) => {
    setSaturation(val);
    setViewMode("studio");
  };

  const updateOutlineWidth = (val: number) => {
    setOutlineWidth(val);
    setViewMode("studio");
  };

  const updateOutlineColor = (color: string) => {
    setOutlineColor(color);
    setViewMode("studio");
  };

  const getCompositionConfig = (): StudioCompositionConfig => ({
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
  });

  const handleExport = async (onlyTransparent = false) => {
    if (!result) return;
    await exportStudioComposition(
      result,
      originalImage,
      getCompositionConfig(),
      onlyTransparent
    );
  };

  const handleCopyToClipboard = async () => {
    if (!result) return;
    const ok = await copyStudioToClipboard(
      result,
      originalImage,
      getCompositionConfig()
    );
    if (ok) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return {
    originalImage,
    result,
    isLoading,
    isRefiningMask,
    error,
    history,
    viewMode,
    inspectorTab,
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
    maskThreshold,
    maskFeather,
    isPeekingOriginal,
    isCopied,
    fileInputRef,
    customBgInputRef,
    setViewMode,
    setInspectorTab,
    setBokehBlur,
    setSubjectOffset,
    setMaskThreshold,
    setMaskFeather,
    handleFileSelect,
    handleSampleSelect,
    handleCustomBgSelect,
    commitMaskRefinement,
    selectHistoryItem,
    resetPosition,
    resetToHome,
    selectBgType,
    selectAspectRatio,
    selectSolidColor,
    selectGradient,
    updateSubjectScale,
    updateShadowIntensity,
    toggleFlipHorizontal,
    updateRotation,
    updateBrightness,
    updateContrast,
    updateSaturation,
    updateOutlineWidth,
    updateOutlineColor,
    handleExport,
    handleCopyToClipboard,
  };
}
