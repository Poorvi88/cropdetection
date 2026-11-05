import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Trash2,
  Printer,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  ArrowRight,
  Database,
  ExternalLink,
} from 'lucide-react';
import { ScanRecord, LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { getScanHistory, deleteScanRecord, clearAllScanRecords, printDiagnosisReport } from '../services/storageService';

interface FarmerDashboardProps {
  language: LanguageCode;
  onNavigateToScan: () => void;
  onViewRecordDetail?: (record: ScanRecord) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  language,
  onNavigateToScan,
}) => {
  const t = translations[language];
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null);

  const loadRecords = () => {
    const list = getScanHistory();
    setRecords(list);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this scan record from your dashboard?')) {
      deleteScanRecord(id);
      loadRecords();
      if (selectedRecord?.id === id) setSelectedRecord(null);
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all your scan history? This action cannot be undone.')) {
      clearAllScanRecords();
      loadRecords();
      setSelectedRecord(null);
    }
  };

  const filtered = records.filter((r) => {
    const matchesType = filterType === 'all' || r.scannerType === filterType;
    const matchesSearch =
      r.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.possibleDisease.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-emerald-300 text-xs font-semibold tracking-wider uppercase">
              Field Health Log & History
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.farmerDashboard}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-xl">
            Track past crop diagnoses, print treatment records for your agricultural officer, and monitor field recovery trends.
          </p>
        </div>

        {/* Sync status & Start Scan CTA */}
        <div className="flex flex-col sm:flex-end gap-2 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local & Cloud-ready Persistence</span>
          </div>
          <button
            onClick={onNavigateToScan}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            New Plant Scan
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop or disease..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['all', 'leaf', 'crop', 'seed'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                  filterType === type
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {records.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
              title="Delete all records"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Records Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedRecord(item)}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail and badges */}
                <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-950 mb-3 border border-slate-100">
                  {item.imageBase64 ? (
                    <img
                      src={item.imageBase64}
                      alt={item.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      No Image Saved
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {item.scannerType}
                  </span>
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.condition === 'healthy'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {item.condition}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="font-semibold text-slate-600">
                    Conf: {item.confidence}
                  </span>
                </div>

                <h3 className="font-black text-slate-900 text-base leading-snug">
                  {item.cropName}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-1">
                  {item.possibleDisease}
                </p>
              </div>

              {/* Card Footer Controls */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    printDiagnosisReport(item);
                  }}
                  className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                  title="Print Report"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-600" />
                  Print
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                    View →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg">{t.noScanHistory}</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              When you scan a leaf, crop, or seed photograph with AgriRakshak AI, the diagnosis, recovery roadmap, and pesticide guidance will be securely saved here.
            </p>
          </div>
          <button
            onClick={onNavigateToScan}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {t.startScanning}
          </button>
        </div>
      )}

      {/* Report Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                  {selectedRecord.scannerType} SCAN • {new Date(selectedRecord.timestamp).toLocaleDateString()}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  {selectedRecord.cropName} - {selectedRecord.possibleDisease}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {selectedRecord.imageBase64 && (
              <div className="rounded-2xl overflow-hidden max-h-56 bg-slate-950 flex items-center justify-center">
                <img
                  src={selectedRecord.imageBase64}
                  alt={selectedRecord.cropName}
                  className="w-full h-full object-contain max-h-56"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block">Condition</span>
                <span className="font-bold text-slate-800 capitalize">{selectedRecord.condition}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-medium block">Severity</span>
                <span className="font-bold text-slate-800">{selectedRecord.severity}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Immediate Recovery Actions:</strong>
                <p>{selectedRecord.result?.plantRecovery?.immediateActions || 'N/A'}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Affected Foliage Care:</strong>
                <p>{selectedRecord.result?.plantRecovery?.affectedLeafManagement || 'N/A'}</p>
              </div>

              {selectedRecord.result?.pesticideGuidance?.needed && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <strong className="block text-amber-900 mb-1">Recommended Active Ingredient:</strong>
                  <p className="font-mono font-bold text-slate-900">
                    {selectedRecord.result.pesticideGuidance.activeIngredient}
                  </p>
                  <p className="text-[11px] text-amber-800 mt-1">
                    Waiting Period (PHI): {selectedRecord.result.pesticideGuidance.preHarvestIntervalDays || 'Refer label'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => printDiagnosisReport(selectedRecord)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                Print Official Report
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
