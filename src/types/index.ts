export type ScannerType = 'leaf' | 'crop' | 'seed';

export type LanguageCode =
  | 'en'
  | 'kn'
  | 'hi'
  | 'te'
  | 'ta'
  | 'ml'
  | 'mr'
  | 'bn'
  | 'gu'
  | 'pa';

export interface PlantRecoveryPlan {
  problemIdentification: string;
  immediateActions: string;
  affectedLeafManagement: string;
  waterManagement: string;
  soilAndNutrientManagement: string;
  diseaseManagement?: string;
  pestManagement?: string;
  recoveryMonitoring: string;
  prevention: string;
  expertInspectionNeeded: boolean;
  recoveryRealisticNote?: string;
}

export interface PesticideGuidance {
  needed: boolean;
  activeIngredient?: string;
  verifiedProductInfo?: string;
  applicationGuidance?: string;
  safetyPrecautions: string;
  protectiveEquipment: string[];
  preHarvestIntervalDays?: string;
  warningLabelInstructions?: string;
  chemicalDisclaimer: string;
}

export interface SeedGuidance {
  visibleCondition?: string;
  physicalDamageObserved?: string;
  germinationTestRecommended?: boolean;
  germinationSteps?: string[];
  storageGuidance?: string[];
  disclaimers?: string;
}

export interface DiagnosisResult {
  cropName: string;
  scannerType: ScannerType;
  condition: 'healthy' | 'diseased' | 'pest_damaged' | 'nutrient_deficient' | 'uncertain' | 'environmental_stress';
  possibleDisease: string;
  diseaseSeverity: 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Uncertain';
  confidence: 'High' | 'Medium' | 'Low';
  imageQuality: string;
  visibleSymptoms: string[];
  possibleCauses: string[];
  diseaseManagement: string;
  plantRecovery: PlantRecoveryPlan;
  pesticideGuidance: PesticideGuidance;
  naturalControlOptions: string[];
  prevention: string[];
  followUpMonitoring: string;
  expertAdvice: string;
  seedGuidance?: SeedGuidance;
}

export interface ScanRecord {
  id: string;
  timestamp: string;
  scannerType: ScannerType;
  cropName: string;
  condition: string;
  possibleDisease: string;
  severity: string;
  confidence: string;
  imageBase64: string;
  result: DiagnosisResult;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image?: string;
}

export interface RegionalWeather {
  location: string;
  temp: string;
  condition: string;
  humidity: string;
  rainfallProb: string;
  advisory: string;
  sprayCondition: string;
}
