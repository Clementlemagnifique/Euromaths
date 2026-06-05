/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { useSimulateurStore } from "../store/useSimulateurStore";
import { TRANSLATIONS } from "../utils/translations";
import { Flame, Snowflake, Hash, Award, BarChart3, TrendingUp } from "lucide-react";

export default function StatsDashboard() {
  const { statistiques, tirages, lang } = useSimulateurStore();
  const t = TRANSLATIONS[lang];

  // Top 5 Numéros Chauds (triés par fréquence décroissante)
  const topNumerosChauds = useMemo(() => {
    return Object.entries(statistiques.frequenceNumeros)
      .map(([num, freq]) => ({
        num: parseInt(num, 10),
        freq,
        ecart: statistiques.ecartNumeros[parseInt(num, 10)] ?? 0
      }))
      .sort((a, b) => b.freq - a.freq || a.ecart - b.ecart)
      .slice(0, 5);
  }, [statistiques]);

  // Top 5 Numéros Froids (triés par écart décroissant, puis fréquence croissante)
  const topNumerosFroids = useMemo(() => {
    return Object.entries(statistiques.ecartNumeros)
      .map(([num, ecart]) => ({
        num: parseInt(num, 10),
        ecart,
        freq: statistiques.frequenceNumeros[parseInt(num, 10)] ?? 0
      }))
      .sort((a, b) => b.ecart - a.ecart || a.freq - b.freq)
      .slice(0, 5);
  }, [statistiques]);

  // Étoiles Chaudes / Froides
  const topEtoilesChaudes = useMemo(() => {
    return Object.entries(statistiques.frequenceEtoiles)
      .map(([etoile, freq]) => ({
        etoile: parseInt(etoile, 10),
        freq,
        ecart: statistiques.ecartEtoiles[parseInt(etoile, 10)] ?? 0
      }))
      .sort((a, b) => b.freq - a.freq || a.ecart - b.ecart)
      .slice(0, 3);
  }, [statistiques]);

  const topEtoilesFroides = useMemo(() => {
    return Object.entries(statistiques.ecartEtoiles)
      .map(([etoile, ecart]) => ({
        etoile: parseInt(etoile, 10),
        ecart,
        freq: statistiques.frequenceEtoiles[parseInt(etoile, 10)] ?? 0
      }))
      .sort((a, b) => b.ecart - a.ecart || a.freq - b.freq)
      .slice(0, 3);
  }, [statistiques]);

  // Top 3 des paires récurrentes (Co-occurrence)
  const topPairesRecurrentes = useMemo(() => {
    return Object.entries(statistiques.coOccurrenceNumeros)
      .map(([paire, count]) => {
        const [a, b] = paire.split("-").map(Number);
        return { a, b, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [statistiques]);

  return (
    <div className="space-y-6" id="stats-dashboard-container">
      {/* KPIs & Global Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Tirages Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center space-x-4 shadow-md" id="kpi-total-draws">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Hash className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{t.kpiTotalDraws}</p>
            <p className="text-2xl font-bold text-slate-100">{tirages.length}</p>
          </div>
        </div>

        {/* Parité Pair / Impair */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-md" id="kpi-parity">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{t.kpiParity}</p>
            <span className="text-[10px] text-slate-500 font-mono">{t.kpiStoch}</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>{t.kpiPair}: {statistiques.evenOddRatio.even}%</span>
              <span>{t.kpiImpair}: {statistiques.evenOddRatio.odd}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 flex overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${statistiques.evenOddRatio.even}%` }}
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${statistiques.evenOddRatio.odd}%` }}
              />
            </div>
          </div>
        </div>

        {/* Moyenne de somme */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center space-x-4 shadow-md" id="kpi-average-sum">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{t.kpiMeanSum}</p>
            <p className="text-2xl font-bold text-slate-100">{statistiques.averageSum}</p>
            <span className="text-[10px] text-slate-500">{t.kpiTheoreticalMed}</span>
          </div>
        </div>
      </div>

      {/* Main Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Numéros Chauds vs Numéros Froids */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-5 shadow-lg">
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-700 pb-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            {t.statsAffinityTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Chauds */}
            <div className="space-y-3" id="hot-numbers-list">
              <h4 className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1.5 tracking-wider">
                <Flame className="w-4 h-4 text-amber-500" />
                {t.frequentNumbers}
              </h4>
              <div className="space-y-2">
                {topNumerosChauds.map(({ num, freq, ecart }) => (
                  <div
                    key={num}
                    className="flex items-center justify-between p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-b from-blue-500/10 to-blue-500/20 border border-blue-500/40 text-blue-400 font-bold font-mono text-sm shadow-md">
                        {num < 10 ? `0${num}` : num}
                      </span>
                    </div>
                    <div className="text-right font-mono text-[11px] text-slate-400">
                      <div><span className="text-slate-200 font-bold">{freq}</span> {t.statsDrawsUnit}</div>
                      <div>Écart : <span className="text-slate-300 font-semibold">{ecart}</span> {t.statsGapUnit}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Froids */}
            <div className="space-y-3" id="cold-numbers-list">
              <h4 className="text-xs font-bold text-sky-400 uppercase flex items-center gap-1.5 tracking-wider">
                <Snowflake className="w-4 h-4 text-sky-400" />
                {t.coldNumbers}
              </h4>
              <div className="space-y-2">
                {topNumerosFroids.map(({ num, ecart, freq }) => (
                  <div
                    key={num}
                    className="flex items-center justify-between p-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold font-mono text-sm shadow-md">
                        {num < 10 ? `0${num}` : num}
                      </span>
                    </div>
                    <div className="text-right font-mono text-[11px] text-slate-400">
                      <div>Écart : <span className="text-sky-400 font-bold">{ecart}</span> {t.statsDrawsUnit}</div>
                      <div>{t.statsApparitions} : <span className="text-slate-300">{freq}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Étoiles Chaudes / Froides & Co-occurrences */}
        <div className="space-y-6">
          
          {/* Étoiles (1 à 12) */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-lg">
            <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-700 pb-2">
              <Award className="w-5 h-5 text-amber-400" />
              {t.statsLuckyStars}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Étoiles Chaudes */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold uppercase text-amber-500 tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> {t.frequentStars}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {topEtoilesChaudes.map(({ etoile, freq }) => (
                    <div
                      key={etoile}
                      className="p-2.5 bg-slate-900/80 border border-slate-700/80 hover:border-amber-500/40 rounded-xl text-center space-y-1 transition-all shadow-sm"
                    >
                      <div className="text-amber-400 font-extrabold text-base flex items-center justify-center gap-0.5">
                        ★<span className="font-mono text-slate-200">{etoile}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold">{freq}x</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Étoiles Froides */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold uppercase text-sky-400 tracking-wider flex items-center gap-1">
                  <Snowflake className="w-3.5 h-3.5 text-sky-400" /> {t.coldStars}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {topEtoilesFroides.map(({ etoile, ecart }) => (
                    <div
                      key={etoile}
                      className="p-2.5 bg-slate-900/80 border border-slate-700/80 hover:border-sky-500/40 rounded-xl text-center space-y-1 transition-all shadow-sm"
                    >
                      <div className="text-sky-400 font-extrabold text-base flex items-center justify-center gap-0.5">
                        ★<span className="font-mono text-slate-200">{etoile}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold">-{ecart}t</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Matrice de Co-occurrence */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 space-y-3 shadow-lg" id="cooccurrence-top-pairs">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-blue-400" />
              {t.statsSynergyTitle}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.statsSynergyDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {topPairesRecurrentes.map(({ a, b, count }, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gradient-to-br from-slate-900 to-blue-950/20 border border-slate-700 rounded-xl flex flex-col justify-between items-center space-y-2 text-center"
                >
                  <div className="flex items-center gap-1">
                    <span className="w-6.5 h-6.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold flex items-center justify-center border border-blue-500/20">
                      {a}
                    </span>
                    <span className="text-slate-500 text-xs font-bold font-mono">&</span>
                    <span className="w-6.5 h-6.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold flex items-center justify-center border border-blue-500/20">
                      {b}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Sortis : <span className="text-blue-400 font-bold">{count}x</span>
                  </div>
                </div>
              ))}
              {topPairesRecurrentes.length === 0 && (
                <div className="col-span-3 text-slate-500 text-xs text-center py-2">
                  {t.statsNone}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
