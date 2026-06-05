/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { useSimulateurStore } from "../store/useSimulateurStore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Link2, Info, Eye } from "lucide-react";
import CoOccurrenceHeatmapCanvas from "./CoOccurrenceHeatmapCanvas";

export default function CoOccurrenceMatrixWidget() {
  const { statistiques, lastCombinaison, lang, modeExpert } = useSimulateurStore();
  const [selectedNum, setSelectedNum] = useState<number>(3); // Numéro par défaut pour l'analyse
  const [activeTab, setActiveTab] = useState<"chart" | "heatmap">("chart");

  // Force l'affichage de la matrice en mode expert si l'utilisateur l'active
  useEffect(() => {
    if (!modeExpert) {
      setActiveTab("chart");
    }
  }, [modeExpert]);

  const dict: Record<string, any> = {
    FR: {
      title: "Matrice de Co-occurrence Interactive",
      subtitle: "Découvrez les numéros associés les plus fréquents dans l'historique de l'EuroMillions",
      analyze: "Analyser le N° :",
      activeGridTitle: "Sélectionnez un numéro de votre grille générée :",
      legend: "Taux de sortie conjoint (en nombre de tirages)",
      topAffinity: "Top 10 Affinités",
      noSynergy: "Aucune synergie identifiée pour ce numéro avec les tirages actuels.",
      insightTitle: "Analyse d'Affinité",
      insightDesc: (num: number) => `Le numéro N° ${num} possède de fortes corrélations probabilistes dans l'historique de l'EuroMillions.`,
      partnerTitle: "Partenaire n°1 conseillé",
      partnerDesc: (num: number, count: number) => `Le N° ${num} est sorti ensemble ${count} fois avec le N° ${selectedNum}.`,
      infoAlert: "Lorsqu'un numéro est simulé par notre algorithme, la matrice de co-occurrence réévalue instantanément le poids de ses partenaires complices !"
    },
    EN: {
      title: "Interactive Co-occurrence Matrix",
      subtitle: "Discover the most frequent associated numbers in the EuroMillions history",
      analyze: "Analyze No. :",
      activeGridTitle: "Select a number from your simulated grid:",
      legend: "Co-occurrence rate (in total historical draws)",
      topAffinity: "Top 10 Affinities",
      noSynergy: "No synergy identified for this number with current draws.",
      insightTitle: "Affinity Analysis",
      insightDesc: (num: number) => `Number ${num} holds frequent and recurrent probabilistic links in the EuroMillions history.`,
      partnerTitle: "Top Suggested Partner",
      partnerDesc: (num: number, count: number) => `Number ${num} was drawn ${count} times together with Number ${selectedNum}.`,
      infoAlert: "When a number is simulated by our algorithm, the co-occurrence matrix instantly boosts the weight of its synergistic companions!"
    },
    ES: {
      title: "Matriz de Co-ocurrencia Interactiva",
      subtitle: "Descubra los números asociados más frecuentes en el historial de EuroMillones",
      analyze: "Analizar Nº:",
      activeGridTitle: "Seleccione un número de su cuadrícula generada:",
      legend: "Tasa de salida conjunta (número de sorteos)",
      topAffinity: "Top 10 Afinidades",
      noSynergy: "Ninguna sinergia identificada para este número con los sorteos actuales.",
      insightTitle: "Análisis de Afinidad",
      insightDesc: (num: number) => `El número Nº ${num} posee coincidencias de probabilidad recurrentes en el historial.`,
      partnerTitle: "Socio nº1 aconsejado",
      partnerDesc: (num: number, count: number) => `El Nº ${num} salió junto ${count} veces con el Nº ${selectedNum}.`,
      infoAlert: "¡Cuando nuestro simulador elige un número, la matriz de co-ocurrencia recalcula instantáneamente los pesos de sus compañeros!"
    },
    PT: {
      title: "Matriz de Co-ocorrência Interativa",
      subtitle: "Descubra os números associados mais frequentes no histórico do EuroMilhões",
      analyze: "Analisar Nº:",
      activeGridTitle: "Selecione um número da sua chave gerada:",
      legend: "Taxa de saída conjunta (número de sorteios)",
      topAffinity: "Top 10 Afinidades",
      noSynergy: "Nenhuma sinergia identificada para este número nos sorteios atuais.",
      insightTitle: "Análise de Afinidade",
      insightDesc: (num: number) => `O número Nº ${num} possui correlações probabilísticas recorrentes no histórico.`,
      partnerTitle: "Parceiro nº1 sugerido",
      partnerDesc: (num: number, count: number) => `O Nº ${num} foi sorteado junto ${count} vezes com o Nº ${selectedNum}.`,
      infoAlert: "Quando um número é simulado pelo nosso algoritmo, a matriz ajusta de imediato os coeficientes dos seus companheiros combinatórios!"
    }
  };

  const d = dict[lang] || dict.FR;

  // Quand une nouvelle combinaison est générée, sélectionner automatiquement son premier numéro
  useEffect(() => {
    if (lastCombinaison && lastCombinaison.numeros && lastCombinaison.numeros.length > 0) {
      if (!lastCombinaison.numeros.includes(selectedNum)) {
        setSelectedNum(lastCombinaison.numeros[0]);
      }
    }
  }, [lastCombinaison]);

  // Calculer les compagnons de co-occurrence les plus fréquents pour le numéro sélectionné
  const dataCompagnons = useMemo(() => {
    const compagnons: { num: number; count: number }[] = [];

    // Parcourir toutes les clés de co-occurrence "A-B"
    Object.entries(statistiques.coOccurrenceNumeros).forEach(([paires, count]) => {
      const parts = paires.split("-").map(Number);
      if (parts.length === 2) {
        const [a, b] = parts;
        if (a === selectedNum) {
          compagnons.push({ num: b, count });
        } else if (b === selectedNum) {
          compagnons.push({ num: a, count });
        }
      }
    });

    // Trier les accompagnateurs par ordre décroissant
    return compagnons
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 des compagnons
  }, [statistiques.coOccurrenceNumeros, selectedNum]);

  // Compagnon historique le plus fidèle
  const topFidele = dataCompagnons[0] || null;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-5" id="co-occurrence-widget">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-700 pb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">{d.title}</h3>
            <p className="text-xs text-slate-400">{d.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end w-full sm:w-auto">
          {modeExpert && (
            <div className="bg-slate-900 p-0.5 border border-slate-700/60 rounded-lg flex items-center shrink-0">
              <button
                onClick={() => setActiveTab("chart")}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer select-none ${
                  activeTab === "chart"
                    ? "bg-blue-600 font-extrabold text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                📊 {lang === "FR" ? "Affinités" : "Affinities"}
              </button>
              <button
                onClick={() => setActiveTab("heatmap")}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer select-none ${
                  activeTab === "heatmap"
                    ? "bg-blue-600 font-extrabold text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                🎛️ {lang === "FR" ? "Matrice 50x50" : "50x50 Matrix"}
              </button>
            </div>
          )}

          {/* Sélecteur de numéro pour analyse */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-medium">{d.analyze}</span>
            <select
              value={selectedNum}
              onChange={(e) => setSelectedNum(parseInt(e.target.value, 10))}
              className="bg-slate-900 border border-slate-700 hover:border-slate-600 rounded px-2.5 py-1.5 text-xs text-blue-400 font-mono font-bold focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {lastCombinaison && (
                <optgroup label={lang === "FR" ? "Grille Active Générée" : "Active Generated Grid"}>
                  {lastCombinaison.numeros.map((num) => (
                    <option key={`opt-gen-${num}`} value={num}>
                      N° {num < 10 ? `0${num}` : num} ({lang === "FR" ? "Simulé" : "Simulated"})
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label={lang === "FR" ? "Tous les numéros" : "All Numbers"}>
                {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => (
                  <option key={`opt-all-${n}`} value={n}>
                    N° {n < 10 ? `0${n}` : n}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Sélecteur rapide si lastCombinaison existe (permet de sélectionner directement sous forme de balles réactives l'un des numéros simulés) */}
      {lastCombinaison && (
        <div className="bg-slate-900/60 p-3.5 border border-slate-700/50 rounded-xl space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-slate-300 font-mono uppercase tracking-wide">
              {d.activeGridTitle}
            </span>
            <span className="text-[10px] text-slate-400 italic">
              {lang === "FR" ? "(Cliquez pour charger sa co-occurrence historique)" : "(Click to load historical co-occurrence)"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lastCombinaison.numeros.map((num) => {
              const isSelected = selectedNum === num;
              return (
                <button
                  key={`btn-ball-${num}`}
                  onClick={() => setSelectedNum(num)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 border cursor-pointer select-none ${
                    isSelected
                      ? "bg-blue-600 hover:bg-blue-505 text-white border-blue-500 shadow-md shadow-blue-500/20 scale-[1.03]"
                      : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-blue-500 animate-ping"}`}></span>
                  <span>{num < 10 ? `0${num}` : num}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Graphique de Affinités ou Matrix Canvas Heatmap */}
        <div className="lg:col-span-8 space-y-2">
          {activeTab === "chart" ? (
            <>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>{d.legend}</span>
                <span className="font-mono text-emerald-400 cursor-help font-semibold" title="Nombre d'apparitions communes dans l'historique">
                  {d.topAffinity}
                </span>
              </div>

              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50 h-[360px]">
                {dataCompagnons.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dataCompagnons}
                      margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="num"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `N° ${val}`}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#020617",
                          borderColor: "#334155",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#94a3b8", fontSize: "11px", fontWeight: "bold" }}
                        itemStyle={{ color: "#10b981", fontSize: "11px" }}
                        formatter={(value: any) => [
                          `${value} ${lang === "FR" ? "sorties communes" : "common draws"}`,
                          `${lang === "FR" ? "Avec" : "With"} N° ${selectedNum}`,
                        ]}
                        labelFormatter={(label) => `${lang === "FR" ? "Numéro Complice" : "Complice Number"} : ${label}`}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {dataCompagnons.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.num}-${index}`}
                            fill={index === 0 ? "#10b981" : index < 3 ? "#3b82f6" : "#475569"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                    {d.noSynergy}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>{lang === "FR" ? "Matrice 50x50 complète des co-occurrences historiques de l'EuroMillions" : "Complete 50x50 co-occurrence matrix heatmap grid"}</span>
                <span className="font-mono text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded text-[9px] tracking-wider animate-pulse">HEATMAP</span>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50 min-h-[360px] flex items-center justify-center">
                <CoOccurrenceHeatmapCanvas
                  statistiques={statistiques}
                  selectedNum={selectedNum}
                  setSelectedNum={setSelectedNum}
                  lang={lang}
                />
              </div>
            </>
          )}
        </div>

        {/* Cartouche Explicative / Insights */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4.5 space-y-3.5 h-full flex flex-col justify-center">
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block">
                {d.insightTitle}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {d.insightDesc(selectedNum)}
              </p>
            </div>

            {topFidele && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-md shrink-0 font-bold text-slate-100 font-mono text-sm leading-none">
                  {topFidele.num < 10 ? `0${topFidele.num}` : topFidele.num}
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold leading-none">
                    {d.partnerTitle}
                  </span>
                  <p className="text-[11px] text-slate-300 pt-1 leading-normal">
                    {d.partnerDesc(topFidele.num, topFidele.count)}
                  </p>
                </div>
              </div>
            )}

            <div className="text-[10px] text-slate-550 leading-relaxed flex items-start gap-1.5 border-t border-slate-700/60 pt-3">
              <Info className="w-3.5 h-3.5 shrink-0 text-slate-450 mt-0.5" />
              <span>
                {d.infoAlert}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
