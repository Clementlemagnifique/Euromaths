# EuroMaths 🌀 — Simulateur Prédictif EuroMillions & Modélisation Stochastique

EuroMaths est un outil d'aide à la décision mathématique de niveau industriel dédié à la modélisation et à l'analyse probabiliste des tirages de l'EuroMillions. Utilisant des calculs d'affinité matricielle et une distribution stochastique corrigée, l'application s'affranchit des générateurs pseudo-aléatoires uniformes conventionnels pour proposer des combinaisons optimisées fondées sur l'historique officiel certifié de la FDJ (2016 - 2026).

---

## 🚀 Fonctionnalités Majeures

- **Modélisation Stochastique Avancée** : Prise en compte du poids combiné de fréquence de sortie et d'écart pour chaque numéro.
- **Matrice de Co-occurrence 50x50** : Simulation dynamique des affinités de paires d'après les tirages passés. Chaque numéro généré adapte instantanément le poids des autres candidats.
- **Vortex Mathématique 3D** : Animation immersive simulant en temps réel la convergence matricielle, les calculs d'entropie probabiliste et l'analyse quantique Monte Carlo.
- **Filtre Chronologique Avancé** : Calendrier intelligent exclusif affichant précisément les jours contenant des tirages enregistrés réels (jours vides grisés / jours de tirages actifs en émeraude).
- **Navigation Temporelle Fluide** : Recherche instantanée de date avec affichage contextuel des tirages voisins et chargement progressif (*lazy-loading*) performant.
- **Souveraineté des Données** : Exécution 100% côté client sans fuite de données privées.

---

## 🛠️ Stack Technique

- **Framework principal** : React 18+ (avec Vite.js pour des temps de compilation optimisés)
- **Langage** : TypeScript Typé Strictement (Rigueur Typée sans contournement `any`)
- **Moteur d'Animation** : Framer Motion (`motion/react`) pour les transitions d'époque de grille et le vortex 3D stochastique
- **Librairie Iconographique** : `lucide-react`
- **Mise en Page & Design** : Tailwind CSS avec des palettes personnalisées sombres (*Slate & Slate-Blue*) et un équilibrage chirurgical des espaces négatifs
- **Gestionnaire d'État** : Zustand (`/src/store`) pour la synchronisation intègre locale des tirages et matrices

---

## 📁 Architecture des Fichiers

```text
├── src/
│   ├── components/
│   │   ├── MathVortexAnimation.tsx   # Animation 3D de calcul stochastique
│   │   ├── CombinationGenerator.tsx  # Générateur de grilles optimales & sliders
│   │   ├── HistoryPanel.tsx          # Calendrier synchronisé en temps réel & historique
│   │   ├── MarketingModal.tsx        # Modal d'accueil & charte de souveraineté
│   │   └── StatisticsPanel.tsx       # Analyse visuelle des densités d'écarts
│   ├── store/
│   │   └── useSimulateurStore.ts     # Store central des tirages EuroMillions FDJ & état
│   ├── App.tsx                       # Layout d'orchestration bento-grid
│   ├── main.tsx                      # Point d'entrée de l'application
│   └── index.css                     # Styles unifiés Tailwind CSS
├── Projet.md                         # Documentation approfondie des blocs fonctionnels
└── README.md                         # Ce manuel explicatif
```

---

## ⚙️ Installation & Lancement

### Prorétis requis
- Node.js (v18 ou supérieur)
- npm ou yarn

### Étape 1 : Cloner le dépôt et installer les dépendances
```bash
npm install
```

### Étape 2 : Lancer le serveur de développement local
```bash
npm run dev
```
Accédez ensuite à l'adresse suivante sur votre navigateur : `http://localhost:3000`.

### Étape 3 : Compiler pour la production
```bash
npm run build
```
La build de production optimisée sera générée dans le dossier `/dist`.

---

## 🧬 Moteur Mathématique : Formule Euclidienne & Logique Conjointe

L'algorithme de calcul applique la formule de combinatoire suivante pour assigner un poids individuel de probabilité $P_i$ à chaque numéro :

$$P_i = w_f \cdot \text{Freq}_i + w_e \cdot \text{Ecart}_i + \sum_{j \in \text{Générés}} \text{CoOccur}(i, j)$$

Où :
- $\text{Freq}_i$ représente le taux de tirage historique stabilisé de la boule $i$.
- $\text{Ecart}_i$ représente le nombre de tirages consécutifs où la boule est restée dans l'urne.
- $\text{CoOccur}(i, j)$ est le coefficient d'affinité conjointe issu de la matrice quadratique.
- $w_f$ et $w_e$ sont contrôlés directement via l'interface utilisateur grâce à des glissières (*sliders*) haute précision pour pondérer l'importance relative de la fréquence face à l'écart actuel.

---

## 📝 Licence

Développé sous licence **Apache-2.0**. Pour toute question ou suggestion d'architecture quant aux modèles stochastiques Bayesian appliqués aux jeux de tirage, n'hésitez pas à ouvrir un rapport d'amélioration ou à consulter le fichier `Projet.md`.
