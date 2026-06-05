/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useSimulateurStore } from "../store/useSimulateurStore";
import { TRANSLATIONS } from "../utils/translations";
import { motion, AnimatePresence } from "motion/react";
import { Star, ShieldAlert, BadgeCheck, BarChart3, HelpCircle, RefreshCw, X, Heart, Sparkles } from "lucide-react";

interface EvaluerNumerosFetichesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EvaluerNumerosFetiches({ isOpen, onClose }: EvaluerNumerosFetichesProps) {
  const { tirages, statistiques, lang } = useSimulateurStore();
  const t = TRANSLATIONS[lang];

  // Sélection utilisateur
  const [selectedNums, setSelectedNums] = useState<number[]>([]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // Traduction interne
  const loc = {
    title: lang === "FR" ? "Évaluer vos numéros fétiches" : "Evaluate your favorite numbers",
    subtitle: lang === "FR" ? "Projetez votre grille personnelle sur l'espace stochastique réel" : "Project your personal draw grid onto the actual stochastic space",
    numbersTab: lang === "FR" ? "Sélectionnez 5 numéros (1-50)" : "Select 5 numbers (1-50)",
    starsTab: lang === "FR" ? "Sélectionnez 2 étoiles (1-12)" : "Select 2 stars (1-12)",
    validationError: lang === "FR" ? "Veuillez sélectionner exactement 5 numéros et 2 étoiles." : "Please select exactly 5 numbers and 2 stars.",
    auditBtn: lang === "FR" ? "Démarrer l'audit quantique" : "Start Quantum Audit",
    auditingText: lang === "FR" ? "Analyse matricielle en cours..." : "Analyzing matrix...",
    restartBtn: lang === "FR" ? "Réévaluer un autre tirage" : "Evaluate another draw",
    closeBtn: lang === "FR" ? "Fermer" : "Close",
    scoreLabel: lang === "FR" ? "Score de Synergie Harmonique" : "Harmonic Synergy Score",
    parityLabel: lang === "FR" ? "Équilibre Pair / Impair" : "Even / Odd Balance",
    frequencyLabel: lang === "FR" ? "Force d'Attraction (Fréquence)" : "Attraction Force (Frequency)",
    consecLabel: lang === "FR" ? "Note de Dispersion Spatiale" : "Spatial Dispersion Score",
    historicalLabel: lang === "FR" ? "Rétrosimulation Historique" : "Historical Backtest Sim",
    historicalDesc: lang === "FR" ? "Nombre d'affinités trouvées avec la base de données de 2016 à aujourd'hui :" : "Affinity counts across the live archives from 2016 to date:",
    matchCountLabel: lang === "FR" ? "matchs à" : "matches with",
    aiAdviceTitle: lang === "FR" ? "Conseil de l'IA Biographe EuroMaths" : "EuroMaths AI Biographer Advice",
    clearSelection: lang === "FR" ? "Effacer" : "Clear",
  };

  const handleNumClick = (num: number) => {
    if (selectedNums.includes(num)) {
      setSelectedNums(selectedNums.filter((n) => n !== num));
      setAuditResult(null);
    } else if (selectedNums.length < 5) {
      setSelectedNums([...selectedNums, num].sort((a, b) => a - b));
      setAuditResult(null);
    }
  };

  const handleStarClick = (star: number) => {
    if (selectedStars.includes(star)) {
      setSelectedStars(selectedStars.filter((n) => n !== star));
      setAuditResult(null);
    } else if (selectedStars.length < 2) {
      setSelectedStars([...selectedStars, star].sort((a, b) => a - b));
      setAuditResult(null);
    }
  };

  const clearGrid = () => {
    setSelectedNums([]);
    setSelectedStars([]);
    setAuditResult(null);
  };

  // Lancer l'évaluation stochastique rigoureuse
  const runStochasticAudit = () => {
    if (selectedNums.length !== 5 || selectedStars.length !== 2) return;

    setIsAuditing(true);

    setTimeout(() => {
      // 1. Calcul de la parité
      const evens = selectedNums.filter((n) => n % 2 === 0).length;
      const odds = 5 - evens;
      const parityBalance = `${evens}P - ${odds}I`;
      // Bonus si on est à 3/2 ou 2/3 (équilibré)
      const parityScore = (evens === 2 || evens === 3) ? 100 : (evens === 1 || evens === 4) ? 60 : 30;

      // 2. Calcul de la Dispersion Spatiale (évite les nombres trop consécutifs)
      let consecutiveGapsCount = 0;
      for (let i = 0; i < selectedNums.length - 1; i++) {
        if (selectedNums[i + 1] - selectedNums[i] === 1) {
          consecutiveGapsCount++;
        }
      }
      const spatialScore = Math.max(100 - consecutiveGapsCount * 35, 10);

      // 3. Calcul de la Fréquence Historique Combinée
      let totalFreqSum = 0;
      selectedNums.forEach((n) => {
        const count = statistiques.frequenceNumeros[n] || 0;
        totalFreqSum += count;
      });
      selectedStars.forEach((s) => {
        const count = statistiques.frequenceEtoiles[s] || 0;
        totalFreqSum += count * 2; // Pondération étoile
      });

      // Normalisation grossière pour de la réactivité
      const freqScorePercent = Math.min(Math.max(Math.round((totalFreqSum / 120) * 100), 40), 98);

      // 4. Calcul de l'indice de co-occurrence de la combinaison choisie
      // On scanne les tirages réels pour voir si les paires se fréquentent
      let totalPairMatches = 0;
      let combinationDrawPairsCount = 0;

      for (let i = 0; i < selectedNums.length; i++) {
        for (let j = i + 1; j < selectedNums.length; j++) {
          combinationDrawPairsCount++;
          const n1 = selectedNums[i];
          const n2 = selectedNums[j];
          
          // Compter combien de fois cette paire {n1, n2} est sortie ensemble historiquement
          tirages.forEach((t) => {
            if (t.numeros.includes(n1) && t.numeros.includes(n2)) {
              totalPairMatches++;
            }
          });
        }
      }

      // Moyenne de fois qu'une paire de cette combinaison est sortie ensemble
      const avgPairFrequency = combinationDrawPairsCount > 0 ? (totalPairMatches / combinationDrawPairsCount) : 0;
      const synergyScore = Math.min(Math.max(Math.round(avgPairFrequency * 8 + 35), 20), 99);

      // 5. Comparaison avec tous les tirages réels d'époque (backtest)
      let matches5 = 0;
      let matches4 = 0;
      let matches3 = 0;
      let matches2 = 0;

      tirages.forEach((t) => {
        let nMatches = 0;
        let sMatches = 0;

        selectedNums.forEach((n) => {
          if (t.numeros.includes(n)) nMatches++;
        });
        selectedStars.forEach((s) => {
          if (t.etoiles.includes(s)) sMatches++;
        });

        if (nMatches === 5 && sMatches === 2) matches5++;
        else if (nMatches === 4) matches4++;
        else if (nMatches === 3) matches3++;
        else if (nMatches === 2) matches2++;
      });

      // 6. Score Global d'Harmonie Stochastique
      const globalHarmonicScore = Math.round((parityScore * 0.2) + (spatialScore * 0.25) + (freqScorePercent * 0.25) + (synergyScore * 0.3));

      // 7. Génération du conseil IA Biographe personalisé en français/anglais
      let adviceText = "";
      if (lang === "FR") {
        if (globalHarmonicScore >= 80) {
          adviceText = "Excellente synergie de constellation ! Votre grille respecte à la perfection la dispersion spatiale de Shannon et l'inertie thermodynamique des co-occurrences d'époque. L'entropie est calibrée de manière optimale.";
        } else if (globalHarmonicScore >= 60) {
          adviceText = "Cette combinaison possède un excellent équilibre, mais contient des zones froides ou des manques d'attraction locale. Considérez de réorienter un numéro pour capter un coefficient de synergie supérieur dans notre Matrice de Co-occurrence.";
        } else {
          adviceText = "Alerte de surchauffe : déséquilibre stochastique majeur détecté. Vos numéros sont soit trop resserrés géométriquement, soit issus d'une parité asymétrique aberrante (ex: que des impairs). Nous vous conseillons d'espacer vos choix.";
        }
      } else {
        if (globalHarmonicScore >= 80) {
          adviceText = "Superb constellation synergy! Your grid perfectly respects Shannon's spatial dispersion principles and historical thermodynamic co-occurrences. Clear and optimal balancing.";
        } else if (globalHarmonicScore >= 60) {
          adviceText = "This combination offers good overall balance, but suffers from isolated clusters or low local frequency. Consider adjusting a node to benefit from stronger co-occurrence couplings.";
        } else {
          adviceText = "Thermodynamic warning: significant stochastic asymmetry on your selection. Numbers are either too dense or show strong parity imbalance. We recommend spacing out your orbital nodes.";
        }
      }

      setAuditResult({
        globalScore: globalHarmonicScore,
        parity: parityBalance,
        parityScore,
        spatialScore,
        freqScore: freqScorePercent,
        synergyScore,
        consecutives: consecutiveGapsCount,
        matches2,
        matches3,
        matches4,
        matches5,
        advice: adviceText,
      });

      setIsAuditing(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" id="modal-fetiches-evaluator">
      
      {/* Fenêtre Modale principale */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/75 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Cercles de fond design céleste */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg">
              <Heart className="w-5 h-5 fill-pink-500/20" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">{loc.title}</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{loc.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-700/60 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* S'il n'y a pas encore de résultat d'audit ou si on est en train d'auditer */}
          {!auditResult && !isAuditing && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* COMPOSANT NUMÉROS (1-50) */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-slate-900/50 p-2.5 border border-slate-800 rounded-xl">
                  <span className="text-xs font-bold text-slate-200 font-sans tracking-wide">
                    {loc.numbersTab}
                  </span>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-black">
                    {selectedNums.length} / 5
                  </span>
                </div>
                
                {/* Pad de sélection 1-50 */}
                <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 sm:gap-2 p-3 bg-slate-900/30 rounded-xl border border-slate-750">
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => {
                    const isSelected = selectedNums.includes(n);
                    return (
                      <button
                        key={`num-box-${n}`}
                        onClick={() => handleNumClick(n)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-black font-sans rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-b from-blue-550 to-blue-700 text-white shadow-md border border-white/20 scale-105"
                            : "bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:bg-slate-700 hover:text-slate-200"
                        }`}
                      >
                        {n < 10 ? `0${n}` : n}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COMPOSANT ÉTOILES (1-12) */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-slate-900/50 p-2.5 border border-slate-800 rounded-xl">
                  <span className="text-xs font-bold text-slate-200 font-sans tracking-wide">
                    {loc.starsTab}
                  </span>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-black">
                    {selectedStars.length} / 2
                  </span>
                </div>

                {/* Pad de sélection de 1 à 12 */}
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 p-3 bg-slate-900/30 rounded-xl border border-slate-755">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => {
                    const isSelected = selectedStars.includes(s);
                    return (
                      <button
                        key={`star-box-${s}`}
                        onClick={() => handleStarClick(s)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-black font-mono rounded-full flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                          isSelected
                            ? "bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 shadow-md border border-white/20 scale-105"
                            : "bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:bg-slate-750 hover:text-amber-400"
                        }`}
                      >
                        <Star className={`w-2.5 h-2.5 ${isSelected ? "text-amber-950 fill-amber-950" : "text-slate-500"}`} />
                        <span className="-mt-0.5 leading-none">{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Barre de contrôle : Reset et Déclenchement */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={clearGrid}
                  disabled={selectedNums.length === 0 && selectedStars.length === 0}
                  className="px-4 py-3 text-xs font-mono border border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all disabled:opacity-40 cursor-pointer text-center"
                >
                  {loc.clearSelection}
                </button>
                <button
                  type="button"
                  disabled={selectedNums.length !== 5 || selectedStars.length !== 2}
                  onClick={runStochasticAudit}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-500 hover:to-blue-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg active:scale-[0.99] transition-all disabled:opacity-45 cursor-pointer flex items-center justify-center gap-2 text-xs uppercase font-sans tracking-wide"
                >
                  <Sparkles className="w-4 h-4 text-pink-200" />
                  <span>{loc.auditBtn}</span>
                </button>
              </div>

            </div>
          )}

          {/* Loader d'analyse stochastique */}
          {isAuditing && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-fadeIn">
              <RefreshCw className="w-12 h-12 text-pink-400 animate-spin" />
              <p className="font-mono text-sm text-slate-300 tracking-wider animate-pulse">{loc.auditingText}</p>
            </div>
          )}

          {/* Résultats de l'audit stochastique */}
          {auditResult && !isAuditing && (
            <div className="space-y-6 animate-scaleUp">
              
              {/* Score central stochastique */}
              <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl" />
                
                <span className="text-[10px] text-pink-400 font-mono tracking-widest uppercase font-black bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
                  {loc.scoreLabel}
                </span>

                <div className="relative mt-4 mb-2 flex items-baseline justify-center">
                  <span className={`text-6xl sm:text-7xl font-sans font-black tracking-tighter bg-gradient-to-r ${
                    auditResult.globalScore >= 80 ? "from-emerald-400 to-blue-400" : auditResult.globalScore >= 60 ? "from-blue-400 to-pink-400" : "from-pink-400 to-amber-400"
                  } bg-clip-text text-transparent`}>
                    {auditResult.globalScore}
                  </span>
                  <span className="text-xl sm:text-2xl text-slate-500 font-mono font-bold">/100</span>
                </div>

                {/* Combinaison auditée */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 py-3">
                  {selectedNums.map((n) => (
                    <div key={`n-audited-${n}`} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-black text-blue-300 font-sans">{n < 10 ? `0${n}` : n}</span>
                    </div>
                  ))}
                  <span className="text-slate-600 font-bold px-0.5">/</span>
                  {selectedStars.map((s) => (
                    <div key={`s-audited-${s}`} className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-black text-amber-300 font-mono">{s < 10 ? `0${s}` : s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critères détaillés d'harmonisation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Parité */}
                <div className="bg-slate-900/40 border border-slate-750 p-4 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-450 font-bold">{loc.parityLabel}</span>
                    <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                      {auditResult.parity}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${auditResult.parityScore}%` }} />
                  </div>
                </div>

                {/* Dispersion Spatiale */}
                <div className="bg-slate-900/40 border border-slate-750 p-4 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-450 font-bold">{loc.consecLabel}</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {auditResult.spatialScore}/100
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${auditResult.spatialScore}%` }} />
                  </div>
                </div>

                {/* Force de Fréquence */}
                <div className="bg-slate-900/40 border border-slate-750 p-4 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-450 font-bold">{loc.frequencyLabel}</span>
                    <span className="text-[11px] font-mono font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {auditResult.freqScore}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${auditResult.freqScore}%` }} />
                  </div>
                </div>

                {/* Synergie Co-occurrence */}
                <div className="bg-slate-900/40 border border-slate-750 p-4 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-450 font-bold">Couplage Co-occurrence Matrice</span>
                    <span className="text-[11px] font-mono font-bold text-pink-500 bg-pink-500/10 px-1.5 py-0.5 rounded">
                      {auditResult.synergyScore}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500" style={{ width: `${auditResult.synergyScore}%` }} />
                  </div>
                </div>

              </div>

              {/* Rétrosimulation de correspondances réelles */}
              <div className="bg-slate-900/45 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold font-mono text-slate-200 uppercase tracking-wide">{loc.historicalLabel}</span>
                </div>
                <p className="text-[11px] text-slate-400">{loc.historicalDesc}</p>
                
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                    <p className="text-[10px] text-slate-500 uppercase">{loc.matchCountLabel} 2</p>
                    <p className="text-sm font-black font-mono text-slate-250 mt-1">{auditResult.matches2}</p>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                    <p className="text-[10px] text-slate-500 uppercase">{loc.matchCountLabel} 3</p>
                    <p className="text-sm font-black font-mono text-blue-400 mt-1">{auditResult.matches3}</p>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                    <p className="text-[10px] text-slate-500 uppercase">{loc.matchCountLabel} 4</p>
                    <p className="text-sm font-black font-mono text-amber-400 mt-1">{auditResult.matches4}</p>
                  </div>
                  <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-850">
                    <p className="text-[10px] text-slate-500 uppercase">{loc.matchCountLabel} 5</p>
                    <p className="text-sm font-black font-mono text-pink-400 mt-1">{auditResult.matches5}</p>
                  </div>
                </div>
              </div>

              {/* Conseil de l'IA Biographe */}
              <div className="bg-blue-950/30 p-4 border border-blue-900/25 rounded-xl space-y-2">
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="w-4.5 h-4.5 text-blue-400" />
                  <span className="text-xs font-bold text-slate-200 font-sans">{loc.aiAdviceTitle}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-350">{auditResult.advice}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAuditResult(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold py-3 px-5 rounded-xl border border-slate-700 active:scale-[0.98] transition-all cursor-pointer text-xs uppercase text-center"
                >
                  {loc.restartBtn}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl active:scale-[0.98] transition-all cursor-pointer text-xs uppercase"
                >
                  {loc.closeBtn}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
