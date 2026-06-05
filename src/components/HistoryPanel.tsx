/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSimulateurStore } from "../store/useSimulateurStore";
import { TRANSLATIONS } from "../utils/translations";
import { Trash2, Calendar, Database, X, ShieldCheck, ChevronDown, ChevronLeft, ChevronRight, Check, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function HistoryPanel() {
  const { tirages, supprimerTirage, lang } = useSimulateurStore();
  const t = TRANSLATIONS[lang];
  const MOIS_NOMS = t.months;
  
  // Popups & interaction states
  const [isOpenSources, setIsOpenSources] = useState<boolean>(false);
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  const [filterDate, setFilterDate] = useState<string>("");
  
  // Lazy-loading pagination state
  const [visibleCount, setVisibleCount] = useState<number>(25);
  
  // Calendrier interne
  const [calMonth, setCalMonth] = useState<number>(5); // Juin par défaut
  const [calYear, setCalYear] = useState<number>(2026); // 2026 par défaut

  // Références d'écouteurs et défilements
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Set pour une recherche ultra-rapide des dates de tirages
  const datesAvecTirages = useMemo(() => {
    return new Set(tirages.map((t) => t.date));
  }, [tirages]);

  // Aligner le calendrier sur le tirage le plus récent à l'initialisation
  useEffect(() => {
    if (tirages.length > 0) {
      const plusRecentStr = tirages[0].date;
      const parts = plusRecentStr.split("-");
      if (parts.length === 3) {
        setCalMonth(parseInt(parts[1], 10) - 1);
        setCalYear(parseInt(parts[0], 10));
      }
    }
  }, [tirages]);

  // Gestion du clic en dehors pour fermer le calendrier de manière fluide
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpenCalendar(false);
      }
    }
    if (isOpenCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenCalendar]);

  // Chercher l'index du tirage sélectionné dans l'historique complet
  const selectedIndex = useMemo(() => {
    if (!filterDate) return -1;
    return tirages.findIndex((t) => t.date === filterDate);
  }, [tirages, filterDate]);

  // S'assurer que le tirage sélectionné et ses voisins temporels immédiats soient inclus dans l'affichage visible
  useEffect(() => {
    if (selectedIndex !== -1) {
      const targetVisible = Math.max(visibleCount, selectedIndex + 10);
      setVisibleCount(targetVisible);
      
      // Auto-scroll doux vers le tirage sélectionné une fois rendu
      setTimeout(() => {
        if (selectedItemRef.current) {
          selectedItemRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }, 300);
    }
  }, [selectedIndex, filterDate]);

  // Filtrer la portion finale des tirages à rendre en prenant en compte le lazy load actif
  const renderedTirages = useMemo(() => {
    return tirages.slice(0, visibleCount);
  }, [tirages, visibleCount]);

  // Charger plus d'éléments de l'historique de l'EuroMillions (scrolling dans le temps)
  const chargerPlusElements = () => {
    setVisibleCount((prev) => Math.min(tirages.length, prev + 25));
  };

  // --- LOGIQUE DU CALENDRIER GRAPHIQUE INTERACTIF ---
  const joursDuMois = useMemo(() => {
    // Premier jour du mois
    const debutDate = new Date(calYear, calMonth, 1);
    // Index du premier jour de la semaine (Lundi-Dimanche corrigé : Lundi = 0, Dimanche = 6)
    let firstDayIdx = debutDate.getDay();
    firstDayIdx = firstDayIdx === 0 ? 6 : firstDayIdx - 1;

    // Nombre de jours total dans le mois sélectionné
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();

    // Remplir les jours
    const totalSlots: { d: number | null; dateStr: string; exists: boolean }[] = [];
    
    // Remplir de cases vides avant le début du mois
    for (let i = 0; i < firstDayIdx; i++) {
      totalSlots.push({ d: null, dateStr: "", exists: false });
    }

    // Remplir les jours du mois
    for (let d = 1; d <= totalDays; d++) {
      const yyyy = calYear;
      const mm = String(calMonth + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const exists = datesAvecTirages.has(dateStr);
      totalSlots.push({ d, dateStr, exists });
    }

    return totalSlots;
  }, [calMonth, calYear, datesAvecTirages]);

  const allerAuMoisPrecedent = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const allerAuMoisSuivant = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  // Liste des années disponibles de l'historique FDJ (2016 à aujourd'hui)
  const anneesDisponibles = Array.from({ length: 11 }, (_, i) => 2016 + i);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg space-y-4" id="history-panel-container">
      
      {/* En-tête */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <Database className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">{t.historyTitle}</h3>
            <p className="text-[11px] text-slate-400">{t.historySubtitle}</p>
          </div>
        </div>

        {/* Boutons d'actions ergonomiques épurés */}
        <div className="flex items-center gap-2 relative">
          
          {/* Nouveau bouton "Sources" - Icône seule épurée et stylisée */}
          <button
            onClick={() => setIsOpenSources(true)}
            className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-slate-500 hover:text-emerald-400 text-slate-400 rounded-xl transition-all cursor-pointer relative group"
            id="btn-sources-popup-trigger"
            title={t.sourcesBtn}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="absolute bottom-full right-0 mb-2 invisible group-hover:visible bg-slate-950 text-slate-200 text-[10px] uppercase tracking-wider font-mono font-bold py-1 px-2.5 rounded-md border border-slate-700 whitespace-nowrap shadow-lg z-25">
              {t.sourcesBtn}
            </span>
          </button>
          
          {/* Bouton Calendrier Interactif avec popover personnalisé */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => setIsOpenCalendar(!isOpenCalendar)}
              className={`p-2.5 border rounded-xl transition-all cursor-pointer flex items-center justify-center relative group ${
                isOpenCalendar || filterDate
                  ? "bg-blue-600/10 text-blue-400 border-blue-500/50"
                  : "bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-400 hover:bg-slate-850"
              }`}
              title={t.calendarTooltip}
              id="calendar-popover-trigger"
            >
              <Calendar className="w-4 h-4" />
              <span className="absolute bottom-full right-0 mb-2 invisible group-hover:visible bg-slate-950 text-slate-200 text-[10px] uppercase tracking-wider font-mono font-bold py-1 px-2.5 rounded-md border border-slate-700 whitespace-nowrap shadow-lg z-25">
                {t.calendarTooltip}
              </span>
            </button>

            {/* Popover Calendrier Customisé */}
            <AnimatePresence>
              {isOpenCalendar && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2.5 w-72 bg-slate-950 border border-slate-700 rounded-2xl p-4 shadow-2xl z-30 space-y-3"
                  id="custom-calendar-popover"
                >
                  {/* Entête navigation du mois & année */}
                  <div className="flex items-center justify-between gap-1">
                    <button
                      onClick={allerAuMoisPrecedent}
                      className="p-1 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {/* Libellé Mois + Sélecteur d'Année ultra ergonomique */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold font-mono text-slate-200 uppercase tracking-wide">
                        {MOIS_NOMS[calMonth]}
                      </span>
                      <select
                        value={calYear}
                        onChange={(e) => setCalYear(parseInt(e.target.value, 10))}
                        className="bg-slate-900 border border-slate-750 rounded px-1.5 py-0.5 text-[11px] text-blue-400 font-mono font-bold focus:outline-none cursor-pointer"
                      >
                        {anneesDisponibles.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={allerAuMoisSuivant}
                      className="p-1 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Jours abrégés */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[9px] uppercase font-bold text-slate-500 font-mono border-b border-slate-800 pb-1">
                    {t.daysAbbr.map((dAbbr) => (
                      <span key={dAbbr}>{dAbbr}</span>
                    ))}
                  </div>

                  {/* Grille des jours */}
                  <div className="grid grid-cols-7 gap-1">
                    {joursDuMois.map((dayObj, index) => {
                      if (dayObj.d === null) {
                        return <div key={`empty-${index}`} className="w-8 h-7" />;
                      }

                      const isCurrentFilter = dayObj.dateStr === filterDate;
                      
                      return (
                        <button
                          key={`day-${index}`}
                          disabled={!dayObj.exists}
                          onClick={() => {
                            setFilterDate(dayObj.dateStr);
                            setIsOpenCalendar(false); // fermer après sélection
                          }}
                          className={`w-8 h-7 text-[11px] font-mono rounded flex items-center justify-center font-bold transition-all relative ${
                            dayObj.exists
                              ? isCurrentFilter
                                ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer ring-1 ring-blue-400 shadow-md scale-102"
                                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-350 cursor-pointer border border-emerald-500/20"
                              : "text-slate-700 opacity-20 pointer-events-none select-none border border-transparent"
                          }`}
                          title={
                            dayObj.exists
                              ? `Draw ${dayObj.dateStr}`
                              : `No draw ${dayObj.dateStr}`
                          }
                        >
                          {dayObj.d}
                          {/* Petit repère de point sous le repère de tirage disponible */}
                          {dayObj.exists && !isCurrentFilter && (
                            <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Légende du calendrier */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-2 px-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-emerald-500/15 border border-emerald-500/30"></span> {t.legendLoto}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-slate-900 opacity-30"></span> {t.legendEmpty}
                    </span>
                    <button
                      onClick={() => {
                        setFilterDate("");
                        setIsOpenCalendar(false);
                      }}
                      className="text-blue-450 hover:underline hover:text-blue-400 font-bold"
                    >
                      {t.resetFilter}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {filterDate && (
            <button
              onClick={() => setFilterDate("")}
              className="p-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-xl text-xs font-mono font-bold leading-none transition-all cursor-pointer shrink-0"
              title="Reset"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Message descriptif du filtre courant */}
      {filterDate && (
        <div className="flex items-center justify-between p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
            <span>{t.targetDate} : <strong>{filterDate}</strong></span>
          </div>
          <button 
            onClick={() => setFilterDate("")}
            className="text-[10px] font-mono hover:underline text-blue-400 font-bold"
          >
            {t.maskFocus}
          </button>
        </div>
      )}

      {/* Liste des Tirages Récents */}
      <div className="overflow-hidden rounded-xl border border-slate-700 relative">
        <div 
          ref={listRef}
          className="max-h-80 overflow-y-auto divide-y divide-slate-700 pr-1 bg-slate-900/10" 
          id="draws-scrollable-container"
        >
          {renderedTirages.map((tirage) => {
            const isSelected = tirage.date === filterDate;
            return (
              <div
                key={tirage.id}
                ref={isSelected ? selectedItemRef : null}
                className={`p-3 flex flex-col sm:flex-row items-center justify-between gap-3 transition-all relative ${
                  isSelected 
                    ? "bg-blue-600/15 border-l-4 border-l-blue-500 border-y border-y-blue-500/40 shadow-inner scale-[1.01] z-10" 
                    : "bg-slate-900/10 hover:bg-slate-900/40"
                }`}
              >
                {/* Visual Glow local pour le highlight */}
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-400/5 pointer-events-none animate-pulse rounded" />
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-slate-400 shrink-0">
                  <Calendar className={`w-3.5 h-3.5 ${isSelected ? "text-blue-400 animate-bounce" : "text-blue-550"}`} />
                  <span className={`text-[11px] font-mono leading-none font-bold ${isSelected ? "text-blue-300" : ""}`}>
                    {tirage.date}
                  </span>
                  {isSelected && (
                    <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[9px] px-1.5 rounded-full font-mono font-black uppercase leading-none py-0.5 animate-pulse">
                      Focus
                    </span>
                  )}
                </div>

                {/* Résultats */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {/* Numéros */}
                  {tirage.numeros.map((n, idx) => (
                    <span
                      key={idx}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold font-mono text-[11px] sm:text-xs flex items-center justify-center border shadow-sm transition-all ${
                        isSelected 
                          ? "bg-slate-900 text-blue-300 border-blue-500/50 scale-[1.05]" 
                          : "bg-slate-800 text-slate-200 border-slate-700"
                      }`}
                    >
                      {n < 10 ? `0${n}` : n}
                    </span>
                  ))}
                  
                  {/* Séparateur */}
                  <span className="text-slate-600 text-xs font-bold leading-none px-0.5">•</span>

                  {/* Étoiles */}
                  {tirage.etoiles.map((star, idx) => (
                    <span
                      key={idx}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-extrabold font-mono text-[11px] sm:text-xs flex items-center justify-center shadow-sm transition-all ${
                        isSelected 
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/50 scale-[1.05]" 
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {star < 10 ? `0${star}` : star}
                    </span>
                  ))}
                </div>

                {/* Suppression */}
                <button
                  onClick={() => supprimerTirage(tirage.id)}
                  className="text-slate-505 hover:text-red-450 p-1.5 hover:bg-slate-800/80 rounded transition-all self-end sm:self-auto cursor-pointer"
                  title="Supprimer ce tirage de la base"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {/* Bouton de lazy loading à la fin du défilement */}
          {visibleCount < tirages.length && (
            <div className="p-3 text-center bg-slate-900/30">
              <button
                onClick={chargerPlusElements}
                className="w-full text-center py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-mono font-bold rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1"
                id="btn-lazyload-draws"
              >
                <ChevronDown className="w-4 h-4 animate-bounce" />
                {t.lazyLoadBtn} ({tirages.length - visibleCount} restants)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* POPUP DE PRÉSENTATION DES SOURCES DE DONNÉES CO-OCCURRENCES & TIRAGES */}
      <AnimatePresence>
        {isOpenSources && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" id="sources-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 10 }}
              className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5"
              id="sources-modal-card"
            >
              {/* Fermer */}
              <button
                onClick={() => setIsOpenSources(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Database className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">{t.sourcesTitle}</h3>
                  <p className="text-[11px] text-slate-400">{t.sourcesMeta}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                
                {/* Source FDJ */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>{t.source1Title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {t.source1Desc}
                  </p>
                  <div className="pt-1">
                    <a
                      href="https://www.fdj.fr/jeux-de-tirage/euromillions-my-million/historique"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider font-mono bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg hover:bg-blue-500/20"
                    >
                      <span>{lang === "FR" ? "Accéder à l'historique officiel FDJ" : lang === "EN" ? "Access Official FDJ History" : lang === "ES" ? "Historial oficial FDJ" : "Historial oficial FDJ"}</span>
                      <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  </div>
                </div>

                {/* Source API */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{t.source2Title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {t.source2Desc}
                  </p>
                </div>

                {/* Intégrité mathématique */}
                <div className="flex items-start gap-2 text-[10px] text-slate-550 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40 leading-snug">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {t.integrityDesc}
                  </span>
                </div>

              </div>

              {/* Bouton de Fermeture */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setIsOpenSources(false)}
                  className="w-full text-center py-2.5 bg-blue-650 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10"
                >
                  {t.gotIt}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
