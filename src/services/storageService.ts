import { ScanRecord, DiagnosisResult, ScannerType } from '../types';

const STORAGE_KEY = 'agrirakshak_scan_history_v1';

export function getScanHistory(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read scan history:', err);
    return [];
  }
}

export function saveScanRecord(
  scannerType: ScannerType,
  result: DiagnosisResult,
  imageBase64: string,
  notes?: string
): ScanRecord {
  const records = getScanHistory();
  
  const newRecord: ScanRecord = {
    id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    scannerType,
    cropName: result.cropName || 'Unknown Crop',
    condition: result.condition || 'uncertain',
    possibleDisease: result.possibleDisease || 'Unspecified',
    severity: result.diseaseSeverity || 'None',
    confidence: result.confidence || 'Medium',
    imageBase64,
    result,
    notes,
  };

  // Keep latest 50 records
  const updated = [newRecord, ...records].slice(0, 50);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Storage quota exceeded, removing older image data', e);
    // Remove imageBase64 from older records if storage quota is tight
    const compacted = updated.map((rec, index) =>
      index > 5 ? { ...rec, imageBase64: '' } : rec
    );
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compacted));
    } catch (ignore) {}
  }

  return newRecord;
}

export function deleteScanRecord(id: string): void {
  const records = getScanHistory();
  const filtered = records.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearAllScanRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function printDiagnosisReport(record: ScanRecord | { result: DiagnosisResult; timestamp?: string }): void {
  const res = 'result' in record ? record.result : (record as any);
  const dateStr = 'timestamp' in record && record.timestamp 
    ? new Date(record.timestamp).toLocaleString() 
    : new Date().toLocaleString();

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>AgriRakshak AI - Plant Health Report (${res.cropName})</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; padding: 24px; line-height: 1.5; }
    .header { border-bottom: 2px solid #16a34a; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 24px; font-weight: bold; color: #166534; }
    .tagline { font-size: 13px; color: #64748b; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; }
    .badge-healthy { background: #dcfce7; color: #15803d; }
    .badge-diseased { background: #fee2e2; color: #b91c1c; }
    .section { margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #fafafa; }
    .section h3 { margin-top: 0; color: #15803d; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; }
    ul { margin: 8px 0; padding-left: 20px; }
    li { margin-bottom: 4px; }
    .ppe-tag { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 6px; }
    .disclaimer { font-size: 11px; color: #64748b; margin-top: 30px; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">AgriRakshak AI - Crop Health Report</div>
      <div class="tagline">Smart Farming. Healthy Crops. Better Future.</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #64748b;">
      <div>Date: ${dateStr}</div>
      <div>Scanner: ${res.scannerType.toUpperCase()}</div>
    </div>
  </div>

  <div style="margin-bottom: 16px;">
    <h2>${res.cropName} - <span class="badge ${res.condition === 'healthy' ? 'badge-healthy' : 'badge-diseased'}">${res.possibleDisease}</span></h2>
    <p><strong>Condition:</strong> ${res.condition} | <strong>Severity:</strong> ${res.diseaseSeverity} | <strong>Confidence:</strong> ${res.confidence}</p>
  </div>

  <div class="section">
    <h3>Visible Symptoms & Causes</h3>
    <p><strong>Observed Symptoms:</strong></p>
    <ul>
      ${res.visibleSymptoms.map((s: string) => `<li>${s}</li>`).join('')}
    </ul>
    <p><strong>Likely Causes:</strong></p>
    <ul>
      ${res.possibleCauses.map((c: string) => `<li>${c}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <h3>Plant Recovery Plan</h3>
    <p><strong>Immediate Actions:</strong> ${res.plantRecovery?.immediateActions || 'N/A'}</p>
    <p><strong>Affected Leaf/Plant Care:</strong> ${res.plantRecovery?.affectedLeafManagement || 'N/A'}</p>
    <p><strong>Water Management:</strong> ${res.plantRecovery?.waterManagement || 'N/A'}</p>
    <p><strong>Soil & Nutrition:</strong> ${res.plantRecovery?.soilAndNutrientManagement || 'N/A'}</p>
    <p><strong>Recovery Monitoring:</strong> ${res.plantRecovery?.recoveryMonitoring || 'N/A'}</p>
  </div>

  <div class="section">
    <h3>Safe Pesticide & Biological Control Guidance</h3>
    ${
      res.pesticideGuidance?.needed
        ? `<p><strong>Recommended Active Ingredient:</strong> ${res.pesticideGuidance.activeIngredient || 'Consult local extension officer'}</p>
           <p><strong>Safety Precautions:</strong> ${res.pesticideGuidance.safetyPrecautions}</p>
           <p><strong>Pre-Harvest Interval (PHI):</strong> ${res.pesticideGuidance.preHarvestIntervalDays || 'Refer to container label'}</p>
           <p><strong>Protective Equipment Required:</strong> 
             ${(res.pesticideGuidance.protectiveEquipment || []).map((e: string) => `<span class="ppe-tag">${e}</span>`).join('')}
           </p>`
        : `<p>Chemical pesticide is NOT recommended for this plant state.</p>`
    }
    <p><strong>Natural & Biological Options (IPM):</strong></p>
    <ul>
      ${res.naturalControlOptions.map((opt: string) => `<li>${opt}</li>`).join('')}
    </ul>
  </div>

  <div class="section">
    <h3>Prevention & Monitoring</h3>
    <ul>
      ${res.prevention.map((p: string) => `<li>${p}</li>`).join('')}
    </ul>
    <p><strong>Expert Advice:</strong> ${res.expertAdvice}</p>
  </div>

  <div class="disclaimer">
    <strong>DISCLAIMER:</strong> This report is generated using Gemini AI vision models for agricultural assistance. Always cross-check with your local Krishi Vigyan Kendra (KVK) or state agricultural extension officer before purchasing or spraying any chemical pesticides. Always follow physical product container labels.
  </div>
</body>
</html>
`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}
