/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, Atom, Sparkles, Binary, RefreshCw } from "lucide-react";

interface MathVortexAnimationProps {
  onComplete: () => void;
}

const COMPUTATION_LOGS = [
  "INBOUND: Initializing stochastic solver engine...",
  "PARSING: Compiling 2016-2026 certified EuroMillions draws...",
  "MATRIX: Projecting 50x50 co-occurrence correlation space...",
  "EIGEN: Calculating principal Component eigenvectors...",
  "MATH: f(n) = w_f * Freq(n) + w_e * Ecart(n) + CoOccur(n)...",
  "STOCHASTIC: Initializing Shannon entropy multipliers...",
  "BALANCER: Balancing binomial odd/even ratio optimization...",
  "CONVERGENCE: Resolving Markov decision processes...",
  "QUANTUM: Simulating 10,000 iterative Monte Carlo sequences...",
  "RESOLVING: Extracting global Pareto-optimal frontiers...",
  "OPTIMIZATION: Completed! Injecting synergy weights...",
];

const FORMULAS = [
  "P(A|B) = [P(B|A) · P(A)] / P(B)",
  "v_i = ∑_{j} w_{ij} · c_j + b_i",
  "H(X) = -∑ P(x_i) log₂ P(x_i)",
  "M_{50×50} = T_i ⊗ T_j",
  "σ = √[ ∑ (x_i - μ)² / N ]",
  "λ(t) = λ₀ · e^{-r·t}",
];

