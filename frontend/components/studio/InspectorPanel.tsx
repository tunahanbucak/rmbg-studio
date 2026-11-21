"use client";

import React from "react";
import {
  Aperture,
  Check,
  Pipette,
  Image as ImageIcon,
  Download,
  Copy,
  Crosshair,
  Sparkles,
  FlipHorizontal,
  RotateCw,
  Palette,
  Sliders,
} from "lucide-react";
import {
  EDITORIAL_COLORS,
  STUDIO_GRADIENTS,
} from "@/constants/studio-presets";
import {
  AspectRatioOption,
  BgType,
  InspectorTab,
  StudioGradient,
  SubjectOffset,
} from "@/types/studio";

interface InspectorPanelProps {
  hasResult: boolean;
  isRefiningMask: boolean;
  inspectorTab: InspectorTab;
  bgType: BgType;
  aspectRatio: AspectRatioOption;
  selectedColor: string;
  selectedGradient: StudioGradient;
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
  maskThreshold: number;
  maskFeather: number;
  isCopied: boolean;
  onChangeTab: (tab: InspectorTab) => void;
  onSelectBgType: (type: BgType) => void;
  onSelectAspectRatio: (ratio: AspectRatioOption) => void;
  onSelectColor: (color: string) => void;
  onSelectGradient: (gradient: StudioGradient) => void;
  onChangeBokehBlur: (blur: number) => void;
  onChangeSubjectScale: (scale: number) => void;
  onChangeShadowIntensity: (intensity: number) => void;
  onToggleFlipHorizontal: () => void;
  onChangeRotation: (deg: number) => void;
  onChangeBrightness: (val: number) => void;
  onChangeContrast: (val: number) => void;
  onChangeSaturation: (val: number) => void;
  onChangeOutlineWidth: (val: number) => void;
  onChangeOutlineColor: (color: string) => void;
  onChangeMaskThreshold: (val: number) => void;
  onChangeMaskFeather: (val: number) => void;
  onCommitMaskRefinement: (threshold: number, feather: number) => void;
  onResetPosition: () => void;
  onTriggerCustomBgUpload: () => void;
  onExport: (onlyTransparent: boolean) => void;
  onCopy: () => void;
}

const LIGHT_HEX_VALUES = [
  "#ffffff",
  "#f4f1ea",
  "#e5e5e5",
  "#dce2bd",
  "#cbd5e1",
];

const ASPECT_OPTIONS: { label: string; value: AspectRatioOption }[] = [
  { label: "Orijinal", value: "original" },
  { label: "1:1 Kare", value: "1:1" },
  { label: "4:5 Portre", value: "4:5" },
  { label: "16:9 Geniş", value: "16:9" },
];

const OUTLINE_PRESET_COLORS = [
  "#FFFFFF",
  "#000000",
  "#F4F1EA",
  "#EAB308",
  "#38BDF8",
  "#F43F5E",
];

