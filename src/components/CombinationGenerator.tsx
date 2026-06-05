/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useSimulateurStore } from "../store/useSimulateurStore";
import { TRANSLATIONS } from "../utils/translations";
import { motion, AnimatePresence } from "motion/react";
import { Sliders, Sparkles, Cpu, ChevronDown, ChevronUp, RefreshCw, BarChart2, Star, CloudLightning, Check, AlertCircle } from "lucide-react";
import MathVortexAnimation from "./MathVortexAnimation";
import Expert3DOrbitCanvas from "./Expert3DOrbitCanvas";

export default function CombinationGenerator() {
  const { 
    lastCombinaison, 
    config, 
    modifierConfig, 
    genererSéquenceOptimale,
    isSynchronizing,
    syncError,
    syncSuccess,
    synchroniserDerniersTirages,
    lang,
    modeExpert,
    setModeExpert
  } = useSimulateurStore();
  
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  const t = TRANSLATIONS[lang];

  const accordionLabels = {
    FR: "Modifier les paramètres (Pondérations / Synergies / Règles)",
    EN: "Modify parameters (Weights & Synergy variables)",
    ES: "Modificar parámetros (Ponderaciones y Sinergias)",
    PT: "Modificar parâmetros (Factores e Sinergias)"
  };

  // Fonction pour déclencher une animation visuelle d'attente lors de la génération
  const handleGenerate = () => {
    setIsGenerating(true);
  };

  const handleAnimationComplete = () => {
    genererSéquenceOptimale();
    setIsGenerating(false);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6" id="combination-generator">
      
      {/* En-tête contrôles & titre */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700 pb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">{t.generatorTitle}</h3>
            <p className="text-xs text-slate-400">{t.generatorSubtitle}</p>
          </div>
        </div>

        <div className="flex gap-2 self-stretch sm:self-auto justify-end flex-wrap">
          {/* Toggle MODE EXPERT */}
          <button
            onClick={() => {
              const nextVal = !modeExpert;
              setModeExpert(nextVal);
              if (nextVal) {
                // Ouvrir automatiquement les paramètres avancés pour que l'UX soit directe !
                setIsSettingsOpen(true);
              }
            }}
            className={`text-xs font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              modeExpert
                ? "bg-blue-600 font-extrabold text-white border-blue-500 shadow-md shadow-blue-500/20"
                : "bg-slate-900/80 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-200"
            }`}
            title="Toggle Expert Mode"
          >
            <Cpu className={`w-3.5 h-3.5 ${modeExpert ? "animate-pulse text-amber-400" : ""}`} />
            <span>{lang === "FR" ? "Mode Expert" : lang === "EN" ? "Expert Mode" : lang === "ES" ? "Modo Experto" : "Modo Expert"}</span>
          </button>

          {/* Bouton de Synchronisation API */}
          <button
            onClick={synchroniserDerniersTirages}
            disabled={isSynchronizing}
            className={`text-xs font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              syncSuccess && !syncError
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold"
                : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-blue-400"
            }`}
            title="API sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSynchronizing ? "animate-spin" : ""}`} />
            {isSynchronizing ? "Sync..." : syncSuccess ? "OK" : "API Sync"}
          </button>

          <button
            onClick={() => {
              modifierConfig({ 
                weightFrequence: 0.5, 
                weightEcart: 0.5, 
                coOccurrenceBonus: 0.6,
                entropyNoise: 0.15,
                distancePenalty: 0.20,
                temperatureScale: 0.50
              });
            }}
            className="text-xs font-mono flex items-center gap-1 text-slate-450 hover:text-blue-400 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-750 transition-all hover:border-slate-600 cursor-pointer"
          >
            {t.reset}
          </button>
        </div>
      </div>

      {/* Alertes de Synchronisation */}
      {(syncError || syncSuccess) && (
        <div className="transition-all animate-fadeIn">
          {syncError ? (
            <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-start gap-2.5 text-xs text-amber-400 leading-relaxed">
              <CloudLightning className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{syncError}</span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-start gap-2.5 text-xs text-emerald-350 leading-relaxed">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-450" />
              <span>Sync Success! Matrix co-occurrence recalculated.</span>
            </div>
          )}
        </div>
      )}

      {/* Accordéon réglages fermé par défaut */}
      <div className="border border-slate-700 bg-slate-900/40 rounded-xl overflow-hidden transition-all duration-300">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-full flex items-center justify-between p-4 text-xs font-bold text-slate-200 hover:bg-slate-800/60 transition-all cursor-pointer font-mono"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span className="text-left leading-normal">{accordionLabels[lang] || accordionLabels.FR}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
              {isSettingsOpen ? (lang === "FR" ? "Masquer" : "Hide") : (lang === "FR" ? "Afficher" : "Show")}
            </span>
            {isSettingsOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-450" />
            )}
          </div>
        </button>

        {isSettingsOpen && (
          <div className="p-4 border-t border-slate-700/60 bg-slate-950/20 space-y-5 animate-slideDown">
            {/* Sliders Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
              
              {/* Curseur de Fréquence */}
              <div className="space-y-2.5 bg-slate-900/40 p-4 border border-slate-700/60 rounded-xl" id="slider-frequency">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    📊 {t.weightFreq}
                  </span>
                  <span className="font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">
                    {config.weightFrequence.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.weightFreqDesc}
                </p>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.weightFrequence}
                  onChange={(e) => modifierConfig({ weightFrequence: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Curseur d'Écart */}
              <div className="space-y-2.5 bg-slate-900/40 p-4 border border-slate-700/60 rounded-xl" id="slider-gap">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    ⏳ {t.weightEcart}
                  </span>
                  <span className="font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">
                    {config.weightEcart.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.weightEcartDesc}
                </p>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={config.weightEcart}
                  onChange={(e) => modifierConfig({ weightEcart: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Curseur de Synergie (Co-occurrence) */}
              <div className="space-y-2.5 bg-slate-900/40 p-4 border border-slate-700/60 rounded-xl" id="slider-synergy">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    🔗 {t.weightCooccur}
                  </span>
                  <span className="font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">
                    {(1.0 + config.coOccurrenceBonus).toFixed(1)}x
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.weightCooccurDesc}
                </p>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={config.coOccurrenceBonus}
                  onChange={(e) => modifierConfig({ coOccurrenceBonus: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

            </div>

            {/* Paramètres EXPERT supplémentaires */}
            {modeExpert && (
              <div className="border-t border-slate-700/40 pt-4 space-y-4 animate-fadeIn" id="expert-stochastic-panel">
                <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[11px] font-bold uppercase tracking-widest">
                  <Cpu className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
                  <span>{lang === "FR" ? "Paramètres Avancés Stochastiques" : "Advanced Stochastic Parameters"}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Calibration d'Entropie */}
                  <div className="space-y-2.5 bg-slate-900/45 p-4 border border-blue-500/10 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1">
                        🎯 {lang === "FR" ? "Indice de Température / Calibrage" : lang === "EN" ? "Entropy Calibration" : "Calibración de Entropía"}
                      </span>
                      <span className="font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">
                        {config.temperatureScale !== undefined ? config.temperatureScale.toFixed(2) : "0.50"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {lang === "FR" ? "Proche de 0 concentre la sélection sur les favoris récents, proche de 1 distribue la probabilité équitablement."
                       : lang === "EN" ? "Close to 0 focuses on heavy favorites; close to 1 flattens probability curve."
                       : "Cerca de 0 concentra en favoritos; cerca de 1 aplasta el perfil de probabilidad."}
                    </p>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={config.temperatureScale !== undefined ? config.temperatureScale : 0.50}
                      onChange={(e) => modifierConfig({ temperatureScale: parseFloat(e.target.value) })}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Bruit Micro-stochastique */}
                  <div className="space-y-2.5 bg-slate-900/45 p-4 border border-blue-500/10 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1">
                        🌀 {lang === "FR" ? "Bruit Micro-stochastique" : lang === "EN" ? "Stochastic Noise" : "Ruido Estocástico"}
                      </span>
                      <span className="font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">
                        {config.entropyNoise !== undefined ? `${(config.entropyNoise * 100).toFixed(0)}%` : "15%"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {lang === "FR" ? "Limite la rigidité du tirage en ajoutant de petites fluctuations thermiques aléatoires aux poids."
                       : lang === "EN" ? "Prevents hard bias by feeding microscopic thermal volatility directly into computation weights."
                       : "Impide sesgo duro inyectando volatilidad térmica microscópica en los pesos."}
                    </p>
                    <input
                      type="range"
                      min="0.0"
                      max="0.5"
                      step="0.05"
                      value={config.entropyNoise !== undefined ? config.entropyNoise : 0.15}
                      onChange={(e) => modifierConfig({ entropyNoise: parseFloat(e.target.value) })}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Pénalité de Proximité Adjacente */}
                  <div className="space-y-2.5 bg-slate-900/45 p-4 border border-blue-500/10 rounded-xl">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1">
                        🛡 {lang === "FR" ? "Pénalité de Proximité" : lang === "EN" ? "Adjacency Penalty" : "Penalización Vecina"}
                      </span>
                      <span className="font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[11px] font-bold">
                        {config.distancePenalty !== undefined ? `${(config.distancePenalty * 100).toFixed(0)}%` : "20%"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {lang === "FR" ? "Décourage l'apparition de numéros adjacents (ex: évite de tirer 14 et 15 ensemble) pour garder le tri espacé."
                       : lang === "EN" ? "Dampens weights of consecutive neighbors (like 14 and 15 side-by-side) to ensure realistic draw gaps."
                       : "Reduce los pesos de vecinos consecutivos (ej. evita 14 y 15 juntos) para asegurar un espaciado realista."}
                    </p>
                    <input
                      type="range"
                      min="0.0"
                      max="0.8"
                      step="0.05"
                      value={config.distancePenalty !== undefined ? config.distancePenalty : 0.20}
                      onChange={(e) => modifierConfig({ distancePenalty: parseFloat(e.target.value) })}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* Paramètres additionnels de la charte de qualité */}
            <div className="bg-slate-900/20 p-4 border border-slate-700/50 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-xs text-slate-400">
              <div>
                <span className="font-bold text-slate-300 block mb-0.5">⚙️ Parameters {modeExpert && <span className="text-blue-400 font-mono font-black text-[10px] ml-1 bg-blue-500/10 border border-blue-500/25 px-1.5 py-0.5 rounded">EXPERT ACTIVE</span>}</span>
                <p className="text-[11px] text-slate-450">Advanced stochastic constraints.</p>
              </div>
              <div className="flex gap-4 shrink-0 font-mono text-[11px]">
                <span className="text-blue-400">✔ Pair/Impair OK</span>
                <span className="text-emerald-400">✔ Tri Strict OK</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bouton d'action central */}
      <div className="text-center pt-2">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="relative inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer text-xs uppercase tracking-wider w-full sm:w-auto animate-pulse hover:animate-none"
          id="btn-trigger-generation"
        >
          {isGenerating ? (
            <>
              <Cpu className="w-5 h-5 animate-spin text-white/85" />
              <span>{t.simulating}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-blue-200" />
              <span>{t.generateBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Affichage des Résultats de Génération */}
      <div className="bg-slate-900/50 rounded-2xl p-6 sm:p-8 border border-slate-700 flex flex-col items-center justify-center space-y-6 relative overflow-hidden min-h-[220px]">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating-spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="flex space-x-2">
                <div className="w-3.5 h-3.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-3.5 h-3.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full animate-bounce" />
              </div>
              <p className="text-slate-400 text-xs font-mono">{t.simulating}</p>
            </motion.div>
          ) : lastCombinaison ? (
            <motion.div
              key="combinaison-realisee"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center space-y-6"
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] text-blue-400 font-mono tracking-widest font-bold uppercase bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  {t.generatedSequence}
                </span>
                <p className="text-xs text-slate-400 pt-1.5">{t.evenOddTitle} | {t.theoreticalEntropy}</p>
              </div>

              {/* Les Balles de l'EuroMillions - Column stack on mobile to avoid layout overlap */}
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-6 py-2">
                
                {/* 5 Numéros (Balles bleus élégantes) */}
                {lastCombinaison.numeros.map((num, i) => (
                  <motion.div
                    key={`num-${num}`}
                    initial={{ scale: 0, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 160, damping: 11, delay: i * 0.08 }}
                    className="flex flex-col items-center gap-2 shrink-0"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-blue-550 to-blue-700 border-2 border-white/20 flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform cursor-help group relative">
                      <span className="text-lg sm:text-2xl font-black font-sans text-white tracking-tighter select-none">
                        {num < 10 ? `0${num}` : num}
                      </span>
                    </div>
                    {lastCombinaison.poidsInitiaux[num] !== undefined && (
                      <span className="bg-slate-900 border border-slate-700/60 rounded px-1.5 py-0.5 text-[9px] sm:text-[10px] text-slate-350 font-mono shadow-inner font-bold select-none">
                        p={lastCombinaison.poidsInitiaux[num].toFixed(2)}
                      </span>
                    )}
                  </motion.div>
                ))}

                {/* Séparateur minimaliste */}
                <span className="text-slate-600 text-lg sm:text-2xl font-bold font-mono px-1 self-start pt-2.5 sm:pt-4">/</span>

                {/* 2 Étoiles (Lucky Stars dorées) */}
                {lastCombinaison.etoiles.map((star, i) => (
                  <motion.div
                    key={`star-${star}`}
                    initial={{ scale: 0, rotate: -35 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 10, delay: 0.45 + i * 0.1 }}
                    className="flex flex-col items-center gap-2 shrink-0"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-white/20 flex flex-col items-center justify-center shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform cursor-help relative">
                      <Star className="w-3.5 h-3.5 text-amber-100 fill-amber-100" />
                      <span className="text-base sm:text-xl font-extrabold font-mono text-amber-955 -mt-0.5 select-none leading-none">
                        {star < 10 ? `0${star}` : star}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-amber-400 font-mono opacity-85 px-1.5 py-0.5 bg-amber-950/20 border border-amber-900/10 rounded font-bold select-none">
                      ★ {lang === "FR" ? "Étoile" : "Star"}
                    </span>
                  </motion.div>
                ))}

              </div>

              {/* Explanatory debugger panel activator */}
              <div className="w-full border-t border-slate-800 pt-4 flex flex-col items-center">
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline transition-all bg-blue-500/5 hover:bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/10 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  {showExplanation ? t.close : t.drawDetails}
                  {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {/* Explications Étape par Étape */}
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="w-full mt-4 text-left bg-slate-950 rounded-xl p-4 border border-blue-900/30 overflow-hidden"
                  >
                    <h4 className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5 text-blue-400" /> {t.drawDetailsDesc}
                    </h4>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {lastCombinaison.analysePoids.map((log, idx) => {
                        const isHighlight = log.includes("↗️") || log.includes("Tirage") || log.includes("Draw");
                        return (
                          <div
                            key={idx}
                            className={`text-[10px] font-mono leading-relaxed p-1.5 rounded transition-all ${
                              isHighlight
                                ? "bg-blue-950/40 text-blue-300 border-l-2 border-blue-500 pl-2.5"
                                : "text-slate-400"
                            }`}
                          >
                            {log}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>

            </motion.div>
          ) : (
            <div className="text-center py-6 space-y-3" id="blank-generator-state">
              <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto">
                <BarChart2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-400 font-medium">Reset state. Adjust config and tap Generate.</p>
            </div>
          )}
        </AnimatePresence>

      </div>

      {/* Rendu dynamique de la Topologie Céleste 3D en Mode Expert */}
      {modeExpert && (
        <div className="pt-2">
          <Expert3DOrbitCanvas />
        </div>
      )}

      {/* Animation 3D de calcul stochastique innovant */}
      <AnimatePresence>
        {isGenerating && (
          <MathVortexAnimation onComplete={handleAnimationComplete} />
        )}
      </AnimatePresence>

    </div>
  );
}
