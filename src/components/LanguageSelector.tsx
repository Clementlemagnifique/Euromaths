/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useSimulateurStore } from "../store/useSimulateurStore";
import { Language } from "../utils/translations";
import { Globe } from "lucide-react";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "FR", label: "Français", flag: "🇫🇷" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "ES", label: "Español", flag: "🇪🇸" },
  { code: "PT", label: "Português", flag: "🇵🇹" }
];

export default function LanguageSelector() {
  const { lang, setLang } = useSimulateurStore();

  return (
    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 sm:p-1 rounded-xl shadow-inner" id="language-selector-widget">
      <div className="flex items-center gap-1 text-slate-500 px-1 sm:px-2 text-[11px] font-mono select-none">
        <Globe className="w-3.5 h-3.5 text-blue-400" />
        <span className="hidden leading-none xl:inline uppercase text-[9px] tracking-wider font-semibold">Lang :</span>
      </div>
      <div className="flex items-center gap-0.5 sm:gap-1">
        {languages.map((l) => {
          const isActive = l.code === lang;
          return (
            <button
              key={l.code}
              id={`lang-btn-${l.code.toLowerCase()}`}
              onClick={() => setLang(l.code)}
              className={`flex items-center gap-0.5 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                isActive
                  ? "bg-blue-600 hover:bg-blue-500 text-white border-blue-500 font-bold shadow-sm shadow-blue-500/20"
                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
              title={l.label}
            >
              <span className="text-[14px]" role="img" aria-label={l.label}>
                {l.flag}
              </span>
              <span className="font-mono text-[10px] uppercase hidden sm:inline">{l.code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
