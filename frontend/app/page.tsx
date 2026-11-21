"use client";

import React from "react";
import { Cpu, Layers, Sliders } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Dropzone } from "@/components/upload/Dropzone";
import { SampleGallery } from "@/components/upload/SampleGallery";
import { CanvasToolbar } from "@/components/studio/CanvasToolbar";
import { StudioStage } from "@/components/studio/StudioStage";
import { InspectorPanel } from "@/components/studio/InspectorPanel";
import { HistoryFilmstrip } from "@/components/studio/HistoryFilmstrip";
import { useStudio } from "@/hooks/useStudio";

export default function AIBackgroundStudioPage() {
  const {
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
  } = useStudio();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex flex-col selection:bg-white selection:text-black">
      <Header
        hasResult={Boolean(result)}
        onTriggerUpload={() => fileInputRef.current?.click()}
        onResetToHome={resetToHome}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />
      <input
        ref={customBgInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleCustomBgSelect(file);
        }}
        className="hidden"
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-5 sm:py-6">
        {!originalImage && !isLoading ? (
          <div className="max-w-3xl mx-auto mt-4 sm:mt-8 space-y-8 sm:space-y-10">
            <div className="space-y-3 text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white leading-tight">
                Arka planı saniyeler içinde silin ve stüdyoda düzenleyin.
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl">
                Fotoğrafınızı yükleyin; yapay zeka nesneyi saç tellerine kadar
                arka plandan ayırsın. Ardından yeni fon renkleri, optik alan
                derinliği (bokeh) ve kadraj ayarlarıyla görselinizi hazırlayın.
              </p>
            </div>

            <Dropzone
              onFileSelect={handleFileSelect}
              onTriggerClick={() => fileInputRef.current?.click()}
            />

            <SampleGallery onSelectSample={handleSampleSelect} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl border border-white/[0.07] bg-[#111111]/70 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-white">
                  <Cpu className="w-3.5 h-3.5 text-neutral-400" />
                  Hızlı Yerel İşleme
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  MacBook GPU (MPS) hızlandırmasıyla fotoğraflarınız saniyeler
                  içinde işlenir.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-white/[0.07] bg-[#111111]/70 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-white">
                  <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                  Hassas Kenar Kontrolü
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Saç telleri ve ince detaylarda oluşan kenar izlerini temizleme
                  ve yumuşatma ayarı.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-white/[0.07] bg-[#111111]/70 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-white">
                  <Layers className="w-3.5 h-3.5 text-neutral-400" />
                  Stüdyo & Bokeh Modu
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Hazır stüdyo fonları, portre bulanıklığı (bokeh), dış kontur,
                  renk ayarı ve tek tıkla kopyalama.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-8 space-y-3">
              <CanvasToolbar
                viewMode={viewMode}
                result={result}
                isCopied={isCopied}
                onChangeViewMode={setViewMode}
                onExport={() => handleExport(false)}
                onCopy={handleCopyToClipboard}
              />

              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/50 text-red-300 text-xs font-mono">
                  Hata: {error}
                </div>
              )}

              <StudioStage
                isLoading={isLoading}
                isRefiningMask={isRefiningMask}
                viewMode={viewMode}
                originalImage={originalImage}
                result={result}
                bgType={bgType}
                aspectRatio={aspectRatio}
                selectedColor={selectedColor}
                selectedGradient={selectedGradient}
                customBgUrl={customBgUrl}
                bokehBlur={bokehBlur}
                subjectScale={subjectScale}
                subjectOffset={subjectOffset}
                shadowIntensity={shadowIntensity}
                flipHorizontal={flipHorizontal}
                rotation={rotation}
                brightness={brightness}
                contrast={contrast}
                saturation={saturation}
                outlineWidth={outlineWidth}
                outlineColor={outlineColor}
                isPeekingOriginal={isPeekingOriginal}
                onChangeSubjectOffset={setSubjectOffset}
              />

              <HistoryFilmstrip
                history={history}
                currentOriginalImage={originalImage}
                onSelectHistory={selectHistoryItem}
                onTriggerUpload={() => fileInputRef.current?.click()}
              />
            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-20">
              <InspectorPanel
                hasResult={Boolean(result)}
                isRefiningMask={isRefiningMask}
                inspectorTab={inspectorTab}
                bgType={bgType}
                aspectRatio={aspectRatio}
                selectedColor={selectedColor}
                selectedGradient={selectedGradient}
                bokehBlur={bokehBlur}
                subjectScale={subjectScale}
                subjectOffset={subjectOffset}
                shadowIntensity={shadowIntensity}
                flipHorizontal={flipHorizontal}
                rotation={rotation}
                brightness={brightness}
                contrast={contrast}
                saturation={saturation}
                outlineWidth={outlineWidth}
                outlineColor={outlineColor}
                maskThreshold={maskThreshold}
                maskFeather={maskFeather}
                isCopied={isCopied}
                onChangeTab={setInspectorTab}
                onSelectBgType={selectBgType}
                onSelectAspectRatio={selectAspectRatio}
                onSelectColor={selectSolidColor}
                onSelectGradient={selectGradient}
                onChangeBokehBlur={setBokehBlur}
                onChangeSubjectScale={updateSubjectScale}
                onChangeShadowIntensity={updateShadowIntensity}
                onToggleFlipHorizontal={toggleFlipHorizontal}
                onChangeRotation={updateRotation}
                onChangeBrightness={updateBrightness}
                onChangeContrast={updateContrast}
                onChangeSaturation={updateSaturation}
                onChangeOutlineWidth={updateOutlineWidth}
                onChangeOutlineColor={updateOutlineColor}
                onChangeMaskThreshold={setMaskThreshold}
                onChangeMaskFeather={setMaskFeather}
                onCommitMaskRefinement={commitMaskRefinement}
                onResetPosition={resetPosition}
                onTriggerCustomBgUpload={() =>
                  customBgInputRef.current?.click()
                }
                onExport={handleExport}
                onCopy={handleCopyToClipboard}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
