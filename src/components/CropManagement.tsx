import React, { useState } from 'react';
import { Sprout, Calendar, Droplets, Layers, ShieldCheck, Scissors } from 'lucide-react';
import { CROP_GUIDES, CropGuide } from '../data/cropsData';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface CropManagementProps {
  language: LanguageCode;
}

export const CropManagement: React.FC<CropManagementProps> = ({ language }) => {
  const t = translations[language];
  const [selectedCrop, setSelectedCrop] = useState<CropGuide>(CROP_GUIDES[0]);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-emerald-300 text-xs font-semibold tracking-wider uppercase">
            Agronomy Master Guide
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t.cropManagement}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-emerald-100 max-w-3xl">
          Comprehensive stage-by-stage agronomic practices for major Indian crops: soil preparation, nutrient scheduling, precision irrigation, and pest monitoring.
        </p>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {CROP_GUIDES.map((crop) => (
          <button
            key={crop.id}
            onClick={() => {
              setSelectedCrop(crop);
              setActiveStageIndex(0);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCrop.id === crop.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {crop.name.split(' (')[0]}
            <span className="block text-[10px] font-normal opacity-80">
              {crop.hindiName.split(' (')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* Crop Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {selectedCrop.category} • {selectedCrop.season} Season
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              {selectedCrop.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kannada: {selectedCrop.kannadaName} | Hindi: {selectedCrop.hindiName}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Seed Rate</span>
              <span className="font-bold text-slate-800">{selectedCrop.seedRate}</span>
            </div>
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Plant Spacing</span>
              <span className="font-bold text-slate-800">{selectedCrop.spacing}</span>
            </div>
          </div>
        </div>

        {/* Growth Stages Timeline */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Select Phenological Growth Stage
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {selectedCrop.stages.map((stg, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStageIndex(idx)}
                className={`p-3.5 rounded-2xl text-left border transition-all ${
                  activeStageIndex === idx
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold text-emerald-700 block uppercase">
                  Stage {idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5 leading-snug">
                  {stg.stageName.split(' (')[0]}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">{stg.duration}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Stage Detail Box */}
        {selectedCrop.stages[activeStageIndex] && (
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-black text-slate-900 text-sm sm:text-base">
                {selectedCrop.stages[activeStageIndex].stageName}
              </h5>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Approx: {selectedCrop.stages[activeStageIndex].duration}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Key Agronomic Care
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedCrop.stages[activeStageIndex].keyCare}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5 mb-1.5">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  Irrigation Scheduling
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedCrop.stages[activeStageIndex].irrigation}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  Pest & Disease Watch
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedCrop.stages[activeStageIndex].pestRisk}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Soil, Nutrients, Weeds, Harvesting Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Soil & Land Preparation
            </span>
            <p className="text-xs text-slate-700 leading-relaxed pt-1">
              {selectedCrop.soilType}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              Nutrient Management (NPK)
            </span>
            <p className="text-xs text-slate-700 leading-relaxed pt-1">
              {selectedCrop.nutrientManagement}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-emerald-600" />
              Weed Management
            </span>
            <p className="text-xs text-slate-700 leading-relaxed pt-1">
              {selectedCrop.weedControl}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
            <span className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Harvesting Maturity Indicator
            </span>
            <p className="text-xs text-slate-700 leading-relaxed pt-1">
              {selectedCrop.harvestingIndicator}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
