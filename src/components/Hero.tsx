import React, { useState, useEffect } from 'react';
import {
  Camera,
  Sprout,
  Layers,
  ShieldAlert,
  MessageSquare,
  LayoutDashboard,
  HelpCircle,
  Sparkles,
  CloudSun,
  ShieldCheck,
  CheckCircle,
  Activity,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { LanguageCode, RegionalWeather } from '../types';
import { translations } from '../i18n/translations';
import { fetchRegionalWeather } from '../services/api';

interface HeroProps {
  language: LanguageCode;
  onNavigate: (section: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ language, onNavigate }) => {
  const t = translations[language];
  const [weather, setWeather] = useState<RegionalWeather | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('karnataka');

  useEffect(() => {
    fetchRegionalWeather(selectedRegion).then((data) => setWeather(data));
  }, [selectedRegion]);

  const featureCards = [
    {
      id: 'leaf',
      title: t.leafScanner,
      desc: 'Diagnose foliar blight, rust, leaf curl, and yellowing with mobile rear camera.',
      icon: Camera,
      badge: 'Foliar Health',
      color: 'from-emerald-700 to-emerald-900',
    },
    {
      id: 'crop',
      title: t.cropScanner,
      desc: 'Evaluate whole field canopy, wilting, lodging, and pest infestations.',
      icon: Sprout,
      badge: 'Field Level',
      color: 'from-teal-700 to-teal-900',
    },
    {
      id: 'seed',
      title: t.seedScanner,
      desc: 'Inspect seed grain quality, weevil damage, visible mold, and calculate germination %.',
      icon: Layers,
      badge: 'Grain & Viability',
      color: 'from-emerald-800 to-slate-900',
    },
    {
      id: 'pesticides',
      title: t.pesticideAdvisor,
      desc: 'Verified CIBRC active ingredients, PPE safety, waiting periods (PHI), and organic IPM.',
      icon: ShieldAlert,
      badge: 'Safety First',
      color: 'from-slate-800 to-slate-900',
    },
    {
      id: 'ask-ai',
      title: t.askAgriAI,
      desc: 'Voice-enabled AI assistant in Kannada, Hindi, Telugu, Tamil, and other Indian languages.',
      icon: MessageSquare,
      badge: 'Voice Assistant',
      color: 'from-teal-800 to-emerald-950',
    },
    {
      id: 'dashboard',
      title: t.farmerDashboard,
      desc: 'Access past scan records, print official diagnosis reports, and monitor crop recovery.',
      icon: LayoutDashboard,
      badge: 'Records & Reports',
      color: 'from-emerald-900 to-teal-950',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-green-950 to-slate-950 text-white p-6 sm:p-12 lg:p-16 shadow-2xl">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AgriRakshak AI • Gemini 3.8 Multimodal Vision</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {t.heroHeading}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-normal">
            {t.heroDescription}
          </p>

          {/* 8 Homepage Action Buttons */}
          <div className="pt-2">
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-300/80 mb-3">
              Explore Agricultural Features:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-4xl mx-auto">
              {/* 1. Start Scanning (Primary) */}
              <button
                type="button"
                onClick={() => onNavigate('leaf')}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                1. {t.startScanning}
              </button>

              {/* 2. Leaf Scanner */}
              <button
                type="button"
                onClick={() => onNavigate('leaf')}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all"
              >
                2. {t.leafScanner}
              </button>

              {/* 3. Crop Scanner */}
              <button
                type="button"
                onClick={() => onNavigate('crop')}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all"
              >
                3. {t.cropScanner}
              </button>

              {/* 4. Seed Scanner */}
              <button
                type="button"
                onClick={() => onNavigate('seed')}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all"
              >
                4. {t.seedScanner}
              </button>

              {/* 5. Pesticide Advisor */}
              <button
                type="button"
                onClick={() => onNavigate('pesticides')}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all"
              >
                5. {t.pesticideAdvisor}
              </button>

              {/* 6. Ask Agri AI */}
              <button
                type="button"
                onClick={() => onNavigate('ask-ai')}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all"
              >
                6. {t.askAgriAI}
              </button>

              {/* 7. Farmer Dashboard */}
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all"
              >
                7. {t.farmerDashboard}
              </button>

              {/* 8. How It Works */}
              <button
                type="button"
                onClick={() => onNavigate('how-it-works')}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all"
              >
                8. {t.howItWorks}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Weather & Agro-Advisory Strip */}
      {weather && (
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <CloudSun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {weather.location}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {weather.temp} • {weather.condition}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                <strong>Field Advisory:</strong> {weather.advisory}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto shrink-0 text-xs">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="karnataka">Karnataka (South)</option>
              <option value="maharashtra">Maharashtra (West)</option>
              <option value="punjab">Punjab (North)</option>
              <option value="up">Uttar Pradesh (Central)</option>
              <option value="andhra">Andhra Pradesh / Telangana</option>
              <option value="tamilnadu">Tamil Nadu</option>
              <option value="central">All India General</option>
            </select>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
              Spray: {weather.sprayCondition}
            </span>
          </div>
        </section>
      )}

      {/* Feature Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Integrated Agricultural Capabilities
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            Zero Mock Data • Verified ICAR Standards
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="bg-white rounded-3xl border border-slate-200 p-6 text-left shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Quick Agronomic Knowledge Banner */}
      <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-3xl p-6 sm:p-8 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Seed & Crop Management Guides
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
            Need comprehensive stage-by-stage agronomy advice?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Access crop phenology schedules, spacing, irrigation, and seed germination testing procedures tailored for Indian agro-climatic conditions.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => onNavigate('crop-guide')}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            {t.cropManagement}
          </button>
          <button
            onClick={() => onNavigate('seed-calc')}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-emerald-700" />
            {t.seedCalculator}
          </button>
        </div>
      </section>
    </div>
  );
};
