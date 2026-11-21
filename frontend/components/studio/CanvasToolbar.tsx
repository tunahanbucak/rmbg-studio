"use client";

import React from "react";
import {
  SplitSquareHorizontal,
  Layers,
  Eye,
  Download,
  Copy,
  Check,
} from "lucide-react";
import { ProcessResult, ViewMode } from "@/types/studio";

interface CanvasToolbarProps {
  viewMode: ViewMode;
  result: ProcessResult | null;
  isCopied: boolean;
  onChangeViewMode: (mode: ViewMode) => void;
  onExport: () => void;
  onCopy: () => void;
}

export function CanvasToolbar({
  viewMode,
  result,
  isCopied,
  onChangeViewMode,
  onExport,
  onCopy,
}: CanvasToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#111111] border border-white/[0.08] p-1.5 rounded-xl">
      <div className="grid grid-cols-3 sm:flex items-center gap-1 w-full sm:w-auto">
        <button
          onClick={() => onChangeViewMode("compare")}
          className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            viewMode === "compare"
              ? "bg-white text-black shadow-sm"
              : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <SplitSquareHorizontal className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Karşılaştır</span>
        </button>
        <button
          onClick={() => onChangeViewMode("studio")}
          className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            viewMode === "studio"
              ? "bg-white text-black shadow-sm"
              : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Layers className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Stüdyo</span>
        </button>
        <button
          onClick={() => onChangeViewMode("mask")}
          className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
            viewMode === "mask"
              ? "bg-white text-black shadow-sm"
              : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <Eye className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Alfa Maskesi</span>
        </button>
      </div>

      {result && (
        <div className="flex items-center justify-between sm:justify-end gap-2 px-2 py-1 sm:py-0 border-t sm:border-t-0 border-white/[0.06]">
          <div className="hidden xl:flex items-center gap-2 font-mono text-[11px] text-neutral-400 mr-1">
            <span>
              {result.width}×{result.height}px
            </span>
            <span className="text-neutral-700">•</span>
            <span>{result.inference_time_ms}ms</span>
            <span className="text-neutral-700">•</span>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] text-neutral-300">
              {result.device}
            </span>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-neutral-200 transition cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopyala</span>
                </>
              )}
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-medium transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PNG İndir</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
