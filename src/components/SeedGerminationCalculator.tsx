import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, Package, Droplets, RotateCcw } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';

interface SeedCalculatorProps {
  language: LanguageCode;
}

export const SeedGerminationCalculator: React.FC<SeedCalculatorProps> = ({ language }) => {
  const t = translations[language];
  const [totalSeeds, setTotalSeeds] = useState<number>(100);
  const [germinatedSeeds, setGerminatedSeeds] = useState<number>(85);
  const [seedType, setSeedType] = useState<string>('Paddy');

  const germinationPercentage =
    totalSeeds > 0 ? Math.min(100, Math.max(0, (germinatedSeeds / totalSeeds) * 100)) : 0;

  const getStatus = (pct: number) => {
    if (pct >= 85) {
      return {
        rating: 'Excellent Germination Rate',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
        badge: 'bg-emerald-600 text-white',
        advice: 'Seeds have high vigor and viability. You can proceed with standard recommended seed rate for sowing.',
      };
    } else if (pct >= 70) {
      return {
        rating: 'Fair / Moderate Germination Rate',
        color: 'text-amber-800 bg-amber-50 border-amber-300',
        badge: 'bg-amber-600 text-white',
        advice: 'Germination is acceptable but sub-optimal. Consider increasing your sowing seed rate by 15-20% to achieve adequate plant population.',
      };
    } else {
      return {
        rating: 'Poor Germination Rate (<70%)',
        color: 'text-rose-800 bg-rose-50 border-rose-300',
        badge: 'bg-rose-600 text-white',
        advice: 'Germination is below certification standards. Do not use this seed lot for main field sowing as it will result in sparse plant density and yield loss.',
      };
    }
  };

  const status = getStatus(germinationPercentage);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-emerald-300 text-xs font-semibold tracking-wider uppercase">
            Seed Technology & Quality
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t.seedCalculator}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-emerald-100 max-w-2xl">
          Test and calculate your seed germination percentage before sowing to prevent low plant density, uneven germination, and wasted investment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Calculator Form */}
        <div className="md:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-base sm:text-lg">
              Seed Test Inputs
            </h3>
            <button
              onClick={() => {
                setTotalSeeds(100);
                setGerminatedSeeds(85);
              }}
              className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Crop / Seed Name
            </label>
            <select
              value={seedType}
              onChange={(e) => setSeedType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50"
            >
              <option value="Paddy">Paddy / Rice (Standard: ≥80%)</option>
              <option value="Wheat">Wheat (Standard: ≥85%)</option>
              <option value="Maize">Maize (Standard: ≥90%)</option>
              <option value="Cotton">Cotton (Standard: ≥65-75%)</option>
              <option value="Tomato">Tomato (Standard: ≥70%)</option>
              <option value="Chilli">Chilli (Standard: ≥60-70%)</option>
              <option value="Soybean">Soybean (Standard: ≥70%)</option>
              <option value="Gram / Pulses">Chickpea / Pulses (Standard: ≥85%)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Total Seeds Tested (Count)
              </label>
              <span className="text-xs font-bold text-slate-700">{totalSeeds} seeds</span>
            </div>
            <input
              type="number"
              min="10"
              max="1000"
              value={totalSeeds}
              onChange={(e) => setTotalSeeds(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">Recommended: Test 100 seeds for direct percentage accuracy.</p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Healthy Germinated Seeds (Sprouted)
              </label>
              <span className="text-xs font-bold text-emerald-700">{germinatedSeeds} sprouted</span>
            </div>
            <input
              type="number"
              min="0"
              max={totalSeeds}
              value={germinatedSeeds}
              onChange={(e) => setGerminatedSeeds(Math.max(0, Math.min(totalSeeds, parseInt(e.target.value) || 0)))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Formula display */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Official ICAR / ISTA Formula:
            </span>
            <div className="font-mono text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 text-center">
              Germination % = (Germinated Seeds / Total Seeds Tested) × 100
            </div>
            <div className="mt-2 text-center text-xs text-emerald-700 font-semibold">
              ({germinatedSeeds} / {totalSeeds}) × 100 = {germinationPercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="md:col-span-6 flex flex-col justify-between bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Calculation Result
            </span>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-5xl font-black text-slate-900 tracking-tight">
                {germinationPercentage.toFixed(1)}%
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.badge}`}>
                {germinationPercentage >= 70 ? 'Viable' : 'Substandard'}
              </span>
            </div>

            <div className={`mt-4 p-4 rounded-2xl border ${status.color}`}>
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                {germinationPercentage >= 70 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                )}
                {status.rating}
              </div>
              <p className="text-xs leading-relaxed opacity-90">{status.advice}</p>
            </div>
          </div>

          {/* Seed testing rules reminder */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              Counting Guidelines
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
              <li>Only count normal, vigorous seedlings with both root (radicle) and shoot (plumule).</li>
              <li>Do not count abnormal seedlings with broken roots or stunted growth.</li>
              <li>Wait for full germination period (Paddy: 7 days, Wheat: 6 days, Cotton: 8 days).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Step by step method */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-teal-600" />
          Simple 7-Step Rag-Doll / Wet Gunny Bag Seed Testing Method
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              step: '1. Select Representative Sample',
              desc: 'Draw seeds randomly from top, middle, and bottom of different bags to get an unbiased sample.',
            },
            {
              step: '2. Use Clean Materials',
              desc: 'Use clean wet cotton cloth, gunny bag, or absorbent paper towel free from mold or detergent.',
            },
            {
              step: '3. Space 100 Seeds Evenly',
              desc: 'Arrange 100 seeds in 10 rows of 10 seeds each, leaving adequate space between them.',
            },
            {
              step: '4. Maintain Suitable Moisture',
              desc: 'Roll the cloth gently, tie the ends loosely, and keep it in a warm, shaded spot. Moisten with clean water daily.',
            },
            {
              step: '5. Observe Germination Daily',
              desc: 'Do not let the cloth dry out or become submerged in stagnant water. Maintain good aeration.',
            },
            {
              step: '6. Count Germinated Seeds',
              desc: 'Unroll the cloth on the 6th to 8th day and count how many seeds have sprouted normal roots and shoots.',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <span className="font-bold text-emerald-700 text-xs block mb-1">
                {item.step}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seed Storage Guidelines */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold">Scientific Seed Storage Best Practices</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-emerald-100">
          <div className="bg-white/10 p-4 rounded-2xl">
            <strong className="block text-white text-sm mb-1">1. Moisture Control</strong>
            Sun-dry seeds thoroughly until moisture is below 10-12% (Paddy: &lt;13%, Wheat/Pulses: &lt;10%). High moisture breeds mold and weevils.
          </div>
          <div className="bg-white/10 p-4 rounded-2xl">
            <strong className="block text-white text-sm mb-1">2. Clean & Air-Tight Bins</strong>
            Store in airtight metal bins or hermetic bags (PUSA bins or GrainPro) placed on wooden pallets off the cold damp floor.
          </div>
          <div className="bg-white/10 p-4 rounded-2xl">
            <strong className="block text-white text-sm mb-1">3. Pest & Rodent Barrier</strong>
            Mix dried Neem leaves (2%) with seeds. Keep rat guards on bin legs and inspect every 3-4 weeks.
          </div>
        </div>
        <div className="text-[11px] text-emerald-300/80 border-t border-emerald-800/80 pt-3">
          Note: Visual inspection from photographs can detect seed surface damage, weevil holes, or mold, but cannot replace physical germination tests or certify genetic purity.
        </div>
      </div>
    </div>
  );
};