export function InspectorPanel({
  hasResult,
  isRefiningMask,
  inspectorTab,
  bgType,
  aspectRatio,
  selectedColor,
  selectedGradient,
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
  maskThreshold,
  maskFeather,
  isCopied,
  onChangeTab,
  onSelectBgType,
  onSelectAspectRatio,
  onSelectColor,
  onSelectGradient,
  onChangeBokehBlur,
  onChangeSubjectScale,
  onChangeShadowIntensity,
  onToggleFlipHorizontal,
  onChangeRotation,
  onChangeBrightness,
  onChangeContrast,
  onChangeSaturation,
  onChangeOutlineWidth,
  onChangeOutlineColor,
  onChangeMaskThreshold,
  onChangeMaskFeather,
  onCommitMaskRefinement,
  onResetPosition,
  onTriggerCustomBgUpload,
  onExport,
  onCopy,
}: InspectorPanelProps) {
  const isTransformModified =
    subjectOffset.x !== 0 ||
    subjectOffset.y !== 0 ||
    subjectScale !== 100 ||
    flipHorizontal ||
    rotation !== 0 ||
    brightness !== 100 ||
    contrast !== 100 ||
    saturation !== 100 ||
    outlineWidth !== 0;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-4 sm:p-5 flex flex-col justify-between space-y-5 shadow-2xl">
      {/* Üst Sekme Seçici (3 Sekme: Arka Plan | Düzen & Renk | AI Maske) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white">
            Stüdyo Denetimi
          </span>
          {isTransformModified && (
            <button
              onClick={onResetPosition}
              className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <Crosshair className="w-3 h-3" />
              Sıfırla
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0a0a0a] border border-white/[0.06]">
          <button
            onClick={() => onChangeTab("background")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition cursor-pointer ${
              inspectorTab === "background"
                ? "bg-white text-black shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Arka Plan</span>
          </button>
          <button
            onClick={() => onChangeTab("adjust")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition cursor-pointer ${
              inspectorTab === "adjust"
                ? "bg-white text-black shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Düzen & Efekt</span>
          </button>
          <button
            onClick={() => onChangeTab("mask")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition cursor-pointer ${
              inspectorTab === "mask"
                ? "bg-white text-black shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {/* <Sparkles className="w-3.5 h-3.5 shrink-0" /> */}
            <span className="truncate">AI Maske</span>
          </button>
        </div>
      </div>

      {/* SEKME 1: ARKA PLAN VE KADRAJ */}
      {inspectorTab === "background" && (
        <div className="space-y-4">
          {/* Kadraj Oranı */}
          <div className="space-y-2">
            <label className="text-xs text-neutral-400">Kadraj Oranı</label>
            <div className="grid grid-cols-4 gap-1.5">
              {ASPECT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSelectAspectRatio(opt.value)}
                  className={`py-1.5 px-2 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                    aspectRatio === opt.value
                      ? "border-white bg-white text-black"
                      : "border-white/[0.08] bg-[#161616] text-neutral-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zemin Modu: Şeffaf vs Optik Bokeh */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectBgType("transparent")}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition cursor-pointer ${
                bgType === "transparent"
                  ? "border-white bg-white text-black"
                  : "border-white/[0.08] bg-[#161616] text-neutral-400 hover:text-white"
              }`}
            >
              Şeffaf Zemin
            </button>
            <button
              onClick={() => onSelectBgType("bokeh")}
              className={`py-2 px-3 rounded-lg border text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer ${
                bgType === "bokeh"
                  ? "border-white bg-white text-black"
                  : "border-white/[0.08] bg-[#161616] text-neutral-400 hover:text-white"
              }`}
            >
              <Aperture className="w-3.5 h-3.5" />
              Optik Bokeh
            </button>
          </div>

          {bgType === "bokeh" && (
            <div className="p-3 rounded-xl bg-[#161616] border border-white/[0.08] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Alan Derinliği (Blur)</span>
                <span className="font-mono text-white">{bokehBlur}px</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={bokehBlur}
                onChange={(e) => onChangeBokehBlur(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          )}

          {/* Stüdyo Fon Renkleri */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-neutral-400">
                Stüdyo Fon Renkleri
              </label>
              <span className="text-[11px] font-mono text-neutral-500 uppercase">
                {bgType === "color" ? selectedColor : ""}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {EDITORIAL_COLORS.map((c) => {
                const isSelected =
                  bgType === "color" &&
                  selectedColor.toLowerCase() === c.value.toLowerCase();
                const isLight = LIGHT_HEX_VALUES.includes(
                  c.value.toLowerCase()
                );

                return (
                  <button
                    key={c.value}
                    title={c.name}
                    onClick={() => onSelectColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-7 h-7 rounded-full border transition flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-white ring-offset-2 ring-offset-[#111111]"
                        : "border-white/20 hover:scale-105"
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          isLight ? "text-black" : "text-white"
                        }`}
                      />
                    )}
                  </button>
                );
              })}

              <label
                title="Özel Renk Seç"
                className="w-7 h-7 rounded-full border border-white/20 bg-[#1a1a1a] hover:border-white flex items-center justify-center cursor-pointer transition"
              >
                <Pipette className="w-3.5 h-3.5 text-neutral-300" />
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => onSelectColor(e.target.value)}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Stüdyo Işık Geçişleri */}
          <div className="space-y-2">
            <label className="text-xs text-neutral-400">
              Işık & Zemin Geçişleri
            </label>
            <div className="grid grid-cols-3 gap-2">
              {STUDIO_GRADIENTS.map((g) => (
                <button
                  key={g.name}
                  onClick={() => onSelectGradient(g)}
                  className={`group p-1.5 rounded-lg border text-left transition cursor-pointer ${
                    bgType === "gradient" && selectedGradient.name === g.name
                      ? "border-white bg-[#1a1a1a]"
                      : "border-white/[0.08] bg-[#141414] hover:border-white/25"
                  }`}
                >
                  <div
                    style={{ backgroundImage: g.css }}
                    className="h-5 w-full rounded mb-1 border border-black/10"
                  />
                  <p className="text-[10px] font-medium text-neutral-300 truncate">
                    {g.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onTriggerCustomBgUpload}
            className="w-full py-2 px-3 rounded-lg border border-white/[0.08] hover:border-white/25 bg-[#161616] text-xs font-medium text-neutral-300 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
            Özel Arka Plan Görseli Yükle
          </button>
        </div>
      )}

      {/* SEKME 2: DÜZEN, DÖNÜŞÜM, KONTUR VE IŞIK/RENK */}
      {inspectorTab === "adjust" && (
        <div className="space-y-4">
          {/* Aynalama ve Döndürme Butonları */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleFlipHorizontal}
              className={`py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                flipHorizontal
                  ? "border-white bg-white text-black"
                  : "border-white/[0.08] bg-[#161616] text-neutral-300 hover:text-white"
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              Yatay Aynala
            </button>
            <button
              onClick={() => onChangeRotation(((rotation + 90 + 180) % 360) - 180)}
              className="py-2 px-3 rounded-lg border border-white/[0.08] bg-[#161616] text-neutral-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              90° Döndür
            </button>
          </div>

          {/* Ölçek, Açı ve Gölge */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Nesne Ölçeği</span>
                <span className="font-mono text-neutral-200">
                  {subjectScale}%
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={130}
                value={subjectScale}
                onChange={(e) => onChangeSubjectScale(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Serbest Açı (Döndürme)</span>
                <span className="font-mono text-neutral-200">{rotation}°</span>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                value={rotation}
                onChange={(e) => onChangeRotation(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Stüdyo Gölgesi</span>
                <span className="font-mono text-neutral-200">
                  {shadowIntensity}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={shadowIntensity}
                onChange={(e) =>
                  onChangeShadowIntensity(Number(e.target.value))
                }
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          {/* Sticker / Ürün Dış Kontur Çizgisi (Outline / Stroke) */}
          <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">
                Dış Kontur Çizgisi (Sticker)
              </span>
              <span className="font-mono text-neutral-200">
                {outlineWidth}px
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={14}
              value={outlineWidth}
              onChange={(e) => onChangeOutlineWidth(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            {outlineWidth > 0 && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-neutral-500">
                  Kontur Rengi
                </span>
                <div className="flex items-center gap-1.5">
                  {OUTLINE_PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => onChangeOutlineColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full border transition cursor-pointer ${
                        outlineColor.toLowerCase() === color.toLowerCase()
                          ? "ring-2 ring-white ring-offset-1 ring-offset-[#111111]"
                          : "border-white/20"
                      }`}
                    />
                  ))}
                  <label className="w-5 h-5 rounded-full border border-white/25 bg-[#1a1a1a] flex items-center justify-center cursor-pointer">
                    <Pipette className="w-2.5 h-2.5 text-neutral-300" />
                    <input
                      type="color"
                      value={outlineColor}
                      onChange={(e) => onChangeOutlineColor(e.target.value)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Işık & Renk Dengesi (Parlaklık, Kontrast, Doygunluk) */}
          <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Parlaklık</span>
                <span className="font-mono text-neutral-200">
                  {brightness}%
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={140}
                value={brightness}
                onChange={(e) => onChangeBrightness(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Kontrast</span>
                <span className="font-mono text-neutral-200">{contrast}%</span>
              </div>
              <input
                type="range"
                min={60}
                max={140}
                value={contrast}
                onChange={(e) => onChangeContrast(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Renk Doygunluğu</span>
                <span className="font-mono text-neutral-200">
                  {saturation}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={180}
                value={saturation}
                onChange={(e) => onChangeSaturation(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* SEKME 3: DERİN ÖĞRENME ALFA MASKE İYİLEŞTİRME */}
      {inspectorTab === "mask" && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs text-neutral-400 leading-relaxed">
            Kaydırıcıyı bıraktığınızda{" "}
            <strong className="text-white font-normal">briaai/RMBG-1.4</strong>{" "}
            olasılık maskesi üzerinde LUT eşikleme ve Gauss kenar yumuşatması
            yeniden hesaplanır.
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-300">
                Hâle Temizliği (Threshold)
              </span>
              <span className="font-mono text-white">{maskThreshold}/255</span>
            </div>
            <input
              type="range"
              min={0}
              max={120}
              value={maskThreshold}
              onChange={(e) => onChangeMaskThreshold(Number(e.target.value))}
              onPointerUp={(e) =>
                onCommitMaskRefinement(
                  Number((e.target as HTMLInputElement).value),
                  maskFeather
                )
              }
              onKeyUp={() =>
                onCommitMaskRefinement(maskThreshold, maskFeather)
              }
              className="w-full cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500">
              Eşiğin altındaki yarı saydam sınır piksellerini sıfırlayarak koyu
              zeminlerdeki beyaz hâle izlerini siler.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-300">
                Kenar Yumuşatma (Feather)
              </span>
              <span className="font-mono text-white">{maskFeather}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={4}
              step={0.5}
              value={maskFeather}
              onChange={(e) => onChangeMaskFeather(Number(e.target.value))}
              onPointerUp={(e) =>
                onCommitMaskRefinement(
                  maskThreshold,
                  Number((e.target as HTMLInputElement).value)
                )
              }
              onKeyUp={() =>
                onCommitMaskRefinement(maskThreshold, maskFeather)
              }
              className="w-full cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500">
              Keskin kenar geçişlerine Gauss bulanıklığı uygulayarak nesnenin
              yeni arka planla doğal kaynaşmasını sağlar.
            </p>
          </div>

          {isRefiningMask && (
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-300 pt-1">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Maske güncelleniyor...</span>
            </div>
          )}
        </div>
      )}

      {/* SABİT ALT BAR: Her Sekmede Görünür Dışa Aktarma & Kopyalama */}
      {hasResult && (
        <div className="pt-3 border-t border-white/[0.08] space-y-2">
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => onExport(false)}
              className="col-span-3 py-2.5 px-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              PNG İndir
            </button>
            <button
              onClick={onCopy}
              className="col-span-2 py-2.5 px-3 rounded-xl bg-[#1a1a1a] hover:bg-[#242424] border border-white/[0.1] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Kopyala
                </>
              )}
            </button>
          </div>

          {bgType !== "transparent" && (
            <button
              onClick={() => onExport(true)}
              className="w-full py-1.5 px-3 rounded-lg bg-[#141414] hover:bg-[#1c1c1c] border border-white/[0.06] text-neutral-400 hover:text-white text-[11px] font-medium transition cursor-pointer"
            >
              Sadece Şeffaf Katmanı İndir
            </button>
          )}
        </div>
      )}
    </div>
  );
}
