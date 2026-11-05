import React, { useState } from 'react';
import { LanguageCode, ScannerType } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ScannerView } from './components/ScannerView';
import { PesticideAdvisor } from './components/PesticideAdvisor';
import { AgriChat } from './components/AgriChat';
import { FarmerDashboard } from './components/FarmerDashboard';
import { CropManagement } from './components/CropManagement';
import { SeedGerminationCalculator } from './components/SeedGerminationCalculator';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';

export default function App() {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [activeScannerType, setActiveScannerType] = useState<ScannerType>('leaf');
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string>('');
  const [chatInitialImage, setChatInitialImage] = useState<string | undefined>(undefined);
  const [pesticideFilter, setPesticideFilter] = useState<string>('');

  const handleNavigate = (section: string) => {
    if (section === 'leaf' || section === 'crop' || section === 'seed') {
      setActiveScannerType(section as ScannerType);
      setCurrentSection('scanner');
    } else {
      setCurrentSection(section);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToChat = (question?: string, image?: string) => {
    setChatInitialQuestion(question || '');
    setChatInitialImage(image);
    setCurrentSection('ask-ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToPesticides = (crop?: string) => {
    setPesticideFilter(crop || '');
    setCurrentSection('pesticides');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navigation */}
      <Navbar
        currentSection={
          currentSection === 'scanner' ? activeScannerType : currentSection
        }
        onNavigate={handleNavigate}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentSection === 'home' && (
          <Hero language={language} onNavigate={handleNavigate} />
        )}

        {currentSection === 'scanner' && (
          <ScannerView
            scannerType={activeScannerType}
            onSelectScannerType={(type) => setActiveScannerType(type)}
            language={language}
            onNavigateToChat={handleNavigateToChat}
            onNavigateToPesticides={handleNavigateToPesticides}
            onNavigateToSeedCalc={() => handleNavigate('seed-calc')}
          />
        )}

        {currentSection === 'pesticides' && (
          <PesticideAdvisor
            language={language}
            initialCropFilter={pesticideFilter}
          />
        )}

        {currentSection === 'ask-ai' && (
          <AgriChat
            language={language}
            initialQuestion={chatInitialQuestion}
            initialImage={chatInitialImage}
          />
        )}

        {currentSection === 'dashboard' && (
          <FarmerDashboard
            language={language}
            onNavigateToScan={() => handleNavigate('leaf')}
          />
        )}

        {currentSection === 'crop-guide' && (
          <CropManagement language={language} />
        )}

        {currentSection === 'seed-calc' && (
          <SeedGerminationCalculator language={language} />
        )}

        {currentSection === 'how-it-works' && (
          <HowItWorks
            language={language}
            onStartScanning={() => handleNavigate('leaf')}
            onOpenChat={() => handleNavigate('ask-ai')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer language={language} onNavigate={handleNavigate} />
    </div>
  );
}
