"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface CompareSliderProps {
  originalImage: string;
  transparentImage: string;
  width: number;
  height: number;
}

export function CompareSlider({
  originalImage,
  transparentImage,
  width,
  height,
}: CompareSliderProps) {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e.clientX)}
      onClick={(e) => handleSliderMove(e.clientX)}
      onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
      className="relative inline-block max-h-[60vh] sm:max-h-[620px] cursor-ew-resize rounded-lg overflow-hidden ring-1 ring-white/10"
    >
      <Image
        src={transparentImage}
        alt="Cutout"
        width={width}
        height={height}
        unoptimized
        className="block max-h-[60vh] sm:max-h-[620px] w-auto h-auto object-contain pointer-events-none"
      />
      <Image
        src={originalImage}
        alt="Original"
        width={width}
        height={height}
        unoptimized
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />
      <div
        style={{ left: `${sliderPos}%` }}
        className="absolute top-0 bottom-0 w-px bg-white/90 pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.9)]"
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-black shadow-xl flex items-center justify-center text-[10px] font-mono">
          ↔
        </div>
      </div>
      <span className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-neutral-300 pointer-events-none">
        Orijinal
      </span>
      <span className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white pointer-events-none">
        İzole (RGBA)
      </span>
    </div>
  );
}
