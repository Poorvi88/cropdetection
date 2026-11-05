import React from 'react';
import { Sprout, Phone, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface FooterProps {
  language: LanguageCode;
  onNavigate: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate }) => {
  const t = translations[language];

  return (
    <footer className="bg-slate-950 text-slate-300 mt-20 border-t border-slate-800 text-xs">
      {/* Kisan Call Center & Support Strip */}
      <div className="bg-emerald-900/40 border-b border-emerald-800/40 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Kisan Call Center (All India Toll Free): 1800-180-1551</span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Available 6:00 AM to 10:00 PM daily in 22 local Indian languages
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight">
                AgriRakshak <span className="text-emerald-400">AI</span>
              </span>
              <span className="block text-[10px] text-slate-400">
                {t.tagline}
              </span>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed max-w-sm">
            Empowering Indian farmers with cutting-edge Gemini vision AI for plant disease diagnosis, leaf health evaluation, safe pesticide guidance, and practical recovery plans in local Indian languages.
          </p>

          <div className="pt-2 text-[11px] text-slate-500">
            Powered by Google Gemini 3.8 Multimodal Vision Model. Built for Indian agro-ecosystems.
          </div>
        </div>

        {/* Quick Features */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-extrabold uppercase tracking-wider text-slate-200 text-xs">
            Core Features
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate('leaf')}
                className="hover:text-emerald-400 transition-colors"
              >
                🍃 {t.leafScanner}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('crop')}
                className="hover:text-emerald-400 transition-colors"
              >
                🌾 {t.cropScanner}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('seed')}
                className="hover:text-emerald-400 transition-colors"
              >
                🌰 {t.seedScanner}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('pesticides')}
                className="hover:text-emerald-400 transition-colors"
              >
                🛡️ {t.pesticideAdvisor}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('ask-ai')}
                className="hover:text-emerald-400 transition-colors"
              >
                💬 {t.askAgriAI} (Voice Assistant)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('seed-calc')}
                className="hover:text-emerald-400 transition-colors"
              >
                🧮 {t.seedCalculator}
              </button>
            </li>
          </ul>
        </div>

        {/* Resources & Safety */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-extrabold uppercase tracking-wider text-slate-200 text-xs">
            Farmer Resources
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button
                onClick={() => onNavigate('dashboard')}
                className="hover:text-emerald-400 transition-colors"
              >
                📊 {t.farmerDashboard}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('crop-guide')}
                className="hover:text-emerald-400 transition-colors"
              >
                📖 {t.cropManagement}
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('how-it-works')}
                className="hover:text-emerald-400 transition-colors"
              >
                ❓ {t.howItWorks}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Mandatory Safety Notice */}
      <div className="border-t border-slate-900 py-6 px-4 sm:px-8 text-[11px] text-slate-500 max-w-7xl mx-auto space-y-2">
        <p className="leading-relaxed">
          <strong className="text-slate-400">Agricultural Safety Disclaimer:</strong> {t.agriDisclaimer}
        </p>
        <p className="text-slate-600">
          © {new Date().getFullYear()} AgriRakshak AI. Dedicated to Indian Farmers • Smart Farming. Healthy Crops. Better Future.
        </p>
      </div>
    </footer>
  );
};
