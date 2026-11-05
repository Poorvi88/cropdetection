import { DiagnosisResult, ScannerType, LanguageCode, ChatMessage, RegionalWeather } from '../types';

export interface ScanPayload {
  imageBase64: string;
  mimeType: string;
  scannerType: ScannerType;
  language: LanguageCode;
  additionalNotes?: string;
}

export async function analyzePlantImage(payload: ScanPayload): Promise<DiagnosisResult> {
  const response = await fetch('/api/scan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || data.message || 'Image analysis failed. Please verify the photo is clear.');
  }

  return data.result as DiagnosisResult;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  language: LanguageCode,
  imageBase64?: string
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      language,
      imageBase64,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Chat response error');
  }

  return data.reply;
}

export async function fetchRegionalWeather(region: string): Promise<RegionalWeather> {
  try {
    const res = await fetch(`/api/weather?region=${encodeURIComponent(region)}`);
    const data = await res.json();
    if (data.success && data.weather) {
      return data.weather;
    }
  } catch (err) {
    console.error('Weather fetch error:', err);
  }

  return {
    location: 'Agricultural Region',
    temp: '28°C',
    condition: 'Optimal Scouting Weather',
    humidity: '60%',
    rainfallProb: '15%',
    advisory: 'Check leaf undersides for early sucking pest colonies and powdery mildew.',
    sprayCondition: 'Favorable before noon',
  };
}

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return { status: 'error', hasApiKey: false };
  }
}
