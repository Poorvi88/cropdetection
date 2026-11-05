export interface CropGuide {
  id: string;
  name: string;
  hindiName: string;
  kannadaName: string;
  category: 'Cereal' | 'Vegetable' | 'Cash Crop' | 'Pulse' | 'Oilseed';
  season: 'Kharif' | 'Rabi' | 'Zaid / All-Year';
  soilType: string;
  seedRate: string;
  spacing: string;
  stages: {
    stageName: string;
    duration: string;
    keyCare: string;
    irrigation: string;
    pestRisk: string;
  }[];
  nutrientManagement: string;
  weedControl: string;
  harvestingIndicator: string;
}

export const CROP_GUIDES: CropGuide[] = [
  {
    id: 'crop_tomato',
    name: 'Tomato (Solanum lycopersicum)',
    hindiName: 'टमाटर (Tomato)',
    kannadaName: 'ಟೊಮೆಟೊ (Tomato)',
    category: 'Vegetable',
    season: 'Zaid / All-Year',
    soilType: 'Well-drained sandy loam to clay loam, pH 6.0 - 7.0',
    seedRate: '100-150 g/acre (Hybrid seedlings)',
    spacing: '60 cm between rows, 45-60 cm between plants',
    stages: [
      {
        stageName: 'Nursery & Seedling (0-25 days)',
        duration: '25-30 days',
        keyCare: 'Raise in raised beds or pro-trays with cocopeat and Trichoderma. Harden seedlings 3 days before transplanting.',
        irrigation: 'Light misting daily in nursery.',
        pestRisk: 'Damping-off fungus, thrips vectoring viruses.',
      },
      {
        stageName: 'Vegetative Growth & Staking (25-50 days)',
        duration: '20-25 days',
        keyCare: 'Stake plants with bamboo sticks and twine to keep foliage off moist soil. Prune lower suckers.',
        irrigation: 'Drip irrigation every 2-3 days based on evapotranspiration.',
        pestRisk: 'Leaf miner, early blight on bottom leaves.',
      },
      {
        stageName: 'Flowering & Fruit Setting (50-75 days)',
        duration: '20-25 days',
        keyCare: 'Ensure Boron and Calcium availability to prevent Blossom End Rot. Avoid water stress causing flower drop.',
        irrigation: 'Uniform soil moisture; avoid dry-wet extremes.',
        pestRisk: 'Fruit borer (Helicoverpa), whitefly, powdery mildew.',
      },
      {
        stageName: 'Fruit Maturation & Harvesting (75-120 days)',
        duration: '40-60 days',
        keyCare: 'Harvest at breaker or turning stage for distant markets; red ripe for local consumption.',
        irrigation: 'Reduce watering slightly 48h before harvest to enhance brix/taste.',
        pestRisk: 'Fruit rots, late blight under wet conditions.',
      },
    ],
    nutrientManagement: 'Apply 10 tonnes well-rotted FYM/acre before planting. N:P:K 100:60:60 kg/ha in splits. Top dress Calcium Nitrate at fruit set.',
    weedControl: 'Silver-black plastic mulch (25 micron) or 2 hand weedings at 20 and 40 days after transplanting.',
    harvestingIndicator: 'Fruits develop characteristic pink/red blush. Pick with calyx attached for longer shelf life.',
  },
  {
    id: 'crop_paddy',
    name: 'Paddy / Rice (Oryza sativa)',
    hindiName: 'धान / चावल (Paddy / Rice)',
    kannadaName: 'ಭತ್ತ (Paddy / Rice)',
    category: 'Cereal',
    season: 'Kharif',
    soilType: 'Heavy clay or clayey loam with good water retention capacity, pH 5.5 - 7.5',
    seedRate: '15-20 kg/acre (Transplanted); 8-10 kg (SRI method)',
    spacing: '20 cm × 15 cm (2-3 seedlings per hill)',
    stages: [
      {
        stageName: 'Nursery & Tillering (0-35 days)',
        duration: '30-35 days',
        keyCare: 'Transplant 21-day old seedlings at shallow depth (2-3 cm). Apply basal DAP and Zinc Sulphate.',
        irrigation: 'Maintain 2 cm standing water for first week, then alternate wetting and drying (AWD).',
        pestRisk: 'Stem borer (dead hearts), thrips in nursery.',
      },
      {
        stageName: 'Panicle Initiation & Booting (35-65 days)',
        duration: '25-30 days',
        keyCare: 'Top dress Nitrogen with Neem coated urea. Leave 30 cm alleyways every 2-3 meters for air circulation.',
        irrigation: 'Maintain 3-5 cm continuous standing water during reproductive stage.',
        pestRisk: 'Leaf folder, Brown Plant Hopper (BPH), blast.',
      },
      {
        stageName: 'Flowering & Milking (65-85 days)',
        duration: '15-20 days',
        keyCare: 'Ensure no moisture stress during anthesis to avoid spikelet sterility.',
        irrigation: 'Saturated soil or shallow water.',
        pestRisk: 'False smut, sheath blight, Gundhi bug (milking stage).',
      },
      {
        stageName: 'Ripening & Harvest (85-115 days)',
        duration: '25-30 days',
        keyCare: 'Drain water completely 7-10 days before harvesting when 80-85% grains turn golden yellow.',
        irrigation: 'Discontinue irrigation.',
        pestRisk: 'Grain discoloration, rat damage, lodging.',
      },
    ],
    nutrientManagement: 'Apply 120:60:40 kg/ha N:P:K. Apply 25 kg/ha Zinc Sulphate. Apply Nitrogen in 3 splits (basal, active tillering, panicle initiation).',
    weedControl: 'Pre-emergence Pretilachlor 50% EC at 2-3 days after transplanting in saturated field, followed by one mechanical cono-weeder pass.',
    harvestingIndicator: 'Grains in lower portion of panicle reach hard dough stage, moisture drops to 20-22%.',
  },
  {
    id: 'crop_cotton',
    name: 'Cotton (Gossypium hirsutum)',
    hindiName: 'कपास (Cotton)',
    kannadaName: 'ಹತ್ತಿ (Cotton)',
    category: 'Cash Crop',
    season: 'Kharif',
    soilType: 'Deep black cotton soil (Vertisols) or fertile alluvial loam, pH 6.5 - 8.5',
    seedRate: '1.5-2.0 kg/acre (Bt hybrid seeds)',
    spacing: '90-120 cm row-to-row × 45-60 cm plant-to-plant',
    stages: [
      {
        stageName: 'Germination & Square Formation (0-45 days)',
        duration: '40-45 days',
        keyCare: 'Thin to one vigorous plant per hill at 15-20 days. Inter-cultivation to keep field porous.',
        irrigation: 'Avoid waterlogging; cotton roots are highly sensitive to standing water.',
        pestRisk: 'Aphids, jassids, thrips on tender leaves.',
      },
      {
        stageName: 'Flowering & Boll Development (45-90 days)',
        duration: '40-50 days',
        keyCare: 'Detop plant terminal at 80-90 days to stimulate sympodial (fruiting) branches. Spray 1% Potassium Nitrate (13:0:45).',
        irrigation: 'Critical irrigation period; water every 10-14 days in dry conditions.',
        pestRisk: 'Pink bollworm, spotted bollworm, whitefly.',
      },
      {
        stageName: 'Boll Bursting & Picking (90-150 days)',
        duration: '40-60 days',
        keyCare: 'Pick fully burst, dry, fluffy bolls in morning hours after dew dries. Store clean and separate stained cotton.',
        irrigation: 'Cease irrigation after 70% boll opening.',
        pestRisk: 'Boll rots if rainfall occurs during bursting.',
      },
    ],
    nutrientManagement: 'Apply 120:60:60 kg/ha N:P:K. Apply Magnesium Sulphate (25 kg/ha) and Boron (5 kg/ha) to prevent red leaf disease (leaf reddening).',
    weedControl: 'Pre-emergence Pendimethalin 30% EC at sowing. Inter-cultivation with bullock/tractor hoe at 30 and 60 days.',
    harvestingIndicator: 'Bolls burst open fully exposing white cotton fibers. Avoid trash or dried bract contamination during picking.',
  },
  {
    id: 'crop_wheat',
    name: 'Wheat (Triticum aestivum)',
    hindiName: 'गेहूं (Wheat)',
    kannadaName: 'ಗೋಧಿ (Wheat)',
    category: 'Cereal',
    season: 'Rabi',
    soilType: 'Well-aerated fertile loamy soil with neutral pH 6.5 - 7.5',
    seedRate: '40-45 kg/acre',
    spacing: '20-22.5 cm between rows, line sowing at 4-5 cm depth',
    stages: [
      {
        stageName: 'Crown Root Initiation (CRI) (18-25 days)',
        duration: '21-25 days',
        keyCare: 'MOST CRITICAL IRRIGATION STAGE. Delaying this irrigation reduces tillering severely.',
        irrigation: 'Light first irrigation at CRI (21 days after sowing).',
        pestRisk: 'Termites in sandy soils, seedling blight.',
      },
      {
        stageName: 'Tillering & Jointing (25-60 days)',
        duration: '35 days',
        keyCare: 'Apply second split of Nitrogen urea prior to second irrigation.',
        irrigation: 'Second irrigation at tillering (40-45 days), third at jointing (60-65 days).',
        pestRisk: 'Aphids, broadleaf weeds.',
      },
      {
        stageName: 'Heading & Flowering (60-85 days)',
        duration: '25 days',
        keyCare: 'Inspect upper flag leaves for yellow stripe rust pustules.',
        irrigation: 'Irrigate at flowering stage (80-85 days); avoid windy days to prevent lodging.',
        pestRisk: 'Yellow rust, loose smut, powdery mildew.',
      },
      {
        stageName: 'Milk, Dough & Ripening (85-120 days)',
        duration: '35 days',
        keyCare: 'Final irrigation at milking/dough stage to ensure plump, heavy grain filling.',
        irrigation: 'Irrigate at 100-105 days if temperatures spike.',
        pestRisk: 'Karnal bunt, heat injury/terminal drought.',
      },
    ],
    nutrientManagement: 'Apply 120:60:40 kg/ha N:P:K. Half Nitrogen + full P & K as basal; remaining half N top-dressed in two equal splits.',
    weedControl: 'Post-emergence Clodinafop-propargyl for Phalaris minor (mandusi) and Metsulfuron-methyl for broadleaf weeds at 30-35 DAS.',
    harvestingIndicator: 'Leaves and spikes turn golden yellow, grains break with a crisp snap sound under teeth (moisture below 12%).',
  },
];
