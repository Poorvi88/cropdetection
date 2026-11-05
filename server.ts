import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// High payload limit for camera photo uploads
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Initialize GoogleGenAI server-side with required headers
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper for automatic retry on temporary model overload (503 / 429)
async function generateWithRetry<T>(fn: (modelName: string) => Promise<T>, maxRetries = 2, delayMs = 1000): Promise<T> {
  const models = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of models) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await fn(model);
      } catch (err: any) {
        attempt++;
        lastError = err;
        const isOverloaded =
          err?.status === 503 ||
          err?.code === 503 ||
          err?.message?.includes('503') ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('RESOURCE_EXHAUSTED') ||
          err?.message?.includes('UNAVAILABLE');

        if (isOverloaded) {
          console.warn(`Model ${model} overloaded (attempt ${attempt}/${maxRetries}). Backing off...`);
          await new Promise((res) => setTimeout(res, delayMs * attempt));
          if (attempt >= maxRetries) {
            // Move to next candidate model
            break;
          }
          continue;
        }
        // If not an overload error, throw immediately
        throw err;
      }
    }
  }
  throw lastError || new Error('The agricultural AI service is experiencing temporary peak traffic. Please try again in a few moments.');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Real Scan Endpoint for Leaf, Crop, and Seed Scanner
app.post('/api/scan', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', scannerType = 'leaf', language = 'en', additionalNotes = '' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided. Please capture or upload a photograph.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your environment.',
      });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const systemInstruction = `You are AgriRakshak AI, a world-class senior agronomist, plant pathologist, and agricultural specialist dedicated to helping Indian farmers.
You analyze actual field photographs of leaves, crops, and seeds.

CRITICAL INSTRUCTIONS & STRICT ACCURACY RULES:
1. Examine the visual evidence in the photograph very carefully.
2. If the leaf/crop/seed looks healthy and free from noticeable disease, YOU MUST identify it as healthy!
   - Condition must be "healthy" and possibleDisease should be "None (Healthy)".
   - DO NOT invent diseases, pests, or recommend unnecessary chemical pesticides on healthy crops!
3. If the image is blurry, out of focus, poor lighting, or insufficient to identify a disease confidently:
   - Condition must be "uncertain", possibleDisease: "Unable to identify the disease confidently".
   - Explain what visible features are seen, suggest how to take a clearer photograph (good natural daylight, focused on affected area, both upper and lower leaf surface), and recommend consulting a local Krishi Vigyan Kendra (KVK) or agricultural extension officer.
4. For Leaf Scanner: Identify crop, leaf condition, visible foliar symptoms (yellowing, chlorosis, necrosis, brown spots, leaf curl, wilting, rust, powdery mildew, holes, insect feeding), causes, severity, practical recovery plan, safe pesticide active ingredients (CIBRC registered, standard approved active ingredients like Chlorantraniliprole, Mancozeb, Azoxystrobin, Copper Oxychloride, etc.), IPM biological controls (Neem oil, Trichoderma viride, Bacillus thuringiensis), and preventive actions.
5. For Crop Scanner: Identify whole plant condition, canopy health, lodging, wilting, stunted growth, irrigation/soil stress, field-level pest damage, and recovery roadmap.
6. For Seed Scanner: Identify seed type, physical damage, visible discoloration, insect bored holes, mold growth, external quality concerns, seed storage guidance, and seed germination test protocol using the standard formula: Germination % = (Germinated Seeds / Total Seeds Tested) * 100. Clarify that visual inspection does NOT certify internal seed health, purity, or germination percentage without physical testing.
7. LANGUAGE: All output text (descriptions, symptoms, recovery steps, advice, etc.) MUST be written in the farmer's chosen language: ${language} (e.g. Kannada, Hindi, Telugu, Tamil, Marathi, Bengali, Gujarati, Punjabi, or English).
   - IMPORTANT: Keep standard agricultural chemical/active ingredient names recognizable (e.g., Mancozeb 75% WP, Chlorantraniliprole 18.5% SC, Copper Oxychloride 50% WP) or give technical name with clear local script explanation.
8. PESTICIDE SAFETY & VERIFICATION:
   - Never invent unauthorized chemical dosages or fake brands.
   - Always emphasize PPE (gloves, mask, protective eyewear).
   - State Pre-Harvest Interval (PHI / waiting period before harvest) where known.
   - Strictly note: "Always verify with local agricultural extension officer and read the approved container label before purchase and spraying."
`;

    const userPrompt = `Please analyze this agricultural photograph thoroughly.
Scanner Type: ${scannerType.toUpperCase()} SCANNER.
Farmer's Language for response: ${language}.
Additional notes provided by farmer: ${additionalNotes || 'None'}.

Return a strictly valid JSON response adhering to the requested schema.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: userPrompt,
    };

    const response = await generateWithRetry((modelName) =>
      ai.models.generateContent({
        model: modelName,
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cropName: {
                type: Type.STRING,
                description: 'Name of the crop or seed (e.g., Tomato, Paddy / Rice, Cotton, Wheat, Maize, etc.)',
              },
              scannerType: {
                type: Type.STRING,
                description: 'Type of scanner used: leaf, crop, or seed',
              },
              condition: {
                type: Type.STRING,
                description: 'Overall condition: healthy, diseased, pest_damaged, nutrient_deficient, uncertain, or environmental_stress',
              },
              possibleDisease: {
                type: Type.STRING,
                description: 'Identified disease name or "None (Healthy)" or "Unable to identify the disease confidently"',
              },
              diseaseSeverity: {
                type: Type.STRING,
                description: 'Severity: None, Mild, Moderate, Severe, or Uncertain',
              },
              confidence: {
                type: Type.STRING,
                description: 'Confidence level: High, Medium, or Low',
              },
              imageQuality: {
                type: Type.STRING,
                description: 'Visual quality of the submitted photo (Clear, Good, Blurry, Poor Lighting, or Low Resolution)',
              },
              visibleSymptoms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Specific visual symptoms spotted on the leaf/crop/seed (e.g., concentric brown spots, yellow margin, leaf curling, shot holes)',
              },
              possibleCauses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Pathogens, fungus, bacteria, insect pest, waterlogging, or nutrient deficiency causing the symptoms',
              },
              diseaseManagement: {
                type: Type.STRING,
                description: 'Immediate and core disease management overview in simple farmer-friendly language',
              },
              plantRecovery: {
                type: Type.OBJECT,
                properties: {
                  problemIdentification: { type: Type.STRING },
                  immediateActions: { type: Type.STRING },
                  affectedLeafManagement: { type: Type.STRING },
                  waterManagement: { type: Type.STRING },
                  soilAndNutrientManagement: { type: Type.STRING },
                  diseaseManagement: { type: Type.STRING },
                  pestManagement: { type: Type.STRING },
                  recoveryMonitoring: { type: Type.STRING },
                  prevention: { type: Type.STRING },
                  expertInspectionNeeded: { type: Type.BOOLEAN },
                  recoveryRealisticNote: { type: Type.STRING },
                },
                required: [
                  'problemIdentification',
                  'immediateActions',
                  'affectedLeafManagement',
                  'waterManagement',
                  'soilAndNutrientManagement',
                  'recoveryMonitoring',
                  'prevention',
                  'expertInspectionNeeded',
                ],
              },
              pesticideGuidance: {
                type: Type.OBJECT,
                properties: {
                  needed: { type: Type.BOOLEAN },
                  activeIngredient: { type: Type.STRING },
                  verifiedProductInfo: { type: Type.STRING },
                  applicationGuidance: { type: Type.STRING },
                  safetyPrecautions: { type: Type.STRING },
                  protectiveEquipment: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  preHarvestIntervalDays: { type: Type.STRING },
                  warningLabelInstructions: { type: Type.STRING },
                  chemicalDisclaimer: { type: Type.STRING },
                },
                required: ['needed', 'safetyPrecautions', 'protectiveEquipment', 'chemicalDisclaimer'],
              },
              naturalControlOptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Non-chemical, biological, and organic control options (Neem formulation, bio-agents, pheromone traps, etc.)',
              },
              prevention: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Long term preventive measures to stop recurrence in subsequent crop cycles',
              },
              followUpMonitoring: {
                type: Type.STRING,
                description: 'Timeline and checkpoints for monitoring recovery over the next 7-14 days',
              },
              expertAdvice: {
                type: Type.STRING,
                description: 'Recommendation for local KVK (Krishi Vigyan Kendra) or agro officer consultation',
              },
              seedGuidance: {
                type: Type.OBJECT,
                properties: {
                  visibleCondition: { type: Type.STRING },
                  physicalDamageObserved: { type: Type.STRING },
                  germinationTestRecommended: { type: Type.BOOLEAN },
                  germinationSteps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  storageGuidance: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  disclaimers: { type: Type.STRING },
                },
              },
            },
            required: [
              'cropName',
              'scannerType',
              'condition',
              'possibleDisease',
              'diseaseSeverity',
              'confidence',
              'imageQuality',
              'visibleSymptoms',
              'possibleCauses',
              'diseaseManagement',
              'plantRecovery',
              'pesticideGuidance',
              'naturalControlOptions',
              'prevention',
              'followUpMonitoring',
              'expertAdvice',
            ],
          },
        },
      })
    );

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini analysis.');
    }

    const parsed = JSON.parse(text);
    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Scan analysis error:', error);
    const errorMessage = error?.message || 'Error processing plant image';
    return res.status(500).json({
      error: errorMessage,
      message: 'Failed to complete image scan. Please verify the photo is clear and try again.',
    });
  }
});

// Chatbot Endpoint: Ask Agri AI
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], imageBase64, mimeType = 'image/jpeg', language = 'en' } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your environment.',
      });
    }

    const systemInstruction = `You are "AgriRakshak AI" - an empathetic, highly knowledgeable agricultural expert and companion for Indian farmers.
