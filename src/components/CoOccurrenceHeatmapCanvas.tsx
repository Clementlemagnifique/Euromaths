/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Statistiques } from "../types";

interface CoOccurrenceHeatmapCanvasProps {
  statistiques: Statistiques;
  selectedNum: number;
  setSelectedNum: (num: number) => void;
  lang: string;
}

export default function CoOccurrenceHeatmapCanvas({
  statistiques,
  selectedNum,
  setSelectedNum,
  lang
}: CoOccurrenceHeatmapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number; count: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Calcul du max co-occurrence pour normalisation dynamique des couleurs
  const maxCooc = useMemo(() => {
    let max = 1;
    Object.entries(statistiques.coOccurrenceNumeros).forEach(([_, val]) => {
      if (val > max) max = val;
    });
    return max;
  }, [statistiques.coOccurrenceNumeros]);

  // Récupérer le score de co-occurrence de deux numéros
  const getCooccurrence = (n1: number, n2: number): number => {
    if (n1 === n2) return 0;
    const min = Math.min(n1, n2);
    const max = Math.max(n1, n2);
    return statistiques.coOccurrenceNumeros[`${min}-${max}`] || 0;
  };

  // Dessin de la matrice 50x50 sur le Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Définir la dimension réelle du canvas
    const size = 350;
    canvas.width = size;
    canvas.height = size;

    // Nettoyer le canvas
    ctx.fillStyle = "#0f172a"; // Slate 900
    ctx.fillRect(0, 0, size, size);

    const cellSize = size / 50;

    for (let row = 0; row < 50; row++) {
      for (let col = 0; col < 50; col++) {
        const num1 = row + 1;
        const num2 = col + 1;
        const count = getCooccurrence(num1, num2);

        // Couleur de base pour les intersections de même numéro (diagonale)
        if (num1 === num2) {
          ctx.fillStyle = "#020617"; // Diagonale noire
        } else {
          // Intensité normalisée
          const intensity = count / maxCooc;
          
          if (count === 0) {
            ctx.fillStyle = "#1e293b"; // Neutre slate 800
          } else {
            // Créer une couleur dégradée de bleu à vert émeraude
            const r = Math.round(15 + intensity * (16 - 15));
            const g = Math.round(23 + intensity * (185 - 23));
            const b = Math.round(42 + intensity * (129 - 42));
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          }
        }

        // Mettre en surbrillance la ligne et la colonne du numéro sélectionné
        if (num1 === selectedNum || num2 === selectedNum) {
          if (num1 !== num2) {
            // Ajouter une bordure scintillante ou teinter en bleu électrique
            ctx.fillStyle = "#3b82f6"; // Blue 500 pour les lignes du numéro sélectionné
          } else {
            ctx.fillStyle = "#f59e0b"; // Or pour la bille de sélection sur la diagonale
          }
        }

        ctx.fillRect(col * cellSize, row * cellSize, cellSize - 0.5, cellSize - 0.5);
      }
    }
  }, [statistiques, selectedNum, maxCooc]);

  // Gestionnaires de souris
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cellSize = rect.width / 50;
    const colIdx = Math.floor(x / cellSize);
    const rowIdx = Math.floor(y / cellSize);

    if (colIdx >= 0 && colIdx < 50 && rowIdx >= 0 && rowIdx < 50) {
      const num1 = rowIdx + 1;
      const num2 = colIdx + 1;
      const count = getCooccurrence(num1, num2);

      setHoveredCell({ x: num2, y: num1, count });
      setTooltipPos({
        x: e.clientX - rect.left + 15,
        y: e.clientY - rect.top + 15
      });
    } else {
      setHoveredCell(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  const handleCanvasClick = () => {
    if (hoveredCell) {
      // Sélectionner le numéro principal détecté sous le curseur
      setSelectedNum(hoveredCell.y);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4" ref={containerRef}>
      <div className="relative bg-slate-950 p-2.5 rounded-xl border border-slate-700/60 shadow-inner">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCanvasClick}
          className="cursor-crosshair rounded-lg block max-w-full"
          style={{ width: "320px", height: "320px" }}
          id="cooc-heatmap-canvas"
        />

        {/* Info-bulle dynamique Canvas Heatmap */}
        {hoveredCell && (
          <div
            className="absolute z-30 bg-slate-950/95 border border-slate-700 text-[10px] sm:text-xs text-slate-100 rounded-lg p-2.5 shadow-xl font-mono leading-relaxed select-none pointer-events-none whitespace-nowrap"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            {hoveredCell.x === hoveredCell.y ? (
              <div>
                <span className="text-amber-400 font-bold">N° {hoveredCell.x}</span> (Diagonale d'Auto-parité)
              </div>
            ) : (
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-blue-400 font-bold">N° {hoveredCell.y}</span>
                  <span className="text-slate-500">&</span>
                  <span className="text-blue-400 font-bold">N° {hoveredCell.x}</span>
                </div>
                <div>
                  Sorties communes : <span className="text-emerald-400 font-bold">{hoveredCell.count} fois</span>
                </div>
                <div className="text-[9px] text-slate-450 italic pt-0.5">
                  {lang === "FR" ? "Cliquez pour cibler l'analyse" : "Click to analyze target"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] sm:text-xs font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#1e293b] border border-slate-700 inline-block" />
          <span>{lang === "FR" ? "Faible (0 sorties)" : "Low (0 draws)"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#0f5431] border border-emerald-800 inline-block" />
          <span>{lang === "FR" ? "Fréquent" : "Frequent"}</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-emerald-450">
          <span className="w-2.5 h-2.5 rounded bg-[#10b981] inline-block animate-pulse" />
          <span>{lang === "FR" ? "Synergie Maximale" : "Max Synergy"}</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-blue-400">
          <span className="w-2.5 h-2.5 rounded bg-[#3b82f6] inline-block" />
          <span>{lang === "FR" ? "Alignement Sélectionné" : "Selected Path"}</span>
        </div>
      </div>
    </div>
  );
}
