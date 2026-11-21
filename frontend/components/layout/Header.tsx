"use client";

import React from "react";
import { RotateCcw, ArrowUpRight, Layers } from "lucide-react";

interface HeaderProps {
  hasResult: boolean;
  onTriggerUpload: () => void;
  onResetToHome: () => void;
}

export function Header({
  hasResult,
  onTriggerUpload,
  onResetToHome,
}: HeaderProps) {
  return (
    <header className="border-b border-white/[0.08] bg-[#0a0a0a]/85 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onResetToHome}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center shadow-sm group-hover:bg-neutral-200 transition shrink-0">
              <Layers className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white truncate">
              RMBG Studio
            </span>
          </button>

          <span className="text-neutral-700 hidden sm:inline">/</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.07] text-[11px] font-mono text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            briaai/RMBG-1.4
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {hasResult && (
            <button
              onClick={onTriggerUpload}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-neutral-200 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Yeni Görsel</span>
            </button>
          )}
          <a
            href="https://huggingface.co/briaai/RMBG-1.4"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-white/[0.08] hover:bg-white/[0.03] text-xs text-neutral-400 hover:text-white transition"
          >
            <span className="hidden md:inline">Model Kartı</span>
            <span className="md:hidden font-mono">HF</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
