"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  AspectRatioOption,
  BgType,
  ProcessResult,
  StudioGradient,
  SubjectOffset,
  ViewMode,
} from "@/types/studio";
import { buildSubjectCssFilter } from "@/utils/canvas-exporter";
import { CompareSlider } from "./CompareSlider";

interface StudioStageProps {
  isLoading: boolean;
  isRefiningMask: boolean;
  viewMode: ViewMode;
  originalImage: string | null;
  result: ProcessResult | null;
  bgType: BgType;
  aspectRatio: AspectRatioOption;
  selectedColor: string;
  selectedGradient: StudioGradient;
  customBgUrl: string | null;
  bokehBlur: number;
  subjectScale: number;
  subjectOffset: SubjectOffset;
  shadowIntensity: number;
  flipHorizontal: boolean;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
  outlineWidth: number;
  outlineColor: string;
  isPeekingOriginal: boolean;
  onChangeSubjectOffset: (offset: SubjectOffset) => void;
}

const ASPECT_RATIO_CLASSES: Record<AspectRatioOption, string> = {
  original: "inline-block max-h-[60vh] sm:max-h-[620px]",
  "1:1": "aspect-square w-full max-w-[500px] max-h-[60vh] sm:max-h-[500px]",
  "4:5": "aspect-[4/5] w-full max-w-[440px] max-h-[60vh] sm:max-h-[550px]",
  "16:9": "aspect-video w-full max-w-[740px]",
};