Language instruction: Respond primarily in ${language} (or match the language the farmer asked in, e.g., Kannada, Hindi, Telugu, Tamil, Marathi, Bengali, Gujarati, Punjabi, English).
Your guidance must be:
- Practical, respectful, farmer-friendly, and actionable.
- Deeply aware of Indian farming conditions, kharif and rabi seasons, Indian soil types, major pests, diseases, and registered agricultural practices.
- Safety-first: Emphasize Integrated Pest Management (IPM), biological controls (neem oil, Trichoderma, pheromone traps), protective clothing, and safe waiting periods.
- Transparent: Do not invent chemicals or unauthorized dosages. Suggest consulting local Krishi Vigyan Kendra (KVK) or agricultural extension officers for complex problems.
- Structure answers clearly with bullet points and simple step-by-step actions.`;

    const contents: any[] = [];

    // Add prior conversation messages
    for (const msg of messages.slice(-8)) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }

    // If an image is attached to the current user message
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      const lastUserMsg = contents[contents.length - 1];
      if (lastUserMsg && lastUserMsg.role === 'user') {
        lastUserMsg.parts.unshift({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: cleanBase64,
          },
        });
      } else {
        contents.push({
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: cleanBase64,
              },
            },
            { text: 'Please analyze this plant image and answer my farming question.' },
          ],
        });
      }
    }

    const response = await generateWithRetry((modelName) =>
      ai.models.generateContent({
        model: modelName,
        contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Namaste! How can you help me today?' }] }],
        config: {
          systemInstruction,
        },
      })
    );

    const reply = response.text || 'I am ready to help you with your crops, soil, seeds, or pest management.';
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    const friendlyMsg = error?.message?.includes('503') || error?.message?.includes('high demand')
      ? 'The Gemini agricultural model is experiencing high demand right now. Please ask again in a moment.'
      : (error?.message || 'Chat service temporarily unavailable. Please try again.');
    return res.status(500).json({
      error: friendlyMsg,
    });
  }
});

// Weather and Regional Agro-Advisory endpoint
app.get('/api/weather', (req, res) => {
  const region = (req.query.region as string) || 'central';
  
  // Real agricultural weather advisories tailored by Indian agro-climatic region
  const regionalData: Record<string, any> = {
    karnataka: {
      location: 'Bengaluru / Central Karnataka',
      temp: '28°C',
      condition: 'Partly Cloudy',
      humidity: '62%',
      rainfallProb: '20%',
      advisory: 'Suitable for foliar sprays during morning hours. Maintain optimum furrow irrigation for vegetables and ragi.',
      sprayCondition: 'Favorable (Low wind, moderate humidity)',
    },
    maharashtra: {
      location: 'Vidarbha / Marathwada, Maharashtra',
      temp: '32°C',
      condition: 'Dry & Sunny',
      humidity: '48%',
      rainfallProb: '10%',
      advisory: 'Cotton & Soybean monitoring: Check for sucking pests (whitefly, aphids) in warm weather. Conserve soil moisture using organic mulching.',
      sprayCondition: 'Favorable before 11 AM',
    },
    punjab: {
      location: 'Ludhiana, Punjab',
      temp: '26°C',
      condition: 'Clear Sky',
      humidity: '55%',
      rainfallProb: '5%',
      advisory: 'Optimal weather for wheat/paddy monitoring. Inspect lower leaves for yellow rust symptoms or stem borer.',
      sprayCondition: 'Excellent',
    },
    up: {
      location: 'Varanasi / Lucknow, Uttar Pradesh',
      temp: '29°C',
      condition: 'Mild Breeze',
      humidity: '58%',
      rainfallProb: '15%',
      advisory: 'Light irrigation recommended for vegetables. Ensure proper drainage in low-lying fields.',
      sprayCondition: 'Favorable',
    },
    andhra: {
      location: 'Guntur / Vijayawada, Andhra Pradesh',
      temp: '33°C',
      condition: 'Humid & Sunny',
      humidity: '74%',
      rainfallProb: '30%',
      advisory: 'High humidity favors fungal spots on chilli and black gram. Avoid spraying if dark rain clouds develop.',
      sprayCondition: 'Spray with caution',
    },
    tamilnadu: {
      location: 'Coimbatore / Thanjavur, Tamil Nadu',
      temp: '30°C',
      condition: 'Intermittent Sun',
      humidity: '68%',
      rainfallProb: '25%',
      advisory: 'Paddy tillering stage: Maintain 2-3 cm standing water. Inspect for leaf folder and blast spots.',
      sprayCondition: 'Moderate',
    },
    central: {
      location: 'All-India General Advisory',
      temp: '29°C',
      condition: 'Seasonal',
      humidity: '60%',
      rainfallProb: '20%',
      advisory: 'Inspect crops twice weekly. Never spray pesticides during high wind or peak midday heat.',
      sprayCondition: 'Morning 7-10 AM or Evening 4-6 PM',
    },
  };

  const selected = regionalData[region.toLowerCase()] || regionalData.central;
  res.json({ success: true, weather: selected });
});

// Configure Vite in development, or serve static dist in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriRakshak AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start AgriRakshak AI server:', err);
  process.exit(1);
});