export default function MathVortexAnimation({ onComplete }: MathVortexAnimationProps) {
  const [step, setStep] = useState<number>(0); // 0: Converging, 1: Vortex Hyperdrive, 2: Lightspeed Flash, 3: Completed
  const [activeLogIndex, setActiveLogIndex] = useState<number>(0);
  const [shufflingNumbers, setShufflingNumbers] = useState<number[]>([12, 45, 8, 27, 39, 4, 19]);
  const [currentFormula, setCurrentFormula] = useState<string>(FORMULAS[0]);

  // Handle computation steps over 4.8 seconds
  useEffect(() => {
    // Step 0 -> Step 1: Matrix compression after 1.5s
    const timer1 = setTimeout(() => {
      setStep(1);
    }, 1500);

    // Step 1 -> Step 2: Lightspeed quantum jump after 3.3s
    const timer2 = setTimeout(() => {
      setStep(2);
    }, 3300);

    // Step 2 -> Step 3: Dissipation / complete after 4.5s
    const timer3 = setTimeout(() => {
      setStep(3);
      onComplete();
    }, 4800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Rapidly swap computation logs & formulas for cinematic code-rain effect
  useEffect(() => {
    const logInterval = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % COMPUTATION_LOGS.length);
    }, 400);

    const formulaInterval = setInterval(() => {
      setCurrentFormula(FORMULAS[Math.floor(Math.random() * FORMULAS.length)]);
    }, 600);

    return () => {
      clearInterval(logInterval);
      clearInterval(formulaInterval);
    };
  }, []);

  // Shuffle lucky numbers continuously in the background
  useEffect(() => {
    const numbersInterval = setInterval(() => {
      setShufflingNumbers((prev) =>
        prev.map(() => Math.floor(Math.random() * 50) + 1)
      );
    }, 80);

    return () => clearInterval(numbersInterval);
  }, []);

  // Math wave visualization points
  const points = useMemo(() => {
    const pts = [];
    const resolution = 40;
    for (let i = 0; i <= resolution; i++) {
      const x = (i / resolution) * 100;
      // Synthesize multi-sine wave
      const y1 = Math.sin((i / 5) - (step * 3)) * 18;
      const y2 = Math.cos((i / 3.5) + (step * 5)) * 10;
      const y = 50 + y1 + y2;
      pts.push(`${x},${y}`);
    }
    return pts.join(" ");
  }, [step]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl overflow-hidden"
      id="math-vortex-screen-overlay"
      style={{ perspective: "1100px" }}
    >
      {/* 3D Grid starfield system */}
      <div 
        className={`absolute inset-0 bg-[linear-gradient(rgba(2,16,40,0.5)_2px,transparent_2px),linear-gradient(90deg,rgba(2,16,40,0.5)_2px,transparent_2px)] bg-[size:40px_40px] [transform:rotateX(60deg)_translateZ(-200px)] pointer-events-none transition-all duration-[3000ms] ${
          step >= 1 ? "scale-150 brightness-[1.8] translate-y-24" : "opacity-40"
        }`}
      />

      {/* Radial ambient background aura glows */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none transition-all duration-1000 ${
          step === 2 
            ? "bg-white/20 scale-150" 
            : step === 1 
            ? "bg-blue-500/10 scale-125" 
            : "bg-blue-600/5"
        }`}
      />

      {/* Floating stochastic equation labels */}
      <div className="absolute top-12 left-10 text-slate-500/30 text-xs font-mono select-none hidden md:block">
        GLOBAL_MATRIX_DENSITY: 0.9842<br />
        TENSOR_RESONANCE: 412.5 Hz
      </div>

      <div className="absolute top-12 right-10 text-slate-500/30 text-xs font-mono select-none text-right hidden md:block">
        STOCH_ALGO: WEIGHTED_RANDOM_v3<br />
        ENTROPY: -Σ p_i log(p_i)
      </div>

      {/* MAIN ANIMATION CONTAINER WITH 3D RIG */}
      <div className="relative flex flex-col items-center justify-center max-w-lg w-full px-6 text-center space-y-8 z-10">
        
        {/* The 3D Vortex / Portal */}
        <div className="relative w-64 h-64 flex items-center justify-center" id="animation-vortex-core">
          
          {/* External Rotating Code Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className={`absolute inset-0 rounded-full border-2 border-dashed transition-all duration-1000 ${
              step >= 1 ? "scale-110 border-blue-400/40" : "border-slate-800"
            }`}
          />

          {/* Medium Rotating Ring with LOTTO Numbers */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute w-48 h-48 rounded-full border-t border-b border-blue-500/20 flex items-center justify-center"
          >
            {/* Displaying numbers around a virtual ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              {shufflingNumbers.slice(0, 4).map((num, idx) => {
                const angle = idx * 90;
                return (
                  <span
                    key={idx}
                    style={{ transform: `rotate(${angle}deg) translateY(-85px)` }}
                    className="absolute text-[10px] font-mono text-blue-400/50 font-bold"
                  >
                    {num < 10 ? `0${num}` : num}
                  </span>
                );
              })}
            </div>
          </motion.div>

          {/* Core Computational Center with 3D energy sphere */}
          <div className="absolute bg-slate-900 border border-slate-700/60 shadow-2xl rounded-full w-32 h-32 flex flex-col items-center justify-center">
            
            {/* Microchips orbits / Ring lines */}
            <motion.div
              animate={{ rotate: 360, scale: step >= 1 ? [1, 1.08, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className={`absolute inset-2 rounded-full border border-blue-500/30 flex items-center justify-center`}
            />

            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-1">
              {/* Flashing current selected optimal numbers in core */}
              <div className="flex justify-center gap-1">
                {shufflingNumbers.slice(0, 3).map((num, i) => (
                  <span
                    key={i}
                    className="text-base font-black font-sans text-white tracking-widest leading-none drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                  >
                    {num < 10 ? `0${num}` : num}
                  </span>
                ))}
              </div>
              
              {/* Active animated icon rotating fast */}
              <div className="flex items-center gap-1.5 pt-1 text-blue-400">
                <Atom className="w-4 h-4 animate-spin text-cyan-400" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400 animate-pulse">
                  Stoch-v3
                </span>
              </div>
            </div>

            {/* Glowing radial pulse */}
            <div 
              className={`absolute inset-0 rounded-full border-4 border-cyan-400/30 transition-all duration-[3000ms] ${
                step >= 1 ? "scale-[1.8] opacity-0" : "animate-ping scale-100"
              }`} 
            />
          </div>

          {/* Dynamic Probability wave curves around the sphere */}
          <svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Wave Grid back */}
            <motion.path
              d={`M ${points}`}
              fill="none"
              stroke="rgba(6, 182, 212, 0.25)"
              strokeWidth="0.8"
              className="transition-all duration-300"
            />
            {/* Multi-frequency sine waves overlay */}
            <motion.path
              d={`M ${points.split(" ").reverse().join(" ")}`}
              fill="none"
              stroke="rgba(59, 130, 246, 0.4)"
              strokeWidth="0.6"
              className="transition-all duration-300"
            />
          </svg>

          {/* Floating formula particles coming in from Z-axis */}
          <div className="absolute inset-0 pointer-events-none text-slate-400/30 text-[10px] font-mono select-none">
            <motion.span
              animate={{ y: [-15, 15], opacity: [0, 0.8, 0], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
              className="absolute top-1/4 left-1/4 text-[9px] text-emerald-400/40"
            >
              w_co(i,j) ≥ 1.8
            </motion.span>
            <motion.span
              animate={{ y: [15, -15], opacity: [0, 0.7, 0], scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
              className="absolute bottom-1/4 right-1/4 text-[9px] text-blue-400/40"
            >
              f_optimale
            </motion.span>
          </div>

        </div>

        {/* Dynamic Title and Description */}
        <div className="space-y-2 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              {step === 0 && (
                <>
                  <h2 className="text-lg font-black font-sans text-slate-100 uppercase tracking-widest flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-450 animate-pulse" />
                    Convergence Matricielle
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                    Calibration des poids de l'historique de la FDJ et apprentissage des co-occurrences...
                  </p>
                </>
              )}
              {step === 1 && (
                <>
                  <h2 className="text-lg font-black font-sans text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <Binary className="w-5 h-5 text-cyan-400 animate-bounce" />
                    Vortex Stochastique
                  </h2>
                  <p className="text-xs text-blue-200 mt-1 max-w-xs leading-relaxed">
                    Compression des probabilités cumulées sous contrainte de distribution...
                  </p>
                </>
              )}
              {step >= 2 && (
                <>
                  <h2 className="text-xl font-black font-sans text-cyan-400 uppercase tracking-widest flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-5 h-5 text-white" />
                    Projection Optimale
                  </h2>
                  <p className="text-xs text-white mt-1 max-w-xs leading-relaxed font-semibold">
                    Quantum Speed resolved! Restitution du modèle prédictif optimal...
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Current Running Formula Box */}
          <div className="h-6 flex items-center justify-center">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-3 py-0.5 rounded-full select-none shadow-sm">
              ∑ {currentFormula}
            </span>
          </div>
        </div>

        {/* Scrolling Console log ticker to prove calculations */}
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 h-20 text-left relative overflow-hidden">
          <div className="absolute top-2.5 right-3 flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider bg-emerald-950/40 border border-emerald-900/20 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            SYS_SOLVE
          </div>

          <div className="space-y-1 font-mono text-[10px] text-slate-400 leading-snug">
            {/* History logs rendering */}
            <div className="text-slate-500 italic">
              &gt; {COMPUTATION_LOGS[(activeLogIndex - 1 + COMPUTATION_LOGS.length) % COMPUTATION_LOGS.length]}
            </div>
            <div className="text-blue-300 font-bold">
              &gt; {COMPUTATION_LOGS[activeLogIndex]}
            </div>
            <div className="text-slate-550">
              &gt; Analyzing Lagrange weights... ok
            </div>
          </div>
        </div>

        {/* Progress Timeline Tracker */}
        <div className="w-full flex justify-between items-center px-2 text-[10px] font-mono font-bold text-slate-500">
          <span className={step === 0 ? "text-blue-400" : "text-slate-500"}>1. Convergence</span>
          <span className="text-slate-700">➔</span>
          <span className={step === 1 ? "text-cyan-450 font-extrabold" : "text-slate-500"}>2. Vortex</span>
          <span className="text-slate-700">➔</span>
          <span className={step >= 2 ? "text-white font-extrabold animate-pulse" : "text-slate-500"}>3. Lightspeed</span>
        </div>

      </div>

      {/* FULL-SCREEN FLASH AT HYPERDRIVE LIGHTSPEED */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-600 via-white to-cyan-500 z-40 mix-blend-overlay flex items-center justify-center animate-pulse"
          >
            {/* Lightspeed streak lines radiating from center */}
            <div className="absolute w-full h-[2px] bg-white opacity-80 rotate-12 scale-150 transform transition-all duration-500" />
            <div className="absolute w-full h-[2px] bg-white opacity-80 -rotate-12 scale-150 transform transition-all duration-500" />
            <div className="absolute w-full h-[2.5px] bg-cyan-300 opacity-90 rotate-45 scale-150 transform transition-all duration-500" />
            <div className="absolute w-full h-[2.5px] bg-blue-300 opacity-90 -rotate-45 scale-150 transform transition-all duration-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual bypass/skip button for convenience */}
      <button
        onClick={() => {
          setStep(3);
          onComplete();
        }}
        className="absolute bottom-6 text-[10px] font-mono text-slate-500 hover:text-slate-300 hover:underline cursor-pointer bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
      >
        Passer l'animation de calcul (stochastique rapide)
      </button>

    </div>
  );
}
