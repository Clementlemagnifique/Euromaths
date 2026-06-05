/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Mail, Sparkles, ShieldCheck, CheckCircle, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSimulateurStore } from "../store/useSimulateurStore";
import { TRANSLATIONS } from "../utils/translations";

export default function MarketingModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { lang } = useSimulateurStore();
  const t = TRANSLATIONS[lang];

  const ethicalTitleTrans: Record<string, string> = {
    FR: "Souveraineté & Intégrité Scientifique",
    EN: "Sovereignty & Scientific Integrity",
    ES: "Soberanía e Integridad Científica",
    PT: "Soberania e Integridade Científica"
  };

  const dontShowAgainTrans: Record<string, string> = {
    FR: "Ne plus afficher au démarrage",
    EN: "Do not show again on startup",
    ES: "No volver a mostrar al inicio",
    PT: "Não mostrar novamente ao iniciar"
  };

  useEffect(() => {
    // Vérifier si l'utilisateur a désactivé le popup d'accueil
    const isDismissed = localStorage.getItem("euromaths_dismiss_marketing") === "true";
    if (!isDismissed) {
      // Afficher le popup avec un léger délai élégant pour l'UX
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("euromaths_dismiss_marketing", "true");
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md" id="marketing-modal-overlay">
          
          {/* Main Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6"
            id="marketing-modal-card"
          >
            {/* Bouton fermeture absolue */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800 rounded-full transition-all cursor-pointer"
              aria-label="Fermer"
              id="marketing-modal-close-btn"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Accent d'en-tête marketing avec petit design élégant */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-extrabold font-mono tracking-wider upper">
                EUROPE PROBABILISTIC RESEARCH NETWORK
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
            </div>

            {/* Illustration Titre */}
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-2xl font-black text-slate-100 tracking-tight leading-tight uppercase">
                {t.welcomeTitle}
              </h2>
              <p className="text-sm text-slate-300 font-medium">
                {t.welcomeConceptTitle}
              </p>
            </div>

            {/* Explications clés */}
            <div className="space-y-3.5 text-xs text-slate-400 leading-relaxed" id="marketing-highlights">
              <div className="flex gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="p-1.5 h-fit bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider font-mono">{t.welcomeMethod1}</h4>
                  <p className="text-[11px] pt-1">
                    {t.welcomeMethod1Desc}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="p-1.5 h-fit bg-emerald-500/10 text-emerald-450 rounded-lg shrink-0">
                  <span className="font-bold text-xs font-mono">3D</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider font-mono">{t.welcomeMethod2}</h4>
                  <p className="text-[11px] pt-1">
                    {t.welcomeMethod2Desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Section Newsletter - MASQUÉE TEMPORAIREMENT - Remplacée par un rappel d'éthique et de rigueur scientifique */}
            <div className="bg-gradient-to-r from-slate-950/60 via-slate-900 to-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-2.5" id="algo-ethical-banner">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 font-mono uppercase tracking-wide">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {ethicalTitleTrans[lang] || ethicalTitleTrans.EN}
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                {t.welcomeConceptDesc}
              </p>
            </div>

            {/* Actions de pied de page */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
              {/* Option ne plus afficher */}
              <label className="flex items-center gap-2 text-[11px] text-slate-400 select-none hover:text-slate-350 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-3.5 h-3.5 accent-blue-500 rounded border-slate-700 bg-slate-900"
                  id="dont-show-again-checkbox"
                />
                {dontShowAgainTrans[lang] || dontShowAgainTrans.EN}
              </label>

              <button
                onClick={handleClose}
                className="text-xs font-bold bg-slate-900 border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-lg text-slate-200 transition-all font-mono hover:text-white cursor-pointer"
                id="marketing-modal-dismiss-btn"
              >
                {t.enterBtn} →
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
