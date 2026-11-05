import React from 'react';
import { Camera, Sparkles, AlertCircle, ShieldCheck, MessageSquare, Layers, ArrowRight, HelpCircle } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface HowItWorksProps {
  language: LanguageCode;
  onStartScanning: () => void;
  onOpenChat: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  language,
  onStartScanning,
  onOpenChat,
}) => {
  const t = translations[language];

  const steps = [
    {
      step: '01',
      title: 'Choose Scanner Type',
      subtitle: 'Leaf, Crop, or Seed',
      desc: 'Select Leaf Scanner for foliar spots, Crop Scanner for whole plant canopy and wilting, or Seed Scanner for grain quality and germination check.',
      icon: Layers,
      color: 'emerald',
    },
    {
      step: '02',
      title: 'Take Field Photograph',
      subtitle: 'Mobile Rear Camera or Gallery',
      desc: 'Use your smartphone rear camera in bright daylight. Focus closely on the discolored spot, insect damage, or leaf underside.',
      icon: Camera,
      color: 'teal',
    },
    {
      step: '03',
      title: 'Gemini AI Vision Analysis',
      subtitle: 'Instant Agronomy Model',
      desc: 'The actual photograph is sent directly to Gemini 3.8 Flash, which evaluates real leaf discoloration, pathogen patterns, and symptoms.',
      icon: Sparkles,
      color: 'sky',
    },
    {
      step: '04',
      title: 'Understand Disease & Severity',
      subtitle: 'Transparent Diagnosis',
      desc: 'View identified condition, visual symptoms, confidence level, and image clarity. Healthy leaves are clearly recognized as healthy!',
      icon: AlertCircle,
      color: 'amber',
    },
    {
      step: '05',
      title: 'Actionable Recovery & Pesticide Plan',
      subtitle: 'Safety & IPM First',
      desc: 'Receive immediate actions, water/soil guidance, CIBRC verified active ingredients with pre-harvest intervals (PHI), PPE, and organic alternatives.',
      icon: ShieldCheck,
      color: 'emerald',
    },
    {
      step: '06',
      title: 'Ask Agri AI Voice Assistant',
      subtitle: 'Speak in Your Own Language',
      desc: 'Ask follow-up questions in Kannada, Hindi, Telugu, Tamil, Marathi, Bengali, or English. Listen to spoken responses hands-free.',
      icon: MessageSquare,
      color: 'purple',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Hero Banner */}
      <div className="text-center space-y-3 bg-gradient-to-b from-emerald-50 to-white p-8 sm:p-12 rounded-3xl border border-emerald-100 shadow-sm">
        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
          Farmer Step-By-Step Guide
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How AgriRakshak AI Works
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          From capturing a single leaf photo on your mobile phone to receiving safe, verified agricultural treatment in your mother tongue.
        </p>
      </div>

      {/* 6 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((stg) => {
          const Icon = stg.icon;
          return (
            <div
              key={stg.step}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute -top-3 -right-3 text-6xl font-black text-slate-100 select-none pointer-events-none">
                {stg.step}
              </div>

              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Step {stg.step}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">
                  {stg.title}
                </h3>
                <span className="text-xs font-semibold text-slate-400 block mb-3">
                  {stg.subtitle}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {stg.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Photography Tips for Farmers */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold">4 Golden Rules for Clear Field Photography</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="bg-white/10 p-4 rounded-2xl">
            <strong className="text-white block text-sm mb-1">1. Natural Daylight</strong>
            Take photos between 8 AM and 4 PM. Avoid harsh camera flashes which wash out fungal powder colors.
          </div>
          <div className="bg-white/10 p-4 rounded-2xl">
            <strong className="text-white block text-sm mb-1">2. Steady Focus</strong>
            Hold your mobile 15-20 cm away from the leaf. Ensure spots and leaf veins are razor sharp before clicking.
          </div>
          <div className="bg-white/10 p-4 rounded-2xl">
            <strong className="text-white block text-sm mb-1">3. Check Underside</strong>
            Many pests (aphids, mites, whiteflies, downy mildew) live underneath leaves. Turn the leaf over for a second photo.
          </div>
          <div className="bg-white/10 p-4 rounded-2xl">
            <strong className="text-white block text-sm mb-1">4. Uncluttered Frame</strong>
            Place your hand or a white paper behind the leaf so the camera focuses on the leaf, not background soil or weeds.
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-700 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-black">Ready to inspect your crop?</h3>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-xl mx-auto">
          Start scanning your leaves, crops, or seeds right now using your phone's camera.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={onStartScanning}
            className="px-6 py-3 bg-white text-emerald-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:bg-emerald-50 transition-colors"
          >
            {t.startScanning}
          </button>
          <button
            onClick={onOpenChat}
            className="px-6 py-3 bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl hover:bg-emerald-900 transition-colors"
          >
            {t.askAgriAI}
          </button>
        </div>
      </div>
    </div>
  );
};
