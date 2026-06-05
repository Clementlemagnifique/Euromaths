/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useSimulateurStore } from "../store/useSimulateurStore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Link2, Award, Info, RefreshCw } from "lucide-react";

export default function CoOccurrenceMatrixWidget() {
  const { statistiques } = useSimulateurStore();
  const [selectedNum, setSelectedNum] = useState<number>(3); // Numéro par défaut pour l'analyse

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
            <h3 className="text-base font-semibold text-slate-100">Matrice de Co-occurrence Interactive</h3>
            <p className="text-xs text-slate-400">Voyez quels numéros sortent le plus souvent ensemble</p>
          </div>
        </div>

        {/* Sélecteur de numéro pour analyse */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-medium">Analyser le N° :</span>
          <select
            value={selectedNum}
            onChange={(e) => setSelectedNum(parseInt(e.target.value, 10))}
            className="bg-slate-900 border border-slate-700 hover:border-slate-600 rounded px-2 py-1.5 text-xs text-blue-400 font-mono font-bold focus:outline-none focus:border-blue-500 transition-colors"
          >
            {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n < 10 ? `0${n}` : n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Graphique de Affinités Recharts */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Taux de sortie conjoint (en nombre de tirages)</span>
            <span className="font-mono text-emerald-400 hover:underline cursor-help" title="Nombre d'apparitions communes dans l'historique">
              Top 10 Affinités
            </span>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50 h-[220px]">
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
                    formatter={(value: any, name: any, props: any) => [
                      `${value} sorties communes`,
                      `Avec le N° ${selectedNum}`,
                    ]}
                    labelFormatter={(label) => `Numéro Complice : ${label}`}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {dataCompagnons.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#10b981" : index < 3 ? "#3b82f6" : "#475569"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
                Aucune synergie identifiée pour ce numéro avec les tirages actuels.
              </div>
            )}
          </div>
        </div>

        {/* Cartouche Explicative / Insights */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4.5 space-y-3.5 h-full flex flex-col justify-center">
            
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block">
                Insight d'Affinité
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Le numéro <strong className="text-blue-400 font-sans">N° {selectedNum}</strong> possède des correspondances probabilistes récurrentes dans l'historique de 2016 à aujourd'hui.
              </p>
            </div>

            {topFidele && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-md animate-pulse shrink-0 font-bold text-slate-100 font-mono text-sm leading-none">
                  {topFidele.num < 10 ? `0${topFidele.num}` : topFidele.num}
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-mono font-bold leading-none">
                    Partenaire n°1 conseillé
                  </span>
                  <p className="text-[11px] text-slate-205 pt-1">
                    Sortis ensemble <strong>{topFidele.count} fois</strong>.
                  </p>
                </div>
              </div>
            )}

            <div className="text-[10px] text-slate-500 leading-relaxed flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
              <span>
                Lorsqu'un numéro est virtuellement choisi par notre tirage stochastique, la matrice réévalue instantanément le poids de ses complices !
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
