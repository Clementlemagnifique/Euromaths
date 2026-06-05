/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Tirage {
  id: string; // Identifiant unique
  date: string; // Date du tirage (format YYYY-MM-DD)
  numeros: number[]; // Tableau de 5 numéros (1 à 50), triés
  etoiles: number[]; // Tableau de 2 étoiles (1 à 12), triées
}

export interface Statistiques {
  // Fréquence d'apparition de chaque numéro (1 à 50)
  frequenceNumeros: Record<number, number>;
  // Fréquence d'apparition de chaque étoile (1 à 12)
  frequenceEtoiles: Record<number, number>;
  // Écart (nombre de tirages écoulés depuis le dernier tirage de cet élément)
  ecartNumeros: Record<number, number>;
  ecartEtoiles: Record<number, number>;
  // Matrice de co-occurrence : clé sous format "numA-numB" (avec numA < numB) -> nombre d'apparitions communes
  coOccurrenceNumeros: Record<string, number>;
  // Pourcentage de répartition Pair/Impair dans l'historique
  evenOddRatio: { even: number; odd: number };
  // Moyenne de la somme des numéros
  averageSum: number;
}

export interface WeightsConfig {
  weightFrequence: number; // Coefficient de poids pour la fréquence (0 à 1)
  weightEcart: number; // Coefficient de poids pour l'écart (0 à 1)
  coOccurrenceBonus: number; // Coefficient de bonus pour la co-occurrence (e.g. 1.5 pour multiplier les chances du partenaire favori)
}

export interface CombinaisonGeneree {
  numeros: number[]; // Les 5 numéros tirés (triés)
  etoiles: number[]; // Les 2 étoiles tirées (triées)
  poidsInitiaux: Record<number, number>; // Les poids calculés avant le tirage pour l'explication visuelle
  analysePoids: string[]; // Historique de l'étape de tirage pour l'explication interactive locale
}