export function StudioStage({
  isLoading,
  isRefiningMask,
  viewMode,
  originalImage,
  result,
  bgType,
  aspectRatio,
  selectedColor,
  selectedGradient,
  customBgUrl,
  bokehBlur,
  subjectScale,
  subjectOffset,
  shadowIntensity,
  flipHorizontal,
  rotation,
  brightness,
  contrast,
  saturation,
  outlineWidth,
  outlineColor,
  isPeekingOriginal,
  onChangeSubjectOffset,
}: StudioStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const startDrag = (clientX: number, clientY: number) => {
    if (viewMode !== "studio") return;
    setIsDragging(true);
    dragStartRef.current = {
      clientX,
      clientY,
      startX: subjectOffset.x,
      startY: subjectOffset.y,
    };
  };

  const moveDrag = (clientX: number, clientY: number) => {
    if (!isDragging || !dragStartRef.current || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const deltaXPercent =
      ((clientX - dragStartRef.current.clientX) / rect.width) * 100;
    const deltaYPercent =
      ((clientY - dragStartRef.current.clientY) / rect.height) * 100;

    onChangeSubjectOffset({
      x: Math.max(
        -45,
        Math.min(45, Math.round(dragStartRef.current.startX + deltaXPercent))
      ),
      y: Math.max(
        -45,
        Math.min(45, Math.round(dragStartRef.current.startY + deltaYPercent))
      ),
    });
  };

  const endDrag = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const cssFilter = buildSubjectCssFilter(
    brightness,
    contrast,
    saturation,
    outlineWidth,
    outlineColor,
    shadowIntensity,
    bgType
  );

  return (
    <div className="space-y-2">
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-checkerboard min-h-[380px] sm:min-h-[520px] max-h-[70vh] sm:max-h-[660px] p-3 sm:p-5 flex items-center justify-center select-none shadow-2xl">
        {isRefiningMask && (
          <div className="absolute top-3.5 right-3.5 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs text-white shadow-lg">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span>Maske güncelleniyor...</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center gap-3.5 p-8 sm:p-12 text-center">
            <div className="w-7 h-7 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-white">
                Arka Plan Siliniyor...
              </p>
              <p className="text-[11px] font-mono text-neutral-500">
                briaai/RMBG-1.4 modeli çalıştırılıyor
              </p>
            </div>
          </div>
        ) : result && originalImage ? (
          <>
            {isPeekingOriginal ? (
              <div className="relative inline-block max-h-[58vh] sm:max-h-[600px]">
                <Image
                  src={originalImage}
                  alt="Original Peek"
                  width={result.width}
                  height={result.height}
                  unoptimized
                  className="block max-h-[58vh] sm:max-h-[600px] w-auto h-auto object-contain rounded-lg"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white">
                  Orijinal Görüntü (Space)
                </span>
              </div>
            ) : (
              <>
                {viewMode === "compare" && (
                  <CompareSlider
                    originalImage={originalImage}
                    transparentImage={result.transparent_image}
                    width={result.width}
                    height={result.height}
                  />
                )}

                {viewMode === "studio" && (
                  <div
                    ref={stageRef}
                    onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
                    onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
                    onMouseUp={endDrag}
                    onMouseLeave={endDrag}
                    onTouchStart={(e) =>
                      startDrag(e.touches[0].clientX, e.touches[0].clientY)
                    }
                    onTouchMove={(e) =>
                      moveDrag(e.touches[0].clientX, e.touches[0].clientY)
                    }
                    onTouchEnd={endDrag}
                    className={`relative overflow-hidden rounded-lg flex items-center justify-center shadow-xl ring-1 ring-white/10 ${
                      ASPECT_RATIO_CLASSES[aspectRatio]
                    } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                    style={{
                      backgroundColor:
                        bgType === "color" ? selectedColor : undefined,
                      backgroundImage:
                        bgType === "gradient"
                          ? selectedGradient.css
                          : undefined,
                    }}
                  >
                    {bgType === "bokeh" && (
                      <Image
                        src={originalImage}
                        alt="Bokeh"
                        fill
                        unoptimized
                        style={{
                          filter: `blur(${bokehBlur}px)`,
                          transform: "scale(1.08)",
                        }}
                        className="object-cover pointer-events-none"
                      />
                    )}

                    {bgType === "custom" && customBgUrl && (
                      <Image
                        src={customBgUrl}
                        alt="Custom Background"
                        fill
                        unoptimized
                        className="object-cover pointer-events-none"
                      />
                    )}

                    <Image
                      src={result.transparent_image}
                      alt="Subject"
                      width={result.width}
                      height={result.height}
                      unoptimized
                      draggable={false}
                      style={{
                        transform: `translate(${subjectOffset.x}%, ${subjectOffset.y}%) rotate(${rotation}deg) scale(${(subjectScale / 100) * (flipHorizontal ? -1 : 1)}, ${subjectScale / 100})`,
                        filter: cssFilter !== "none" ? cssFilter : undefined,
                      }}
                      className="relative z-10 block max-h-[56vh] sm:max-h-[580px] max-w-full w-auto h-auto object-contain pointer-events-none"
                    />
                  </div>
                )}

                {viewMode === "mask" && (
                  <div className="relative inline-block max-h-[58vh] sm:max-h-[600px] bg-black rounded-lg overflow-hidden ring-1 ring-white/10">
                    <Image
                      src={result.mask_image}
                      alt="Alpha Mask"
                      width={result.width}
                      height={result.height}
                      unoptimized
                      className="block max-h-[58vh] sm:max-h-[600px] w-auto h-auto object-contain"
                    />
                  </div>
                )}
              </>
            )}
          </>
        ) : null}
      </div>

      {/* Alt Teknik Durum Çubuğu */}
      {result && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#111111]/80 border border-white/[0.06] text-[11px] font-mono text-neutral-500">
          <div className="flex items-center gap-3">
            <span>
              Mod:{" "}
              <strong className="text-neutral-300 font-normal">
                {viewMode === "compare"
                  ? "Öncesi/Sonrası"
                  : viewMode === "studio"
                    ? "Stüdyo Sahnesi"
                    : "Alfa Maskesi (8-Bit L)"}
              </strong>
            </span>
            {viewMode === "studio" && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">
                  Konum: X:{subjectOffset.x}% Y:{subjectOffset.y}%
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">
                  Ölçek: {subjectScale}%
                </span>
              </>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.07] text-[10px] text-neutral-400">
              Space
            </span>
            <span>Orijinali Önizle</span>
          </div>
        </div>
      )}
    </div>
  );
}
