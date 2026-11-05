import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Printer,
  BookmarkCheck,
  MessageSquare,
  Sprout,
  Activity,
  Layers,
  Droplets,
  Calendar,
  AlertTriangle,
  Leaf,
  Info,
} from 'lucide-react';
import { ScannerType, LanguageCode, DiagnosisResult } from '../types';
import { translations } from '../i18n/translations';
import { CameraModal } from './CameraModal';
import { analyzePlantImage } from '../services/api';
import { saveScanRecord, printDiagnosisReport } from '../services/storageService';

interface ScannerViewProps {
  scannerType: ScannerType;
  onSelectScannerType: (type: ScannerType) => void;
  language: LanguageCode;
  onNavigateToChat: (question?: string, image?: string) => void;
  onNavigateToPesticides: (crop?: string) => void;
  onNavigateToSeedCalc: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  scannerType,
  onSelectScannerType,
  language,
  onNavigateToChat,
  onNavigateToPesticides,
  onNavigateToSeedCalc,
}) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'overview' | 'recovery' | 'pesticide' | 'prevention' | 'seed'>('overview');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Handle image capture from CameraModal
  const handleCameraCapture = (base64Image: string, mimeType: string) => {
    setSelectedImage(base64Image);
    setImageMime(mimeType);
    setErrorMessage(null);
    setDiagnosisResult(null);
    setSavedSuccess(false);
  };

  // Handle device file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file format (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('Image size is too large (max 20MB). Please select a compressed image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setImageMime(file.type || 'image/jpeg');
      setErrorMessage(null);
      setDiagnosisResult(null);
      setSavedSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setSelectedImage(null);
    setDiagnosisResult(null);
    setErrorMessage(null);
    setSavedSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Perform actual Gemini vision analysis
  const handleRunScan = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMessage(null);
    setDiagnosisResult(null);
    setSavedSuccess(false);

    try {
      const result = await analyzePlantImage({
        imageBase64: selectedImage,
        mimeType: imageMime,
        scannerType,
        language,
        additionalNotes,
      });

      setDiagnosisResult(result);
      // Auto save to local storage history
      saveScanRecord(scannerType, result, selectedImage, additionalNotes);
      setSavedSuccess(true);
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMessage(
        err.message ||
          'Failed to analyze plant photograph. Please verify your connection and ensure the picture is clear and well-lit.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scannerConfig = {
    leaf: {
      title: t.leafScannerTitle,
      subtitle: t.leafScannerSubtitle,
      icon: Leaf,
      color: 'emerald',
      badge: 'Leaf Disease AI',
    },
    crop: {
      title: t.cropScannerTitle,
      subtitle: t.cropScannerSubtitle,
      icon: Sprout,
      color: 'teal',
      badge: 'Crop Canopy AI',
    },
    seed: {
      title: t.seedScannerTitle,
      subtitle: t.seedScannerSubtitle,
      icon: Layers,
      color: 'amber',
      badge: 'Seed Quality AI',
    },
  }[scannerType];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* 3 Main Scanner Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-slate-200/70 p-2 rounded-3xl">
        {[
          {
            type: 'leaf' as ScannerType,
            label: t.leafScanner,
            desc: 'Foliar spots, rust, blight',
            icon: Leaf,
          },
          {
            type: 'crop' as ScannerType,
            label: t.cropScanner,
            desc: 'Canopy, wilting, lodging',
            icon: Sprout,
          },
          {
            type: 'seed' as ScannerType,
            label: t.seedScanner,
            desc: 'Grain quality & mold',
            icon: Layers,
          },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = scannerType === item.type;
          return (
            <button
              key={item.type}
              onClick={() => {
                onSelectScannerType(item.type);
                setDiagnosisResult(null);
              }}
              className={`flex items-center gap-3 p-4 rounded-2xl text-left transition-all ${
                isSelected
                  ? 'bg-white text-emerald-950 shadow-md ring-2 ring-emerald-600'
                  : 'text-slate-700 hover:bg-white/50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm block leading-tight">{item.label}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">{item.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Scanner Stage */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 px-6 sm:px-8 py-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-emerald-300 border border-white/10 uppercase tracking-wider mb-2">
              {scannerConfig.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {scannerConfig.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {scannerConfig.subtitle}
            </p>
          </div>

          {scannerType === 'seed' && (
            <button
              onClick={onNavigateToSeedCalc}
              className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 rounded-xl text-xs font-bold transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              🧮 Open Germination Calculator
            </button>
          )}
        </div>

        {/* Upload / Camera Stage */}
        <div className="p-6 sm:p-8 space-y-6">
          {!selectedImage ? (
            /* No photo selected state */
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 hover:bg-emerald-50/20 rounded-3xl p-8 sm:p-12 text-center transition-all flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg mb-1">
                Provide a field photograph to begin diagnosis
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
                Take a clear, close-up photograph of the affected plant part in natural daylight. Avoid blur, shadow, or extreme distance.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Take Photo Button */}
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Camera className="w-5 h-5" />
                  {t.takePhoto}
                </button>

                {/* Upload Image Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-sm rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Upload className="w-5 h-5 text-slate-500" />
                  {t.uploadImage}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
                <span>✓ High resolution JPG, PNG, WEBP</span>
                <span>✓ Rear camera focus</span>
                <span>✓ Zero fake results</span>
              </div>
            </div>
          ) : (
            /* Photo Selected Preview State */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Image Container */}
                <div className="md:col-span-6 bg-slate-950 rounded-3xl overflow-hidden relative shadow-inner max-h-[380px] flex items-center justify-center border border-slate-800">
                  <img
                    src={selectedImage}
                    alt="Plant to analyze"
                    className="w-full h-full object-contain max-h-[380px]"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10">
                    {scannerType.toUpperCase()} SAMPLE
                  </div>
                </div>

                {/* Actions and Notes Panel */}
                <div className="md:col-span-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      Photograph Ready for Gemini Vision
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Check that symptoms (spots, leaf margin, insects) are clearly focused before running AI analysis.
                    </p>
                  </div>

                  {/* Optional farmer notes */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Optional Field Notes (Crop name or observed symptoms)
                    </label>
                    <input
                      type="text"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="e.g. Tomato crop, started 3 days ago after rain..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {t.retakePhoto}
                    </button>

                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t.removePhoto}
                    </button>
                  </div>

                  {/* Scan Now Primary Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleRunScan}
                      disabled={isAnalyzing}
                      className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>{t.scanningPlant}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>{t.scanNow}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message Display */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Diagnosis Error</strong>
                {errorMessage}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera Modal Component */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
        language={language}
      />

      {/* Actual AI Diagnosis Results Display */}
      {diagnosisResult && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden space-y-6 animate-in slide-in-from-bottom-4 duration-300">
          {/* Result Header Bar */}
          <div className="bg-slate-900 px-6 sm:px-8 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                {t.diagnosisResults}
              </span>
              <h3 className="text-xl sm:text-2xl font-black mt-1 flex items-center gap-2">
                {diagnosisResult.cropName}
                <span className="text-xs font-normal text-slate-400">
                  ({diagnosisResult.scannerType.toUpperCase()} SCANNER)
                </span>
              </h3>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => printDiagnosisReport({ result: diagnosisResult })}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Download or Print Diagnosis Report"
              >
                <Printer className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">{t.downloadReport}</span>
              </button>

              <button
                onClick={() =>
                  onNavigateToChat(
                    `I scanned my ${diagnosisResult.cropName} leaf and it showed ${diagnosisResult.possibleDisease}. What should I do next?`,
                    selectedImage || undefined
                  )
                }
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.askAboutThisScan}</span>
              </button>
            </div>
          </div>

          {/* Condition Status Banner */}
          <div className="px-6 sm:px-8">
            {diagnosisResult.condition === 'healthy' ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-start gap-3.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-emerald-900 text-base">
                    {t.healthyLeafNotice}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 mt-0.5 leading-relaxed">
                    {t.healthyLeafDesc}
                  </p>
                </div>
              </div>
            ) : diagnosisResult.condition === 'uncertain' ? (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3.5">
                <HelpCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-amber-900 text-base">
                    {t.unknownDiseaseNotice}
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-800 mt-0.5 leading-relaxed">
                    {t.unknownDiseaseDesc}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-300 flex items-start gap-3.5">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-rose-900 text-base">
                      {diagnosisResult.possibleDisease}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-200 text-rose-900">
                      Severity: {diagnosisResult.diseaseSeverity}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                      Confidence: {diagnosisResult.confidence}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">
                    {diagnosisResult.diseaseManagement}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Detail Tabs */}
          <div className="px-6 sm:px-8 border-b border-slate-200 flex gap-2 overflow-x-auto">
            {[
              { id: 'overview', label: 'Diagnosis & Symptoms' },
              { id: 'recovery', label: t.plantRecoveryPlan },
              { id: 'pesticide', label: t.pesticideGuidance },
              { id: 'prevention', label: t.preventionMethods },
              ...(diagnosisResult.seedGuidance ? [{ id: 'seed', label: 'Seed Quality & Germination' }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveResultTab(tab.id as any)}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors ${
                  activeResultTab === tab.id
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="px-6 sm:px-8 pb-8">
            {/* 1. Overview Tab */}
            {activeResultTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      {t.cropName}
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm">
                      {diagnosisResult.cropName}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      {t.leafCondition}
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm capitalize">
                      {diagnosisResult.condition.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      {t.confidenceLevel}
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm">
                      {diagnosisResult.confidence}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase block">
                      {t.imageQuality}
                    </span>
                    <span className="font-extrabold text-slate-800 text-sm">
                      {diagnosisResult.imageQuality}
                    </span>
                  </div>
                </div>

                {/* Visible Symptoms & Causes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      {t.visibleSymptoms}
                    </h5>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                      {diagnosisResult.visibleSymptoms.map((symp, i) => (
                        <li key={i}>{symp}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-teal-600" />
                      {t.possibleCauses}
                    </h5>
                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                      {diagnosisResult.possibleCauses.map((cause, i) => (
                        <li key={i}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Follow-up and Expert Callout */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold block">
                      {t.expertConsultation}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {diagnosisResult.expertAdvice}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Plant Recovery Plan Tab */}
            {activeResultTab === 'recovery' && (
              <div className="space-y-4">
                <div className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-800">
                  <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider block mb-1">
                    Problem Identification
                  </span>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    {diagnosisResult.plantRecovery.problemIdentification}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <strong className="text-xs font-bold text-slate-800 block mb-1">
                      1. {t.immediateActions}
                    </strong>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {diagnosisResult.plantRecovery.immediateActions}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <strong className="text-xs font-bold text-slate-800 block mb-1">
                      2. {t.affectedLeafManagement}
                    </strong>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {diagnosisResult.plantRecovery.affectedLeafManagement}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <strong className="text-xs font-bold text-slate-800 block mb-1">
                      3. {t.waterManagement}
                    </strong>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {diagnosisResult.plantRecovery.waterManagement}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <strong className="text-xs font-bold text-slate-800 block mb-1">
                      4. {t.soilNutrientManagement}
                    </strong>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {diagnosisResult.plantRecovery.soilAndNutrientManagement}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <strong className="text-xs font-bold text-slate-800 block">
                    5. {t.followUpMonitoring}
                  </strong>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {diagnosisResult.plantRecovery.recoveryMonitoring}
                  </p>
                  {diagnosisResult.plantRecovery.recoveryRealisticNote && (
                    <p className="text-[11px] text-slate-500 italic pt-1">
                      Note: {diagnosisResult.plantRecovery.recoveryRealisticNote}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 3. Pesticide Guidance Tab */}
            {activeResultTab === 'pesticide' && (
              <div className="space-y-4">
                {diagnosisResult.pesticideGuidance?.needed ? (
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        Targeted Chemical Active Ingredient
                      </span>
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        PHI: {diagnosisResult.pesticideGuidance.preHarvestIntervalDays || 'Refer label'}
                      </span>
                    </div>

                    <div className="font-mono text-sm font-black text-slate-900 bg-white p-3 rounded-xl border border-amber-200">
                      {diagnosisResult.pesticideGuidance.activeIngredient}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {diagnosisResult.pesticideGuidance.safetyPrecautions}
                    </p>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                        {t.protectiveEquipment}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {diagnosisResult.pesticideGuidance.protectiveEquipment?.map((ppe, i) => (
                          <span
                            key={i}
                            className="bg-white px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 border border-slate-200 shadow-2xs"
                          >
                            🛡️ {ppe}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800">
                    Chemical pesticides are not recommended for this sample. Continue normal agronomic care.
                  </div>
                )}

                {/* Natural and Biological IPM */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    {t.naturalControlOptions}
                  </h5>
                  <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-5">
                    {diagnosisResult.naturalControlOptions.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 leading-relaxed border border-slate-200">
                  {diagnosisResult.pesticideGuidance.chemicalDisclaimer}
                </div>
              </div>
            )}

            {/* 4. Prevention Methods Tab */}
            {activeResultTab === 'prevention' && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Long-term Prevention & Cultural Practices
                  </h5>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc pl-5">
                    {diagnosisResult.prevention.map((prev, i) => (
                      <li key={i} className="leading-relaxed">
                        {prev}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800">
                  <strong>Scouting Checkpoint:</strong> {diagnosisResult.followUpMonitoring}
                </div>
              </div>
            )}

            {/* 5. Seed Quality Tab (if available) */}
            {activeResultTab === 'seed' && diagnosisResult.seedGuidance && (
              <div className="space-y-4">
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-2">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-amber-900">
                    Visible Seed Evaluation
                  </h5>
                  <p className="text-xs text-amber-900">
                    <strong>Appearance:</strong> {diagnosisResult.seedGuidance.visibleCondition}
                  </p>
                  <p className="text-xs text-amber-900">
                    <strong>Defects / Damage:</strong> {diagnosisResult.seedGuidance.physicalDamageObserved}
                  </p>
                </div>

                {diagnosisResult.seedGuidance.storageGuidance && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      Storage Recommendations
                    </h5>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
                      {diagnosisResult.seedGuidance.storageGuidance.map((sg, i) => (
                        <li key={i}>{sg}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                  <span className="text-xs text-slate-200">
                    Want to test exact seed germination rate?
                  </span>
                  <button
                    onClick={onNavigateToSeedCalc}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
                  >
                    Calculate Germination %
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
