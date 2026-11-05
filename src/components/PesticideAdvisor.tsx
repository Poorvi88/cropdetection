import React, { useState } from 'react';
import { ShieldAlert, Search, Filter, AlertTriangle, CheckCircle, Leaf, Bug, Sparkles, BookOpen } from 'lucide-react';
import { VERIFIED_PESTICIDES_DB, PesticideRecord } from '../data/pesticidesData';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface PesticideAdvisorProps {
  language: LanguageCode;
  initialCropFilter?: string;
}

export const PesticideAdvisor: React.FC<PesticideAdvisorProps> = ({
  language,
  initialCropFilter = '',
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState<string>(initialCropFilter);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<PesticideRecord | null>(null);

  const filteredRecords = VERIFIED_PESTICIDES_DB.filter((item) => {
    const matchesSearch =
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetProblem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="text-emerald-400 text-xs font-semibold tracking-wider uppercase">
            CIBRC & ICAR Verified Standards
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t.pesticideAdvisor} & Integrated Pest Management (IPM)
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl">
          Verified active ingredients, waiting periods (PHI), personal protective equipment (PPE), and organic biological alternatives for Indian agriculture. Never spray without reading container labels.
        </p>

        {/* Safety Disclaimer Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs sm:text-sm text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 block font-semibold mb-0.5">
              Strict Indian Pesticide Safety Mandate:
            </strong>
            Always adopt non-chemical biological and cultural controls first. Check physical container label for exact registered dosage and batch registration before spraying. Wear full protective equipment and respect the Pre-Harvest Interval (waiting period).
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop, disease, or active ingredient..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {['All', 'Fungicide', 'Insecticide', 'Biological / Organic'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedType === type
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Pesticide and IPM Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRecords.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  {item.crop}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    item.isBiological
                      ? 'bg-teal-100 text-teal-800'
                      : item.type === 'Fungicide'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.type}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base mb-1">
                {item.targetProblem}
              </h3>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                  Verified Active Ingredient
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {item.activeIngredient}
                </span>
                <span className="block text-slate-500 text-[11px] mt-0.5">
                  Formulation: {item.formulation}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Waiting Period (PHI):</span>
                  <span className="font-bold text-slate-800">{item.preHarvestInterval}</span>
                </div>
                <p className="line-clamp-2 text-slate-600 text-xs">
                  {item.applicationGuidance}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {item.nonChemicalAlternatives.length} organic IPM options
              </span>
              <button
                onClick={() => setSelectedRecord(item)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                View Full Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
          <Bug className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-700">No matching active ingredients found</h4>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for common crops like "Tomato", "Paddy", "Cotton", or "Wheat".
          </p>
        </div>
      )}

      {/* Integrated Pest Management (IPM) 5-Pillar Framework */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold">The 5 Pillars of Integrated Pest Management (IPM)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: '1. Regular Scouting',
              desc: 'Inspect 20 random plants across the field twice a week. Check leaf undersides for early egg clusters and nymphs.',
            },
            {
              title: '2. Cultural Practices',
              desc: 'Crop rotation with pulses, deep summer ploughing to expose pupae, optimal plant spacing, and clean weed-free borders.',
            },
            {
              title: '3. Mechanical & Physical',
              desc: 'Install yellow sticky traps (whitefly/aphids), blue traps (thrips), pheromone traps, and handpick gregarious caterpillars.',
            },
            {
              title: '4. Biological Control',
              desc: 'Conserve beneficial predators (ladybird beetles, spiders). Spray bio-agents: Trichoderma, Pseudomonas, and Beauveria bassiana.',
            },
            {
              title: '5. Chemical (Last Resort)',
              desc: 'Apply targeted green/blue triangle chemicals only when pest reaches Economic Threshold Level (ETL). Never spray prophylactically.',
            },
          ].map((col, idx) => (
            <div key={idx} className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <h4 className="font-bold text-emerald-400 text-xs mb-1">{col.title}</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">{col.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  {selectedRecord.crop} • {selectedRecord.type}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {selectedRecord.targetProblem}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-xs">
                <span className="text-slate-500 font-medium">Verified Active Ingredient:</span>
                <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                  {selectedRecord.activeIngredient}
                </div>
              </div>
              <div className="text-xs">
                <span className="text-slate-500 font-medium">Formulation:</span>
                <span className="ml-2 font-semibold text-slate-800">{selectedRecord.formulation}</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-500 font-medium">Pre-Harvest Interval (Waiting Period):</span>
                <span className="ml-2 font-bold text-rose-600">{selectedRecord.preHarvestInterval}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                Application Guidance
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedRecord.applicationGuidance}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                Required Personal Protective Equipment (PPE)
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedRecord.ppeRequired.map((ppe, i) => (
                  <span
                    key={i}
                    className="bg-sky-50 text-sky-800 border border-sky-200 text-xs px-2.5 py-1 rounded-lg font-medium"
                  >
                    🛡️ {ppe}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1.5">
                Safety & Environmental Precautions
              </h4>
              <p className="text-xs text-slate-600 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                {selectedRecord.safetyPrecautions}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 mb-1.5 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                Natural & Biological IPM Alternatives
              </h4>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-5">
                {selectedRecord.nonChemicalAlternatives.map((alt, i) => (
                  <li key={i}>{alt}</li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
