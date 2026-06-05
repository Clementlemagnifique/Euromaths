# Feuille de Route - Évolutions EuroMaths 🌀

Ce document détaille la planification des évolutions industrielles d'EuroMaths. Chaque module est conçu pour être intégré de manière incrémentale, sans régression, tout en préservant le design d'excellence du simulateur.

---

### 1. Mode Expert (Compact & Amovible) — ✅ ENTIÈREMENT DÉPLOYÉ & INTÉGRÉ
Un panneau activable via un simple commutateur (Toggle) discret situé dans le panneau de contrôle de génération ou dans le header. Il donne accès à des outils analytiques avancés sans encombrer l'Iframe ou l'écran mobile.
- **Réglages avancés :** Sliders de correction stochastique fine (poids de dérive, coefficient d'effet de chaleur/température calibrée, pénalisation de proximité de distance directe).
- **Matrices 50x50 Interactives :** Une vue matricielle miniature sur Canvas qui met en évidence les corrélations de co-occurrence de chaque numéro de manière interactive.
- **Heatmaps :** Carte thermique interactive bidimensionnelle (générée par Canvas au sein de la matrice interactives) révélant l'intensité de sortie des paires chaudes et froides.
- **Visualisation 3D :** Représentation tridimensionnelle interactive (projection de Fibonacci en perspective rotative sur Canvas) des 50 numéros où les sphères sont proportionnelles aux fréquences passées et dessinant le polygone vectoriel de la constellation de la combinaison simulée.

---

### 2. API Publique (Exposée via routes Express) — ✅ ENTIÈREMENT DÉPLOYÉ & INTÉGRÉ
Exposition du cœur algorithmique sous forme d'API propre, documentée et prête pour l'intégration.
- **`GET /api/generate` :** Retourne une combinaison optimisée basée sur des paramètres d'impact stochastique passés en Query Params.
- **`GET /api/cooccurrence` :** Calcule les affinités et compagnons historiques d'un numéro donné.
- **`POST /api/backtest` :** Analyse l'historique et valide de manière rigoureuse une combinaison par rapport aux tirages passés.
- **`GET /api/history` :** Liste et filtre l'historique des tirages enregistrés en mémoire vive ou en cache.

---

### 3. Version Mobile Optimisée — ✅ ENTIÈREMENT DÉPLOYÉ & INTÉGRÉ
Ajustement de l'UI dense de l'application complexe pour garantir une navigabilité et une lisibilité parfaites sur les smartphones.
- **Design de cartes adaptatives :** Ajustement des grilles d'affichage multi-colonnes en une seule colonne de manière fluide avec de généreux padding.
- **Balles réactives tactiles :** Optimisation des boutons de l'Iframe pour dépasser les $44\text{px}$ requis pour une prise en main tactile fluide sans faux clics.
- **Navigation par onglets ou accordéons fluides :** Possibilité de réduire ou de replier des sections d'analyse de pondération et de synergie via des menus fermés par défaut sur mobile.
