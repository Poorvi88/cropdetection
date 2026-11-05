# AgriRakshak AI 🌾

> **Smart Farming. Healthy Crops. Better Future.**  
> AI-powered multilingual agricultural assistant for Indian farmers with leaf, crop, and seed disease diagnosis.

---

## 🌟 Overview

AgriRakshak AI is a full-stack agricultural decision support platform engineered specifically for Indian farmers. Powered by Google Gemini 3.8 Multimodal Vision, it provides instant, accurate foliar disease detection, whole-crop canopy evaluation, seed viability inspection, and safe pesticide guidance aligned with Indian Central Insecticides Board & Registration Committee (CIBRC) regulations and Indian Council of Agricultural Research (ICAR) practices.

---

## 🚀 Key Features

1. **Leaf Disease Scanner**:
   - Analyzes real high-resolution leaf photographs for blights, rusts, powdery mildew, yellowing, leaf curl virus, and shot holes.
   - **Healthy Leaf Recognition**: Leaves that exhibit no visible symptoms are clearly classified as healthy—no hallucinated diseases or unnecessary pesticide recommendations.
   - **Uncertainty Feedback**: For low-clarity images, provides advice on taking clearer photos and consulting local Krishi Vigyan Kendra (KVK) officers.

2. **Whole Crop Scanner**:
   - Analyzes canopy health, lodging, wilting, stalk rot, and field-wide pest infestations.

3. **Seed Quality & Germination Scanner**:
   - Evaluates grain appearance, physical discoloration, weevil damage, and visible mold.
   - Features an interactive **Seed Germination Calculator** implementing the official formula:  
     $$\text{Germination } \% = \left(\frac{\text{Germinated Seeds}}{\text{Total Seeds Tested}}\right) \times 100$$
   - Provides 7-step ragdoll/gunny bag testing procedures and scientific seed storage protocols.

4. **Plant Recovery & Disease Management**:
   - 9-point structured recovery roadmap:
     - Problem Identification
     - Immediate Actions
     - Affected Leaf Management (pruning infected leaves vs. preserving healthy foliage)
     - Water & Irrigation Management
     - Soil & Nutrient Management
     - Disease/Pest Management
     - Recovery Monitoring Timeline
     - Prevention & Cultural Control
     - Realistic Recovery Assessment & Expert Consultation

5. **Safe Pesticide & IPM Advisor**:
   - Real database of verified active ingredients (Mancozeb, Chlorantraniliprole, Azoxystrobin, Tricyclazole, Propiconazole, Neem Oil 1500ppm, Trichoderma harzianum, etc.).
   - Mandatory Pre-Harvest Interval (PHI) waiting period and Personal Protective Equipment (PPE) checklists.
   - 5-Pillar Integrated Pest Management (Scouting, Cultural, Mechanical, Biological, Chemical as last resort).

6. **Ask Agri AI (Multilingual Chatbot & Voice Assistant)**:
   - Voice speech-to-text input via microphone.
   - Audio read-aloud (Text-to-Speech) in Indian languages.
   - Image attachment support for in-depth agronomy Q&A.

7. **Farmer Dashboard**:
   - Offline-first local storage and Supabase cloud sync ready.
   - Printable / Downloadable official diagnosis reports to share with agricultural officers or agrochemical retailers.

8. **Multilingual Support (10 Languages)**:
   - English, Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Telugu (తెలుగు), Tamil (தமிழ்), Malayalam (മലയാളം), Marathi (मराठी), Bengali (বাংলা), Gujarati (ગુજરાતી), and Punjabi (ਪੰਜਾਬੀ).
   - Instant quick-switch toggles for Kannada and Hindi.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, HTML5 MediaStream Camera API, Web Speech API (STT & TTS)
- **Backend**: Node.js, Express, Google GenAI SDK (`@google/genai` v2.32+), Vite SPA middleware
- **AI Model**: Google Gemini 3.8 Flash (`gemini-3.8-flash`)

---

## 💻 Local Setup & Development

### 1. Prerequisites
- Node.js 20+ (tested on Node v22)
- Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Installation
```bash
git clone https://github.com/your-username/AgriRakshak-AI.git
cd AgriRakshak-AI
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Android APK Build Instructions (Using Capacitor)

AgriRakshak AI is built with responsive mobile layouts and standard web camera APIs compatible with Capacitor:

### Step 1: Install Capacitor in the project
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/camera
npx cap init "AgriRakshak AI" "com.agrirakshak.app" --web-dir "dist"
```

### Step 2: Build the web production assets
```bash
npm run build
```

### Step 3: Add the Android platform
```bash
npx cap add android
```

### Step 4: Configure Android Permissions
Ensure `android/app/src/main/AndroidManifest.xml` includes camera and microphone permissions inside `<manifest>`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
```

### Step 5: Sync and Build APK in Android Studio
```bash
npx cap sync android
npx cap open android
```
In Android Studio:
1. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. The generated APK will be available in `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 📤 How to Upload to GitHub

1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of AgriRakshak AI"
   ```
2. Create a new repository on GitHub (e.g. `AgriRakshak-AI`).
3. Push to your repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/AgriRakshak-AI.git
   git push -u origin main
   ```
   *(Ensure `.env` containing your secret `GEMINI_API_KEY` is never committed; `.gitignore` already ignores all `.env*` files).*

---

## ⚠️ Agricultural & Safety Disclaimer
*AgriRakshak AI visual diagnosis and agronomic recommendations are provided for advisory assistance. Always verify diagnoses with your local Krishi Vigyan Kendra (KVK) or State Agricultural Extension Officer. Farmers must strictly follow the approved physical container labels for all chemical dosages, personal protective equipment (PPE), and pre-harvest intervals.*
