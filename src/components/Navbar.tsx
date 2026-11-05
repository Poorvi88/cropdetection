import React, { useState } from 'react';
import {
  Sprout,
  Globe,
  Menu,
  X,
  Camera,
  Layers,
  ShieldAlert,
  MessageSquare,
  LayoutDashboard,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, translations } from '../i18n/translations';

interface NavbarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  language,
  onLanguageChange,
}) => {
  const t = translations[language];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.navHome, icon: Sprout },
    { id: 'leaf', label: t.navLeaf, icon: Camera },
    { id: 'crop', label: t.navCrop, icon: Sprout },
    { id: 'seed', label: t.navSeed, icon: Layers },
    { id: 'pesticides', label: t.navPesticides, icon: ShieldAlert },
    { id: 'ask-ai', label: t.navAskAI, icon: MessageSquare },
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'how-it-works', label: t.navHowItWorks, icon: HelpCircle },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-xs">
      {/* Top Agricultural Bar with Language Quick Switch */}
      <div className="bg-emerald-800 text-white text-[11px] sm:text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wide">AgriRakshak AI</span>
            <span className="hidden sm:inline opacity-70">|</span>
            <span className="hidden sm:inline opacity-90 text-[11px]">
              {t.tagline}
            </span>
          </div>

          {/* Quick Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="opacity-80 hidden md:inline text-[11px]">Language / ಭಾಷೆ / भाषा:</span>
            
            {/* Quick button for Kannada */}
            <button
              type="button"
              onClick={() => onLanguageChange('kn')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                language === 'kn'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-emerald-100'
              }`}
            >
              ಕನ್ನಡ
            </button>

            {/* Quick button for Hindi */}
            <button
              type="button"
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                language === 'hi'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-emerald-100'
              }`}
            >
              हिन्दी
            </button>

            {/* Quick button for English */}
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                language === 'en'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-emerald-100'
              }`}
            >
              English
            </button>

            {/* All Languages Dropdown */}
            <div className="relative flex items-center ml-1">
              <Globe className="w-3.5 h-3.5 mr-1 text-emerald-300" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="bg-emerald-900 text-white text-[11px] font-semibold rounded px-1.5 py-0.5 border border-emerald-700 focus:outline-hidden"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeLabel} ({lang.label})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-green-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black text-emerald-950 tracking-tight block leading-tight">
              AgriRakshak <span className="text-emerald-600">AI</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              Smart Indian Farming
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isCurrent = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold text-left transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
