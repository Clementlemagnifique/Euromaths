/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tirage, Statistiques, WeightsConfig, CombinaisonGeneree } from "../types";
import { HISTORIQUE_EUROMILLIONS_REEL } from "../data/euroMillionsData";

// Utilise la base de données réelle complète issue de 2016 à aujourd'hui
export const TIRAGES_HISTORIQUES_MOCK: Tirage[] = HISTORIQUE_EUROMILLIONS_REEL;

/**
 * Calcule les statistiques à partir de l'historique des tirages.
 * @param tirages Historique des tirages, ordonné du plus récent au plus ancien ou arbitraire.
 */
export function calculerStatistiques(tirages: Tirage[]): Statistiques {
  // 1. Initialiser les compteurs
  const frequenceNumeros: Record<number, number> = {};
  const frequenceEtoiles: Record<number, number> = {};
  const ecartNumeros: Record<number, number> = {};
  const ecartEtoiles: Record<number, number> = {};
  const coOccurrenceNumeros: Record<string, number> = {};

  for (let i = 1; i <= 50; i++) {
    frequenceNumeros[i] = 0;
    ecartNumeros[i] = tirages.length; // Écart max par défaut
  }

  for (let i = 1; i <= 12; i++) {
    frequenceEtoiles[i] = 0;
    ecartEtoiles[i] = tirages.length; // Écart max par défaut
  }

  // Trier les tirages par date décroissante pour calculer les écarts correctement
  const tiragesTries = [...tirages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let totalNumerosEven = 0;
  let totalNumerosOdd = 0;
  let sommesAccumulees = 0;

  // 2. Parcourir les tirages pour accumuler les fréquences et les co-occurrences
  tiragesTries.forEach((tirage, index) => {
    // Calcul de parité et somme
    tirage.numeros.forEach((n) => {
      if (n % 2 === 0) totalNumerosEven++;
      else totalNumerosOdd++;
      sommesAccumulees += n;

      frequenceNumeros[n] = (frequenceNumeros[n] || 0) + 1;

      // Calcul de l'écart : index du tirage le plus récent (0-indexé)
      // L'écart réel est le nombre de tirages depuis le dernier tirage.
      // Donc si c'est sorti au tirage le plus récent (index 0), l'écart est l'index 0.
      if (ecartNumeros[n] === tirages.length || ecartNumeros[n] > index) {
        ecartNumeros[n] = index;
      }
    });

    tirage.etoiles.forEach((e) => {
      frequenceEtoiles[e] = (frequenceEtoiles[e] || 0) + 1;

      if (ecartEtoiles[e] === tirages.length || ecartEtoiles[e] > index) {
        ecartEtoiles[e] = index;
      }
    });

    // Construire la matrice de co-occurrence
    const nums = [...tirage.numeros].sort((a, b) => a - b);
    for (let x = 0; x < nums.length; x++) {
      for (let y = x + 1; y < nums.length; y++) {
        const clé = `${nums[x]}-${nums[y]}`;
        coOccurrenceNumeros[clé] = (coOccurrenceNumeros[clé] || 0) + 1;
      }
    }
  });

  const totalNumElements = tirages.length ? tirages.length * 5 : 1;
  const evenRatio = Math.round((totalNumerosEven / totalNumElements) * 100);
  const oddRatio = 100 - evenRatio;

  const averageSum = tirages.length ? Math.round(sommesAccumulees / tirages.length) : 0;

  return {
    frequenceNumeros,
    frequenceEtoiles,
    ecartNumeros,
    ecartEtoiles,
    coOccurrenceNumeros,
    evenOddRatio: { even: evenRatio, odd: oddRatio },
    averageSum
  };
}

/**
 * Normalise un ensemble de valeurs décimales pour qu'elles s'étendent de 0 à 1.
 */
function normaliserRecord(record: Record<number, number>, minVal: number, maxVal: number): Record<number, number> {
  const normalises: Record<number, number> = {};
  const diff = maxVal - minVal || 1;
  
  Object.keys(record).forEach((key) => {
    const numericKey = parseInt(key, 10);
    const value = record[numericKey];
    normalises[numericKey] = (value - minVal) / diff;
  });

  return normalises;
}

/**
 * Effectue un tirage aléatoire pondéré (Weighted Random Selection) à partir d'un ensemble de poids.
 * @param candidats Liste des candidats (e.g. numéros encore disponibles)
 * @param poids Map associant chaque candidat à son poids actuel
 */
function tirageUnitairePondere(candidats: number[], poids: Record<number, number>): number {
  let sommePoids = 0;
  candidats.forEach((c) => {
    sommePoids += poids[c] || 0;
  });

  // Sécurité si les poids cumulés sont à 0
  if (sommePoids <= 0) {
    const randomIndex = Math.floor(Math.random() * candidats.length);
    return candidats[randomIndex];
  }

  const pointAleatoire = Math.random() * sommePoids;
  let accumulation = 0;

  for (let i = 0; i < candidats.length; i++) {
    const c = candidats[i];
    accumulation += poids[c] || 0;
    if (pointAleatoire <= accumulation) {
      return c;
    }
  }

  return candidats[candidats.length - 1];
}

/**
 * Algorithme principal de génération d'une combinaison intelligente EuroMillions (5 numéros + 2 étoiles)
 * @param historique Liste des tirages pour calculer les statistiques
 * @param config Configuration des poids (Fréquence vs Écart + Bonus co-occurrence)
 */
export function genererCombinaisonIntelligente(
  historique: Tirage[],
  config: WeightsConfig
): CombinaisonGeneree {
  // S'il n'y a pas d'historique, tirer purement de façon classique équitable
  if (historique.length === 0) {
    const numeros: number[] = [];
    while (numeros.length < 5) {
      const n = Math.floor(Math.random() * 50) + 1;
      if (!numeros.includes(n)) sortedInsert(numeros, n);
    }
    const etoiles: number[] = [];
    while (etoiles.length < 2) {
      const e = Math.floor(Math.random() * 12) + 1;
      if (!etoiles.includes(e)) sortedInsert(etoiles, e);
    }
    return {
      numeros,
      etoiles,
      poidsInitiaux: {},
      analysePoids: ["Aucun historique disponible, tirage aléatoire uniforme réalisé."]
    };
  }

  // 1. Calculer les statistiques actuelles
  const stats = calculerStatistiques(historique);

  // 2. Normalisation des données pour les équilibrer dans la formule des poids initiaux
  // Numéros
  const valsFreqNum = Object.values(stats.frequenceNumeros);
  const minFreqNum = Math.min(...valsFreqNum);
  const maxFreqNum = Math.max(...valsFreqNum);
  const freqNumerosNorm = normaliserRecord(stats.frequenceNumeros, minFreqNum, maxFreqNum);

  const valsEcartNum = Object.values(stats.ecartNumeros);
  const minEcartNum = Math.min(...valsEcartNum);
  const maxEcartNum = Math.max(...valsEcartNum);
  const ecartNumerosNorm = normaliserRecord(stats.ecartNumeros, minEcartNum, maxEcartNum);

  // Étoiles
  const valsFreqEtoiles = Object.values(stats.frequenceEtoiles);
  const minFreqEtoile = Math.min(...valsFreqEtoiles);
  const maxFreqEtoile = Math.max(...valsFreqEtoiles);
  const freqEtoilesNorm = normaliserRecord(stats.frequenceEtoiles, minFreqEtoile, maxFreqEtoile);

  const valsEcartEtoiles = Object.values(stats.ecartEtoiles);
  const minEcartEtoile = Math.min(...valsEcartEtoiles);
  const maxEcartEtoile = Math.max(...valsEcartEtoiles);
  const ecartEtoilesNorm = normaliserRecord(stats.ecartEtoiles, minEcartEtoile, maxEcartEtoile);

  // 3. Calculer les poids initiaux de tous les numéros (1 à 50)
  const poidsNumeros: Record<number, number> = {};
  const poidsInitiauxExplication: Record<number, number> = {};

  for (let n = 1; n <= 50; n++) {
    const fNorm = freqNumerosNorm[n] !== undefined ? freqNumerosNorm[n] : 0.5;
    const eNorm = ecartNumerosNorm[n] !== undefined ? ecartNumerosNorm[n] : 0.5;

    // Formule combinée : d'autant plus de poids que le curseur est élevé sur la statistique
    const poidsBase = config.weightFrequence * fNorm + config.weightEcart * eNorm + 0.1; // 0.1 de poids plancher
    
    // Application de la calibration de température (si présente)
    let poidsAjuste = poidsBase;
    if (config.temperatureScale !== undefined) {
      const exp = 1.6 - config.temperatureScale * 1.2; // donne un exposant d'ajustement fluide
      poidsAjuste = Math.pow(poidsBase, exp);
    }

    // Application du bruit stochastique d'inertie (si présent)
    if (config.entropyNoise !== undefined && config.entropyNoise > 0) {
      const randFactor = 1.0 + (Math.random() - 0.5) * config.entropyNoise;
      poidsAjuste = poidsAjuste * randFactor;
    }

    const poidsFinal = Math.max(0.01, poidsAjuste);
    poidsNumeros[n] = poidsFinal;
    poidsInitiauxExplication[n] = Math.round(poidsFinal * 100) / 100; // Garder une version arrondie pour l'UI
  }

  // 4. Tirage des 5 numéros l'un après l'autre avec mise à jour dynamique des poids (Co-occurrence)
  const numerosDisponibles = Array.from({ length: 50 }, (_, i) => i + 1);
  const numerosTirés: number[] = [];
  const logsAnalyse: string[] = [];

  logsAnalyse.push(
    `Initialisation - Formule : [${config.weightFrequence}] * Fréquence + [${config.weightEcart}] * Écart`
  );

  while (numerosTirés.length < 5) {
    const etapeNum = numerosTirés.length + 1;
    
    // Tirage du numéro
    const selection = tirageUnitairePondere(numerosDisponibles, poidsNumeros);
    
    // Enlever du pool
    const idx = numerosDisponibles.indexOf(selection);
    if (idx > -1) {
      numerosDisponibles.splice(idx, 1);
    }
    
    numerosTirés.push(selection);
    logsAnalyse.push(`Tirage #${etapeNum} : Numéro ${selection} sélectionné.`);

    // Appliquer une pénalité de proximité (distance) pour limiter les séquences successives trop rapprochées
    if (config.distancePenalty !== undefined && config.distancePenalty > 0) {
      numerosDisponibles.forEach((candidat) => {
        if (Math.abs(candidat - selection) === 1) {
          const poidsPrecedent = poidsNumeros[candidat] || 0.1;
          poidsNumeros[candidat] = poidsPrecedent * (1.0 - config.distancePenalty * 0.75);
        }
      });
    }

    // Si on a d'autres numéros à tirer, appliquer le bonus de co-occurrence de ce numéro sur les restants
    if (numerosTirés.length < 5) {
      const cooccurrencesDeSelection: { num: number; cpt: number }[] = [];
      
      numerosDisponibles.forEach((candidat) => {
        const numMin = Math.min(selection, candidat);
        const numMax = Math.max(selection, candidat);
        const clé = `${numMin}-${numMax}`;
        const count = stats.coOccurrenceNumeros[clé] || 0;
        
        if (count > 0) {
          cooccurrencesDeSelection.push({ num: candidat, cpt: count });
        }
      });

      if (cooccurrencesDeSelection.length > 0) {
        const maxCoCount = Math.max(...cooccurrencesDeSelection.map((item) => item.cpt));
        
        // Appliquer le bonus multiplicatif
        cooccurrencesDeSelection.forEach((item) => {
          const ratioCo = item.cpt / (maxCoCount || 1);
          // Multiplicateur : 1.0 + (bonus ajusté * taux de co-occurrence normalisé)
          const multiplicateur = 1.0 + config.coOccurrenceBonus * ratioCo;
          const poidsPrecedent = poidsNumeros[item.num];
          poidsNumeros[item.num] = poidsPrecedent * multiplicateur;
        });

        // Logger les plus grandes affinités impactées par ce tirage
        const topAffinites = cooccurrencesDeSelection
          .sort((a, b) => b.cpt - a.cpt)
          .slice(0, 3)
          .map((i) => `${i.num}(x${i.cpt})`)
          .join(", ");
        
        if (topAffinites) {
          logsAnalyse.push(
            `↗️ Synergie co-occurrence avec ${selection} : Poids boostés pour [${topAffinites}] (Bonus max +${Math.round(config.coOccurrenceBonus * 100)}%)`
          );
        }
      }
    }
  }

  // Trier les numéros générés pour l'affichage final
  numerosTirés.sort((a, b) => a - b);

  // 5. Tirage des 2 étoiles (de 1 à 12, pas de co-occurrence stricte nécessaire pour seulement 2 étoiles mais pondération par Fréquence / Écart)
  const etoilesDisponibles = Array.from({ length: 12 }, (_, i) => i + 1);
  const poidsEtoiles: Record<number, number> = {};

  for (let e = 1; e <= 12; e++) {
    const fNorm = freqEtoilesNorm[e] !== undefined ? freqEtoilesNorm[e] : 0.5;
    const eNorm = ecartEtoilesNorm[e] !== undefined ? ecartEtoilesNorm[e] : 0.5;
    
    poidsEtoiles[e] = config.weightFrequence * fNorm + config.weightEcart * eNorm + 0.1;
  }

  const etoilesTirees: number[] = [];
  while (etoilesTirees.length < 2) {
    const selectionEtoile = tirageUnitairePondere(etoilesDisponibles, poidsEtoiles);
    const idx = etoilesDisponibles.indexOf(selectionEtoile);
    if (idx > -1) {
      etoilesDisponibles.splice(idx, 1);
    }
    etoilesTirees.push(selectionEtoile);
  }

  etoilesTirees.sort((a, b) => a - b);
  logsAnalyse.push(`Tirage des Étoiles : Étoiles ${etoilesTirees.join(" & ")} sélectionnées.`);

  return {
    numeros: numerosTirés,
    etoiles: etoilesTirees,
    poidsInitiaux: poidsInitiauxExplication,
    analysePoids: logsAnalyse
  };
}

/**
 * Insertion triée simple.
 */
function sortedInsert(arr: number[], val: number) {
  arr.push(val);
  arr.sort((a, b) => a - b);
}
