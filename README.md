# EuroMaths 🌀 — Simulateur Prédictif EuroMillions & Modélisation Stochastique

🔗 **Site Web de Démo :** [https://euromaths.vercel.app/](https://euromaths.vercel.app/)

EuroMaths est un outil d'aide à la décision mathématique de niveau industriel dédié à la modélisation et à l'analyse probabiliste des tirages de l'EuroMillions. Utilisant des calculs d'affinité matricielle et une distribution stochastique corrigée, l'application s'affranchit des générateurs pseudo-aléatoires uniformes conventionnels pour proposer des combinaisons optimisées fondées sur l'historique officiel certifié de la FDJ (2016 - 2026).

---

## 🚀 Fonctionnalités Majeures

- **Modelles de Rigueur Temporelle (Mode Expert)** : Activez des curseurs stochastiques d'entropie (bruit), de température stabilisante, et de pénalités de distance consécutive pour affiner le filtrage bayésien.
- **Matrice de Co-occurrence Interactive 50x50** : Simulation dynamique des affinités de paires d'après les tirages passés. Alterne en temps réel entre le graphique traditionnel des complices et un rendu de matrice heatmap 50x50 ultra-performant dessiné par Canvas.
- **Topologie Céleste Orbitale 3D** : Représentation tridimensionnelle interactive (projection de Fibonacci en perspective rotative sur Canvas) des 50 numéros où les sphères sont proportionnelles aux fréquences passées et dessinant le polygone vectoriel de la constellation de la combinaison simulée.
- **API Publique Full-Stack** : Intègre un serveur d'API Express capable de générer des combinaisons, exposer la matrice, simuler des backtests historiques et servir le jeu complet de tirages réels d'époque.

---

## 🔌 API Publique (Endpoints Express)

Le moteur probabiliste d'EuroMaths est exposé publiquement via des endpoints REST standard :

1. **`GET /api/history`** : Renvoie le jeu complet de données chronologiques d'EuroMillions de 2016 à aujourd'hui au format JSON.
2. **`GET /api/cooccurrence[?selected=X]`** : Retourne la table complète des coefficients de co-occurrences conjointe ou filtre les meilleurs partenaires pour le numéro `X` spécifié.
3. **`GET / POST /api/generate`** : Génère une grille intelligente optimale. Paramètres acceptés en corps de requête/requête : `weightFrequence`, `weightEcart`, `coOccurrenceBonus`, `entropyNoise`, `distancePenalty`, `temperatureScale`.
4. **`POST /api/backtest`** : Exécute une simulation croisée sur les `nbDrawsToTest` derniers tirages passés de manière intègre (comparaison simultanée du modèle customisé vs Hasard Pur uniforme).

---

## 🛠️ Stack Technique

- **Framework principal** : React 18+ orchestré sous un serveur full-stack Express + Middleware Vite
- **Compilateur Backend & Bundler** : `esbuild` & `tsx` pour empaqueter un serveur CommonJS `dist/server.cjs` léger
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
