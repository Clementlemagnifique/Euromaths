/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useMemo } from "react";
import { useSimulateurStore } from "../store/useSimulateurStore";
import { Star, Rotate3d, Compass } from "lucide-react";

interface Node3D {
  num: number;
  x3d: number;
  y3d: number;
  z3d: number;
  x2d: number;
  y2d: number;
  scale: number;
  freq: number;
  isSimulated: boolean;
}

export default function Expert3DOrbitCanvas() {
  const { statistiques, lastCombinaison, lang, modeExpert } = useSimulateurStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Angle de rotation global de la sphère
  const angleXRef = useRef<number>(0.005);
  const angleYRef = useRef<number>(0.005);
  
  // Suivi de la souris pour faire pivoter la sphère interactivement
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });  // Pré-calculer les positions sphériques uniformes des 50 numéros (répartition de Fibonacci sur la sphère)
  const baseNodes3D = useMemo(() => {
    const nodes: Node3D[] = [];
    const simulatedSet = new Set(lastCombinaison?.numeros || []);
    
    // Récupérer les fréquences min et max pour normaliser
    const frequencies = Object.values(statistiques.frequenceNumeros);
    const minFreq = Math.min(...frequencies);
    const maxFreq = Math.max(...frequencies);
    const diffFreq = maxFreq - minFreq || 1;

    for (let i = 0; i < 50; i++) {
      const num = i + 1;
      
      // Répartition de Fibonacci sphérique
      const phi = Math.acos(1 - 2 * (i + 0.5) / 50);
      const theta = Math.PI * (1 + 5 ** 0.5) * (i + 0.5);
      
      const r = 155; // Rayon de la sphère plus grand (précédemment 125)
      const x3d = r * Math.sin(phi) * Math.cos(theta);
      const y3d = r * Math.sin(phi) * Math.sin(theta);
      const z3d = r * Math.cos(phi);
      
      const rawFreq = statistiques.frequenceNumeros[num] || 0;
      const normFreq = (rawFreq - minFreq) / diffFreq;

      nodes.push({
        num,
        x3d,
        y3d,
        z3d,
        x2d: 0,
        y2d: 0,
        scale: 0,
        freq: normFreq,
        isSimulated: simulatedSet.has(num)
      });
    }
    return nodes;
  }, [statistiques.frequenceNumeros, lastCombinaison]);

  // Boucle de rendu Canvas
  useEffect(() => {
    if (!modeExpert) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 440;
    let height = 440;

    // Position instantanée des points
    const points = [...baseNodes3D.map(p => ({ ...p }))];

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const size = Math.min(parent.clientWidth - 10, 440);
        canvas.width = size;
        canvas.height = size;
        width = size;
        height = size;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Fond étoilé subtil d'arrière-plan
      ctx.fillStyle = "#0c1524"; // Sorte d'espace lointain
      ctx.fillRect(0, 0, width, height);

      // Dessiner un repère sphérique / grille orbitale de fond
      ctx.strokeStyle = "rgba(59, 130, 246, 0.05)";
      ctx.lineWidth = 1.5;
      
      // Cercles de longitude/latitude célestes avec rayon plus grand (155)
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 155, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, 155, 55, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, 55, 155, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Ajuster dynamiquement l'angle d'inertie de rotation automatique
      let ax = angleXRef.current;
      let ay = angleYRef.current;

      if (isHovered) {
        // La souris influence l'axe de rotation céleste
        ax = (mousePosRef.current.y - height / 2) * 0.0001;
        ay = (mousePosRef.current.x - width / 2) * 0.0001;
      }

      // 1. Appliquer les rotations 3D sur tous les points d'orbite
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);

      points.forEach((p) => {
        // Rotation axe X
        const y1 = p.y3d * cosX - p.z3d * sinX;
        const z1 = p.z3d * cosX + p.y3d * sinX;
        
        // Rotation axe Y
        const x2 = p.x3d * cosY - z1 * sinY;
        const z2 = z1 * cosY + p.x3d * sinY;

        p.x3d = x2;
        p.y3d = y1;
        p.z3d = z2;

        // Projection 2D perspective
        const distanceCamera = 300;
        const factor = distanceCamera / (distanceCamera + z2); // Effet de z-depth
        
        p.x2d = width / 2 + x2 * factor;
        p.y2d = height / 2 + y1 * factor;
        p.scale = factor;
      });

      // Trier les points par coordonnée Z décroissante pour le Z-buffering (peindre les plus éloignés d'abord)
      points.sort((a, b) => b.z3d - a.z3d);

      // 2. Dessiner les lignes de constellation pour la combinaison simulée active
      const simulatedPoints = points.filter(p => p.isSimulated);
      if (simulatedPoints.length > 1) {
        ctx.beginPath();
        simulatedPoints.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x2d, p.y2d);
          else ctx.lineTo(p.x2d, p.y2d);
        });
        ctx.closePath();
        
        // Halo lumineux de la constellation simulée
        ctx.strokeStyle = "rgba(59, 130, 246, 0.45)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 12;
        ctx.stroke();
        
        // Fond translucide de polygone
        ctx.fillStyle = "rgba(30, 58, 138, 0.18)";
        ctx.shadowBlur = 0; // reset shadow
        ctx.fill();
      }

      // 3. Peindre les nœuds de chiffres de la sphère
      points.forEach((p) => {
        const radius = (2.5 + p.freq * 4.5) * p.scale;
        
        // Couleur selon l'intensité statistique
        let nodeColor = `rgba(148, 163, 184, ${0.3 + p.scale * 0.5})`; // Gris ardoise par défaut
        let glowColor = "";

        if (p.isSimulated) {
          nodeColor = "#10b981"; // Vert émeraude brillant pour les numéros de la grille simulée active
          glowColor = "#10b981";
        } else if (p.freq > 0.7) {
          nodeColor = "#f59e0b"; // Or chaud pour les super-chauds
          glowColor = "#f59e0b";
        } else if (p.scale > 1.1) {
          nodeColor = `rgba(59, 130, 246, ${0.45 + p.scale * 0.4})`; // Bleuté pour le premier plan
        }

        // Dessiner le glow s'il y en a un
        if (glowColor && p.scale > 0.6) {
          ctx.beginPath();
          ctx.arc(p.x2d, p.y2d, radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = glowColor === "#10b981" ? "rgba(16, 185, 129, 0.22)" : "rgba(245, 158, 11, 0.15)";
          ctx.fill();
        }

        // Le point principal de la particule
        ctx.beginPath();
        ctx.arc(p.x2d, p.y2d, radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Afficher l'étiquette numérique si le point est assez proche au premier plan (ou fait partie du tirage simulé)
        if (p.scale > 0.8 || p.isSimulated) {
          ctx.fillStyle = p.isSimulated ? "#10b981" : p.freq > 0.7 ? "#fbcfe8" : "#e2e8f0";
          ctx.font = `${p.isSimulated ? "bold 10px" : "9px"} "JetBrains Mono", Courier, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Ajouter un arrière-plan translucide ovale pour la lisibilité
          ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
          ctx.fillRect(p.x2d - 8, p.y2d - 12 - (p.isSimulated ? 2 : 0), 16, 8);

          ctx.fillStyle = p.isSimulated ? "#34d399" : "rgba(226, 232, 240, 0.9)";
          ctx.fillText(String(p.num), p.x2d, p.y2d - 10);
        }
      });

      // Légende d'indicateur stochastique
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.font = "8px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText(`ROT_X: ${ax.toFixed(4)} RAD`, width - 10, height - 20);
      ctx.fillText(`ROT_Y: ${ay.toFixed(4)} RAD`, width - 10, height - 10);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [baseNodes3D, modeExpert, isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  if (!modeExpert) return null;

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-slideDown" id="orbital-3d-visualizer">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
            <Rotate3d className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest flex items-center gap-2">
              {lang === "FR" ? "Topologie Céleste 3D" : "3D Celestial Topology"}
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full animate-pulse font-extrabold">LIVE</span>
            </h3>
            <p className="text-xs text-slate-400">{lang === "FR" ? "Représentation multidimensionnelle des numéros en orbite stochastique" : "Multidimensional representation of stochastic number constellations"}</p>
          </div>
        </div>
        <Compass className="w-5 h-5 text-slate-500 hover:text-blue-400 cursor-pointer transition-colors" />
      </div>

      <div className="flex flex-col items-center justify-center space-y-6">
        
        {/* Sphere Container - Aéré et plus grand */}
        <div className="relative overflow-hidden flex justify-center items-center p-4 bg-slate-950/40 rounded-2xl border border-slate-850 w-full max-w-[460px]">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="cursor-grab active:cursor-grabbing rounded-xl select-none max-w-full w-[310px] h-[310px] sm:w-[380px] sm:h-[380px]"
          />
        </div>

        {/* Dynamic description of the constellation path - STRICTLY UNDERNEATH & SPACIOUS */}
        <div className="w-full font-mono text-xs leading-relaxed text-slate-300 bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase font-extrabold text-blue-400 border-b border-slate-850 pb-2.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{lang === "FR" ? "Analyse de la Trajectoire Active" : "Active Trajectory Vector"}</span>
          </div>
          {lastCombinaison ? (
            <div className="space-y-3">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-wrap gap-2 items-center">
                <span className="text-slate-450">{lang === "FR" ? "Nœuds de Constellation : " : "Constellation Nodes: "}</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-sm tracking-wide">
                  {lastCombinaison.numeros.join(" ➔ ")}
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-2 pl-1">
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 shrink-0">➔</span>
                  <span>{lang === "FR" ? "Les arêtes virtuelles tracées en temps réel relient nos points d'attraction dans l'espace multidimensionnel." : "Virtual edges mapped in real-time tie nodes within space."}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 shrink-0">➔</span>
                  <span>{lang === "FR" ? "La taille de chaque nœud orbital est corrélée à sa fréquence de sortie historique pour symboliser sa masse de gravité." : "The size of each orbital node is mathematically correlated to its historical draw frequency to represent its gravity mass."}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 shrink-0">➔</span>
                  <span>{lang === "FR" ? "Glissez votre curseur ou déplacez votre doigt sur le cadran céleste pour faire tourner et réorienter la trajectoire." : "Hover your cursor or drag your finger across the celestial viewer to rotate and reorient the path angle."}</span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 italic">
              {lang === "FR" ? "Générez un tirage pour observer l'alignement de la trajectoire au cœur du cadran 3D." : "Generate a simulated grid to track real-time path alignments on the 3D grid."}
            </p>
          )}
        </div>

      </div>

    </div>
  );
}
