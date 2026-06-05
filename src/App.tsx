/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import StatsDashboard from "./components/StatsDashboard";
import CombinationGenerator from "./components/CombinationGenerator";
import HistoryPanel from "./components/HistoryPanel";
import CoOccurrenceMatrixWidget from "./components/CoOccurrenceMatrixWidget";
import BacktestingPanel from "./components/BacktestingPanel";
import MarketingModal from "./components/MarketingModal";
import LanguageSelector from "./components/LanguageSelector";
import { useSimulateurStore } from "./store/useSimulateurStore";
import { TRANSLATIONS } from "./utils/translations";
import { Cpu, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

export default function App() {
  const { genererSéquenceOptimale, lang } = useSimulateurStore();
  const t = TRANSLATIONS[lang];

  // Générer une première séquence au chargement pour donner immédiatement un contenu à consommer
  useEffect(() => {
    genererSéquenceOptimale();
  }, [genererSéquenceOptimale]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans transition-colors duration-300" id="main-app-container">
      
      {/* Welcome Marketing Popup */}
      <MarketingModal />
      
      {/* Premium Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 shadow-md shadow-blue-600/20">
              <span className="text-white font-black text-xl tracking-tighter select-none">€</span>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white uppercase sm:text-xl">
                  Euro<span className="text-blue-400">Maths</span>
                </h1>
                <span className="text-[10px] bg-blue-550/10 text-blue-400 border border-blue-550/20 px-2 py-0.5 rounded font-bold font-mono">
                  {t.engineTitle}
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.headerSlogan}</p>
            </div>
          </div>

          {/* Language selector and quick stats */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 justify-end">
            <LanguageSelector />
            
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span className="text-slate-300">{t.activeAlgo}</span>
            </div>
            <div className="text-[11px] text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              Statistiques : <span className="text-blue-400 font-bold">{t.statsSync}</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Explanatory */}
        <div className="bg-gradient-to-r from-blue-950/20 via-slate-900 to-blue-950/10 border border-blue-900/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm" id="welcome-message-banner">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              {t.introTitle}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
              {t.introDesc}
            </p>
          </div>
          <a
            href="#combination-generator"
            className="text-[11px] text-blue-400 hover:text-blue-300 font-mono font-bold hover:underline py-1.5 px-3.5 whitespace-nowrap shrink-0 inline-block bg-blue-500/10 rounded-lg border border-blue-500/20"
          >
            {t.adjustModel}
          </a>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne Principale 2/3 (Configuration + Génération + Statistiques) */}
          <div className="lg:col-span-2 space-y-8" id="primary-visual-column">
            
            {/* 1. Générateur & Sliders */}
            <CombinationGenerator />

            {/* 2. Matrice de co-occurrence Interactive */}
            <CoOccurrenceMatrixWidget />

            {/* 2.5 Rétro-stats & Backtesting simulation panel */}
            <BacktestingPanel />

            {/* 3. Analyse Graphique des Tendances */}
            <StatsDashboard />

          </div>

          {/* Colonne Secondaire 1/3 (Historique des Tirages + Aide) */}
          <div className="space-y-8" id="secondary-data-column">
            
            {/* 3. Panel Historique de Tirages */}
            <HistoryPanel />

            {/* 4. Widget d'aide / Notice informative */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg text-xs text-slate-400" id="gambling-warning-widget">
              <h3 className="font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <HelpCircle className="w-4.5 h-4.5 text-blue-400" />
                {t.warningTitle}
              </h3>
              <ul className="space-y-3 pl-1">
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold shrink-0 font-mono">1.</span>
                  <span>
                    {t.warningPoint1}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold shrink-0 font-mono">2.</span>
                  <span>
                    {t.warningPoint2}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-400 font-bold shrink-0 font-mono">3.</span>
                  <span>
                    {t.warningPoint3}
                  </span>
                </li>
              </ul>
              <div className="p-3 bg-slate-900 border border-red-500/15 text-[11px] text-red-400 rounded-xl flex items-start gap-2 leading-relaxed" id="gambling-alert">
                <ShieldAlert className="w-4.5 h-4.5 mt-0.5 shrink-0 text-red-500" />
                <span>
                  <strong>{t.preventionTitle}</strong> {t.preventionDesc}
                </span>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Corporate Footnote */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-mono text-slate-400">{t.footerCopyright}</p>
          <p className="text-[10px] text-slate-500">
            {t.footerSlogan}
          </p>
        </div>
      </footer>

    </div>
  );
}
