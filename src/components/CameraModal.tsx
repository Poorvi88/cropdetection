import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertCircle, Upload, Check } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string, mimeType: string) => void;
  language: LanguageCode;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  language,
}) => {
  const t = translations[language];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [capturedMime, setCapturedMime] = useState<string>('image/jpeg');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Start camera stream
  const startCamera = async (mode: 'environment' | 'user') => {
    setIsInitializing(true);
    setErrorMsg(null);

    // Stop any existing stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser.');
      }

      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      setIsInitializing(false);
    } catch (err: any) {
      console.warn('Live camera access error:', err);
      setIsInitializing(false);
      setErrorMsg(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? t.cameraAccessDenied
          : t.cameraStartError
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedPreview(null);
      startCamera(facingMode);
    } else {
      // Clean up stream when closing
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    // Create an offscreen canvas with actual video dimensions
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front camera, un-mirror if needed or draw as is
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Compress to high quality JPEG
    const base64 = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPreview(base64);
    setCapturedMime('image/jpeg');

    // Pause video
    video.pause();
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedPreview) {
      onCapture(capturedPreview, capturedMime);
      onClose();
    }
  };

  // File fallback upload
  const handleFallbackFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCapturedPreview(base64);
      setCapturedMime(file.type || 'image/jpeg');
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950/80 border-b border-slate-800 text-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {capturedPreview ? t.imagePreview : t.takePhoto}
              </h3>
              <p className="text-xs text-slate-400">
                {capturedPreview
                  ? 'Inspect photo before scanning'
                  : 'Hold steady & ensure clear natural lighting'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={t.closeCamera}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[360px] sm:min-h-[440px] overflow-hidden">
          {/* Live Video Feed */}
          {!capturedPreview && !errorMsg && (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
              {/* Crop guide overlay */}
              <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-emerald-400/60 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[11px] sm:text-xs bg-slate-950/70 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                  Align leaf, crop or seeds inside box
                </span>
              </div>
            </>
          )}

          {/* Captured Preview */}
          {capturedPreview && (
            <img
              src={capturedPreview}
              alt="Captured plant preview"
              className="w-full h-full object-contain max-h-[500px]"
            />
          )}

          {/* Error / Fallback State */}
          {errorMsg && !capturedPreview && (
            <div className="p-6 text-center max-w-md mx-auto text-white">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertCircle className="w-8 h-8" />
              </div>
              <p className="text-sm text-slate-200 mb-2 font-medium">{errorMsg}</p>
              <p className="text-xs text-slate-400 mb-5">
                No problem! You can select a photo directly from your device gallery or camera app.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl shadow-lg transition-all"
              >
                <Upload className="w-4 h-4" />
                {t.uploadImage}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFallbackFile}
              />
            </div>
          )}

          {/* Initializing indicator */}
          {isInitializing && !errorMsg && !capturedPreview && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-xs text-slate-300">Opening camera...</span>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-white">
          {!capturedPreview ? (
            <>
              {/* Device Gallery Button */}
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-2 text-xs"
                  title="Upload from gallery"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.uploadImage}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFallbackFile}
                />
              </div>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleCaptureFrame}
                disabled={isInitializing || Boolean(errorMsg)}
                className="w-16 h-16 rounded-full bg-white p-1 shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center group"
                title={t.capturePhoto}
              >
                <div className="w-full h-full rounded-full border-4 border-slate-950 bg-emerald-500 group-hover:bg-emerald-400 transition-colors flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>

              {/* Switch Camera Button */}
              <button
                type="button"
                onClick={toggleCameraFacing}
                disabled={isInitializing || Boolean(errorMsg)}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-2 text-xs disabled:opacity-40"
                title={t.switchCamera}
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">{t.switchCamera}</span>
              </button>
            </>
          ) : (
            /* Controls after photo is taken */
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                {t.retakePhoto}
              </button>
              
              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
              >
                <Check className="w-5 h-5" />
                Use Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
