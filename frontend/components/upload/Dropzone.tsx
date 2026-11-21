"use client";

import React, { useState } from "react";
import { Upload, FileImage } from "lucide-react";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  onTriggerClick: () => void;
}

export function Dropzone({ onFileSelect, onTriggerClick }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={onTriggerClick}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 p-8 sm:p-14 text-center cursor-pointer ${
        isDragActive
          ? "border-white bg-white/[0.06] scale-[1.01]"
          : "border-dashed border-white/[0.14] hover:border-white/[0.3] bg-gradient-to-b from-white/[0.03] to-transparent hover:bg-white/[0.04]"
      }`}
    >
      <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mx-auto mb-4 group-hover:scale-105 group-hover:border-white/[0.2] transition">
        {isDragActive ? (
          <FileImage className="w-5 h-5 text-white animate-pulse" />
        ) : (
          <Upload className="w-5 h-5 text-neutral-200" />
        )}
      </div>

      <p className="text-sm sm:text-base font-medium text-white mb-1.5">
        Görseli buraya sürükleyin veya{" "}
        <span className="underline decoration-neutral-500 underline-offset-4 group-hover:decoration-white transition">
          bilgisayardan seçin
        </span>
      </p>
      <p className="text-xs text-neutral-500 font-mono">
        PNG, JPG, WEBP • Yüksek çözünürlüklü yerel çıkarım
      </p>
    </div>
  );
}
