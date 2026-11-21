"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SAMPLE_IMAGES } from "@/constants/studio-presets";

interface SampleGalleryProps {
  onSelectSample: (url: string) => void;
}

export function SampleGallery({ onSelectSample }: SampleGalleryProps) {
  return (
    <div className="space-y-3.5 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500">
          Örnek Test Veri Seti
        </span>
        <span className="text-xs text-neutral-500">
          Tek tıkla modeli test edin
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {SAMPLE_IMAGES.map((sample) => (
          <button
            key={sample.title}
            onClick={() => onSelectSample(sample.url)}
            className="group overflow-hidden rounded-xl border border-white/[0.08] bg-[#111111] hover:border-white/[0.22] transition-all duration-200 text-left cursor-pointer"
          >
            <div className="aspect-[16/10] overflow-hidden bg-neutral-900 relative">
              <Image
                src={sample.url}
                alt={sample.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10">
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="p-3.5">
              <p className="text-xs font-medium text-white">{sample.title}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                {sample.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
