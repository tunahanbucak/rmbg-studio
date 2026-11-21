"use client";

import React from "react";
import Image from "next/image";
import { History, Plus } from "lucide-react";
import { HistoryItem } from "@/types/studio";

interface HistoryFilmstripProps {
  history: HistoryItem[];
  currentOriginalImage: string | null;
  onSelectHistory: (item: HistoryItem) => void;
  onTriggerUpload: () => void;
}

export function HistoryFilmstrip({
  history,
  currentOriginalImage,
  onSelectHistory,
  onTriggerUpload,
}: HistoryFilmstripProps) {
  if (history.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-3 space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-neutral-500" />
          Oturum Geçmişi ({history.length})
        </span>
        <span className="text-[11px] text-neutral-500">
          Önceki görsellere geçiş yapın
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        <button
          onClick={onTriggerUpload}
          title="Yeni Görsel Ekle"
          className="w-14 h-14 rounded-lg border border-dashed border-white/[0.15] hover:border-white/[0.4] bg-white/[0.02] hover:bg-white/[0.05] flex flex-col items-center justify-center gap-1 shrink-0 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 text-neutral-400" />
          <span className="text-[9px] font-mono text-neutral-500">Yeni</span>
        </button>

        {history.map((item) => {
          const isActive = item.originalImage === currentOriginalImage;
          return (
            <button
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className={`group relative w-14 h-14 rounded-lg overflow-hidden border transition shrink-0 cursor-pointer bg-checkerboard ${
                isActive
                  ? "border-white ring-2 ring-white/20"
                  : "border-white/[0.1] opacity-70 hover:opacity-100 hover:border-white/30"
              }`}
            >
              <Image
                src={item.result.transparent_image}
                alt="History Thumbnail"
                fill
                unoptimized
                className="object-contain p-0.5"
              />
              <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] font-mono text-neutral-300 text-center py-0.5 z-10">
                {item.createdAt}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
