/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = "FR" | "EN" | "ES" | "PT";

export interface TranslationDict {
  // Common
  activeAlgo: string;
  statsSync: string;
  engineTitle: string;
  moteurStochastique: string;
  adjustModel: string;
  reset: string;
  close: string;
  focus: string;
  empty: string;
  draw: string;
  draws: string;

  // Header & Intro
  headerSlogan: string;
  introTitle: string;
  introDesc: string;
  ethicalTitle: string;
  ethicalDesc: string;

  // CombinationGenerator
  generatorTitle: string;
  generatorSubtitle: string;
  adjustSliders: string;
  weightFreq: string;
  weightFreqDesc: string;
  weightEcart: string;
  weightEcartDesc: string;
  weightCooccur: string;
  weightCooccurDesc: string;
  generateBtn: string;
  generatedSequence: string;
  drawDetails: string;
  drawDetailsDesc: string;
  evenOddTitle: string;
  theoreticalEntropy: string;

  // Backtesting
  backtestTitle: string;
  backtestSubtitle: string;
  simulateRuns: string;
  successRate: string;
  simulating: string;
  simulationComplete: string;

  // Matrix
  matrixTitle: string;
  matrixSubtitle: string;
  matrixHover: string;
  matrixDetail: string;

  // StatsDashboard
  statsTitle: string;
  statsSubtitle: string;
  frequentNumbers: string;
  frequentStars: string;
  coldNumbers: string;
  coldStars: string;
  kpiTotalDraws: string;
  kpiParity: string;
  kpiStoch: string;
  kpiPair: string;
  kpiImpair: string;
  kpiMeanSum: string;
  kpiTheoreticalMed: string;
  statsAffinityTitle: string;
  statsLuckyStars: string;
  statsSynergyTitle: string;
  statsSynergyDesc: string;
  statsDrawsUnit: string;
  statsGapUnit: string;
  statsApparitions: string;
  statsNone: string;

  // HistoryPanel
  historyTitle: string;
  historySubtitle: string;
  sourcesBtn: string;
  calendarTooltip: string;
  calendarTitle: string;
  months: string[];
  daysAbbr: string[];
  legendLoto: string;
  legendEmpty: string;
  resetFilter: string;
  targetDate: string;
  maskFocus: string;
  noDrawFound: string;
  lazyLoadBtn: string;

  // Sources Modal
  sourcesTitle: string;
  sourcesMeta: string;
  source1Title: string;
  source1Desc: string;
  source2Title: string;
  source2Desc: string;
  integrityTitle: string;
  integrityDesc: string;
  gotIt: string;

  // Welcome Modal
  welcomeTitle: string;
  welcomeSubtitle: string;
  welcomeConceptTitle: string;
  welcomeConceptDesc: string;
  welcomeMethod1: string;
  welcomeMethod1Desc: string;
  welcomeMethod2: string;
  welcomeMethod2Desc: string;
  enterBtn: string;

  // Warning Widget
  warningTitle: string;
  warningPoint1: string;
  warningPoint2: string;
  warningPoint3: string;
  preventionTitle: string;
  preventionDesc: string;

  // Footer
  footerCopyright: string;
  footerSlogan: string;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  FR: {
    activeAlgo: "Algorithme Actif",
    statsSync: "Synchronisées",
    engineTitle: "MOTEUR STOCHASTIQUE V1",
    moteurStochastique: "Moteur Stochastique",
    adjustModel: "Ajuster mon modèle →",
    reset: "Réinitialiser",
    close: "Fermer",
    focus: "Focus",
    empty: "Vide",
    draw: "Tirage",
    draws: "Tirages",

    headerSlogan: "Simulateur statistique de l'EuroMillions & algorithme probabiliste de tirage",
    introTitle: "Comment fonctionne notre simulateur EuroMillions de calcul statistique ?",
    introDesc: "Ce simulateur utilise un Tirage Aléatoire Pondéré (Weighted Random Selection). Les numéros qui ont un grand écart ou un taux de sortie élevé reçoivent un poids plus important ajustable via vos curseurs. À chaque numéro virtuellement choisi, la matrice de co-occurrence recalcule en temps réel le poids des numéros complices pour former des binômes historiquement synergiques.",
    ethicalTitle: "Souveraineté & Autonomie de Calcul",
    ethicalDesc: "EuroMaths est un outil d'aide à la décision mathématique sans but commercial. Les algorithmes de modélisation Bayesienne s'exécutent localement. Aucune de vos simulations de grilles optimales n'est collectée ou partagée.",

    generatorTitle: "Générateur Combinatoire",
    generatorSubtitle: "Synthèse stochastique & affinité matricielle",
    adjustSliders: "Ajuster les Curseurs d'Équilibrage",
    weightFreq: "Pondération Fréquence",
    weightFreqDesc: "Priorise les boules ayant le taux de sortie historique le plus élevé.",
    weightEcart: "Pondération Écart",
    weightEcartDesc: "Priorise les boules à fort écart (pas sorties depuis longtemps).",
    weightCooccur: "Synergie de Co-occurrence",
    weightCooccurDesc: "Force l'attraction mutuelle des paires historiquement conjointes.",
    generateBtn: "Générer Séquence Optimale",
    generatedSequence: "Séquence Optimale Générée",
    drawDetails: "Logistique d'extraction",
    drawDetailsDesc: "Historique séquentiel des probabilités à l'instant t",
    evenOddTitle: "Équilibre Pair / Impair",
    theoreticalEntropy: "Entropie Théorique",

    backtestTitle: "Rétro-Ajustement & Backtesting",
    backtestSubtitle: "Simulez une série de calculs sur l'historique et observez le rendement",
    simulateRuns: "Lancer 1 000 simulations massives",
    successRate: "Taux de réussite global",
    simulating: "Calcul des distributions de probabilité...",
    simulationComplete: "Simulation terminée !",

    matrixTitle: "Matrice de Co-occurrence Multi-Variable (50×50)",
    matrixSubtitle: "Analyse d'attraction géométrique des couples de numéros",
    matrixHover: "Survolez une cellule pour révéler l'affinité stochastique",
    matrixDetail: "Association détectée",

    statsTitle: "Densité de Distribution",
    statsSubtitle: "Tableau de bord statistique interactif des urnes",
    frequentNumbers: "Numéros les plus fréquents",
    frequentStars: "Étoiles les plus fréquentes",
    coldNumbers: "Numéros froids",
    coldStars: "Étoiles froides",
    kpiTotalDraws: "Tirages Historiques",
    kpiParity: "Répartition Pair/Impair",
    kpiStoch: "Pondération stochastique",
    kpiPair: "Pairs",
    kpiImpair: "Impairs",
    kpiMeanSum: "Somme Moyenne",
    kpiTheoreticalMed: "Médiane théorique : ~127",
    statsAffinityTitle: "Analyse d'Affinité des Numéros (1 à 50)",
    statsLuckyStars: "Analyse des Lucky Stars (1 à 12)",
    statsSynergyTitle: "Synergie des Binômes (Co-occurrence)",
    statsSynergyDesc: "Voici les paires de numéros ayant la plus forte régularité d'apparition au sein du même tirage historique :",
    statsDrawsUnit: "tirages",
    statsGapUnit: "jours",
    statsApparitions: "Apparitions",
    statsNone: "Aucune co-occurrence identifiée pour l'instant.",

    historyTitle: "Historique Temporel",
    historySubtitle: "Chronologie & Rétrospective FDJ",
    sourcesBtn: "Sources",
    calendarTooltip: "Cibler par Calendrier",
    calendarTitle: "Calendrier EuroMaths",
    months: [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ],
    daysAbbr: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
    legendLoto: "Loto",
    legendEmpty: "Vide",
    resetFilter: "Reset",
    targetDate: "Ciblage",
    maskFocus: "Masquer Focus",
    noDrawFound: "Aucun tirage trouvé pour la date sélectionnée",
    lazyLoadBtn: "Défiler plus loin dans le temps",

    sourcesTitle: "Sources de données de l'EuroMillions",
    sourcesMeta: "Données officielles de l'EuroMillions & algorithme stochastique",
    source1Title: "1. Archives Officielles FDJ (Française des Jeux)",
    source1Desc: "Historique exhaustif de tous les tirages certifiés de l'EuroMillions depuis la révision des règles de Septembre 2016.",
    source2Title: "2. API de synchronisation automatique",
    source2Desc: "Pour garantir l'adéquation parfaite des statistiques au jour le jour, EuroMaths interroge automatiquement et en temps réel l'API REST de référence EuroMillions Pedro Mealha. L'ingestion et la mise à jour se font de manière transparente et dynamique en tâche de fond.",
    integrityTitle: "Intégrité mathématique",
    integrityDesc: "Chaque tirage est stocké de manière intègre et locale. Aucune manipulation arbitraire n'affecte la génération stochastique.",
    gotIt: "J'ai compris, merci !",

    welcomeTitle: "Simulateur EuroMillions",
    welcomeSubtitle: "Simulateur EuroMillions & Analyse Probabiliste",
    welcomeConceptTitle: "Vers une rigueur scientifique contrastant le hasard brut",
    welcomeConceptDesc: "Bienvenue sur EuroMaths. Cet outil n'est pas un oracle de divination, mais un laboratoire mathématique simulant la distribution cumulative des urnes de l'EuroMillions.",
    welcomeMethod1: "Modèle Bayesien multi-facteurs",
    welcomeMethod1Desc: "Modulation fine des probabilités d'extraction basé sur l'échantillonnage de densité des écarts et des occurrences cumulées.",
    welcomeMethod2: "Calcul de corrélation de paires",
    welcomeMethod2Desc: "Analyse stochastique par matrice quadratique 50x50 d'affinités de co-occurrence sur 10 ans de tirages certifiés.",
    enterBtn: "Entrer dans l'espace de calcul",

    warningTitle: "Dénombrement & Hasard",
    warningPoint1: "Chaque tirage au sort reste indépendant de manière absolue. L'exploration historique n'affecte pas l'équiprobabilité physique.",
    warningPoint2: "Le modèle matriciel favorise astucieusement les associations s'étant produites régulièrement.",
    warningPoint3: "Vous pouvez ajouter de faux tirages de démonstration dans l'historique pour valider visuellement l'adaptation immédiate.",
    preventionTitle: "Prévention des Risques :",
    preventionDesc: "Les jeux d'argent présentent des risques d'addiction et d'isolement. Ne jouez que selon vos capacités financières réelles.",

    footerCopyright: "© 2026 EuroMaths Simulator. Développé sous l'égide de la science statistique combinatoire.",
    footerSlogan: "Conception experte et modélisation probabiliste haut de gamme d'aide à la sélection. Non affilié aux opérateurs nationaux officiels de loterie."
  },
  EN: {
    activeAlgo: "Algorithm Active",
    statsSync: "Synchronized",
    engineTitle: "STOCHASTIC ENGINE V1",
    moteurStochastique: "Stochastic Engine",
    adjustModel: "Adjust my model →",
    reset: "Reset",
    close: "Close",
    focus: "Focus",
    empty: "Empty",
    draw: "Draw",
    draws: "Draws",

    headerSlogan: "EuroMillions statistical simulator & weighted stochastic algorithm",
    introTitle: "How does our statistical EuroMillions simulator work?",
    introDesc: "This simulator uses Weighted Random Selection. Numbers with a larger gap or higher historic frequency receive a higher adjustable weight via your sliders. For each virtually selected number, the co-occurrence matrix recalculates key weights in real-time to find historically synergized pairs.",
    ethicalTitle: "Data Sovereignty & Local Computation",
    ethicalDesc: "EuroMaths is a mathematical tool with no commercial intent. Bayesian modeling algorithms run locally in your browser. None of your generated grids are collected or shared.",

    generatorTitle: "Combinatorial Generator",
    generatorSubtitle: "Stochastic synthesis & matrix affinity",
    adjustSliders: "Adjust Balancing Sliders",
    weightFreq: "Frequency Weighting",
    weightFreqDesc: "Prioritizes balls with the highest historical draw frequency.",
    weightEcart: "Gap Weighting",
    weightEcartDesc: "Prioritizes cold balls (not drawn for a long time).",
    weightCooccur: "Co-occurrence Synergy",
    weightCooccurDesc: "Enforces mutual attraction of historically joint pairs.",
    generateBtn: "Generate Optimal Sequence",
    generatedSequence: "Optimal Generated Sequence",
    drawDetails: "Extraction Logistics",
    drawDetailsDesc: "Sequential history of probability weights at instant t",
    evenOddTitle: "Even / Odd Balance",
    theoreticalEntropy: "Theoretical Entropy",

    backtestTitle: "Backtesting & Validation",
    backtestSubtitle: "Simulate a series of draws back-in-time and observe performance",
    simulateRuns: "Run 1,000 massive simulations",
    successRate: "Overall success rate",
    simulating: "Calculating probability distributions...",
    simulationComplete: "Simulation complete!",

    matrixTitle: "Multi-Variable Co-occurrence Matrix (50×50)",
    matrixSubtitle: "Geometric attraction analysis between pairs of numbers",
    matrixHover: "Hover over a cell to reveal stochastic affinity",
    matrixDetail: "Correlation detected",

    statsTitle: "Distribution Density",
    statsSubtitle: "Interactive statistical dashboard of balls and stars",
    frequentNumbers: "Most frequent numbers",
    frequentStars: "Most frequent stars",
    coldNumbers: "Coldest numbers",
    coldStars: "Coldest stars",
    kpiTotalDraws: "Historical Draws",
    kpiParity: "Even/Odd Distribution",
    kpiStoch: "Stochastic weighting",
    kpiPair: "Evens",
    kpiImpair: "Odds",
    kpiMeanSum: "Average Sum",
    kpiTheoreticalMed: "Theoretical median: ~127",
    statsAffinityTitle: "Numbers Affinity Analysis (1 to 50)",
    statsLuckyStars: "Lucky Stars Analysis (1 to 12)",
    statsSynergyTitle: "Pairs Synergy (Co-occurrence)",
    statsSynergyDesc: "Here are the number pairs with the highest frequency of appearing together in the same historical draw:",
    statsDrawsUnit: "draws",
    statsGapUnit: "gaps",
    statsApparitions: "Appearances",
    statsNone: "No co-occurrence identified yet.",

    historyTitle: "Temporal History",
    historySubtitle: "FDJ Chronology & Retrospective",
    sourcesBtn: "Sources",
    calendarTooltip: "Target by Calendar",
    calendarTitle: "EuroMaths Calendar",
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    daysAbbr: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    legendLoto: "Lotto",
    legendEmpty: "Empty",
    resetFilter: "Reset",
    targetDate: "Targeting",
    maskFocus: "Hide Focus",
    noDrawFound: "No draw found for the selected date",
    lazyLoadBtn: "Scroll further back in time",

    sourcesTitle: "EuroMillions Data Sources",
    sourcesMeta: "Official EuroMillions draws & stochastic algorithm",
    source1Title: "1. Official FDJ Archives (Française des Jeux)",
    source1Desc: "Comprehensive history of all certified EuroMillions draws since the rules revision in September 2016.",
    source2Title: "2. Automatic Synchronization API",
    source2Desc: "To ensure metrics stay perfectly updated day-to-day, EuroMaths queries the live EuroMillions Pedro Mealha REST API. Data ingestion and synchronization are handled dynamically in the background without any interaction required.",
    integrityTitle: "Mathematical Integrity",
    integrityDesc: "Each draw session is kept securely in local storage. No arbitrary biases alter the stochastic outcome.",
    gotIt: "I understand, thanks!",

    welcomeTitle: "EuroMillions Simulator",
    welcomeSubtitle: "EuroMillions Simulator & Probabilistic Analysis",
    welcomeConceptTitle: "Scientific rigor over complete blind chance",
    welcomeConceptDesc: "Welcome to EuroMaths. This tool is not a fortune-teller, but a mathematical lab simulating cumulative density functions.",
    welcomeMethod1: "Multi-factor Bayesian model",
    welcomeMethod1Desc: "Fine-grained extraction probability adjusts live using custom sliders modeling gap and occurrences.",
    welcomeMethod2: "Pairwise correlation indexing",
    welcomeMethod2Desc: "Stochastic 50x50 matrix mapping of co-occurrence affinities over 10 years of certified draws.",
    enterBtn: "Enter computing space",

    warningTitle: "Combinatorics & Randomness",
    warningPoint1: "Each physical draw remains absolutely independent. Historical analysis does not bias the physical roll of the balls.",
    warningPoint2: "The matrix model cleverly flags frequent pairs to compile highly coherent combinations.",
    warningPoint3: "You can inject virtual mock draws into the history list to visually verify calculated weights update.",
    preventionTitle: "Risk Warning:",
    preventionDesc: "Gambling carries risks of addiction and financial loss. Play responsibly, strictly within your financial capabilities.",

    footerCopyright: "© 2026 EuroMaths Simulator. Designed with statistical combinatorics.",
    footerSlogan: "Expert design and high-end predictive modeling. Not affiliated with official national lottery operators."
  },
  ES: {
    activeAlgo: "Algoritmo Activo",
    statsSync: "Sincronizado",
    engineTitle: "MOTOR ESTOCÁSTICO V1",
    moteurStochastique: "Motor Estocástico",
    adjustModel: "Ajustar mi modelo →",
    reset: "Restablecer",
    close: "Cerrar",
    focus: "Enfoque",
    empty: "Vacío",
    draw: "Sorteo",
    draws: "Sorteos",

    headerSlogan: "Simulador estadístico de EuroMillones y sorteos estocásticos de probabilidad",
    introTitle: "¿Cómo funciona nuestro simulador EuroMillones de cálculo estadístico?",
    introDesc: "Este simulador utiliza una Selección Aleatoria Ponderada. Los números con mayor brecha (tiempo sin salir) o mayor frecuencia reciben mayor peso ajustable a través de deslizadores. Al seleccionar cada número virtual, la matriz de coocurrencia recalcula los pesos para favorecer sinergias clave.",
    ethicalTitle: "Soberanía de Datos y Computación Local",
    ethicalDesc: "EuroMaths es una herramienta matemática sin fines comerciales. Los algoritmos Bayesianos se ejecutan localmente en su navegador y no se recopilan sus sorteos generados.",

    generatorTitle: "Generador Combinatorio",
    generatorSubtitle: "Síntesis estocástica y afinidad matricial",
    adjustSliders: "Ajustar Deslizadores de Equilibrio",
    weightFreq: "Ponderación de Frecuencia",
    weightFreqDesc: "Prioriza bolas con mayor tasa de aparición histórica.",
    weightEcart: "Ponderación de Brecha (Écart)",
    weightEcartDesc: "Prioriza bolas frías (que llevan mucho tiempo sin salir).",
    weightCooccur: "Sinergia de Coocurrencia",
    weightCooccurDesc: "Fuerza la atracción mutua entre parejas históricamente conjuntas.",
    generateBtn: "Generar Secuencia Óptima",
    generatedSequence: "Secuencia Óptima Generada",
    drawDetails: "Logística de Extracción",
    drawDetailsDesc: "Historial secuencial de probabilidades calculadas al instante t",
    evenOddTitle: "Equilibrio Par / Impar",
    theoreticalEntropy: "Entropía Teórica",

    backtestTitle: "Retroajuste de Algoritmo",
    backtestSubtitle: "Simule una serie de sorteos retrospectivos y analice la efectividad",
    simulateRuns: "Lanzar 1.000 simulaciones masivas",
    successRate: "Tasa de rendimiento global",
    simulating: "Calculando distribuciones de probabilidad...",
    simulationComplete: "¡Simulación completada!",

    matrixTitle: "Matriz de Coocurrencia Multivariable (50×50)",
    matrixSubtitle: "Análisis de atracción geométrica entre parejas de números",
    matrixHover: "Pase el cursor sobre la celda para revelar la afinidad estocástica",
    matrixDetail: "Correlación detectada",

    statsTitle: "Densidad de Distribución",
    statsSubtitle: "Panel estadístico interactivo de números y estrellas",
    frequentNumbers: "Números más frecuentes",
    frequentStars: "Estrellas más frecuentes",
    coldNumbers: "Números más fríos",
    coldStars: "Estrellas más frías",
    kpiTotalDraws: "Sorteos Históricos",
    kpiParity: "Distribución Par/Impar",
    kpiStoch: "Ponderación estocástica",
    kpiPair: "Pares",
    kpiImpair: "Impares",
    kpiMeanSum: "Suma Promedio",
    kpiTheoreticalMed: "Mediana teórica: ~127",
    statsAffinityTitle: "Análisis de afinidad de números (1 a 50)",
    statsLuckyStars: "Análisis de Lucky Stars (1 a 12)",
    statsSynergyTitle: "Sinergia de binomios (Co-ocurrencia)",
    statsSynergyDesc: "Parejas de números con mayor frecuencia de aparición conjunta en el mismo sorteo histórico:",
    statsDrawsUnit: "sorteos",
    statsGapUnit: "días",
    statsApparitions: "Apariciones",
    statsNone: "Ninguna co-ocurrencia identificada por ahora.",

    historyTitle: "Historial Temporal",
    historySubtitle: "Cronología y Retrospectiva oficial",
    sourcesBtn: "Fuentes",
    calendarTooltip: "Filtrar por Calendario",
    calendarTitle: "Calendario EuroMaths",
    months: [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ],
    daysAbbr: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
    legendLoto: "Lotto",
    legendEmpty: "Vacío",
    resetFilter: "Reset",
    targetDate: "Destacado",
    maskFocus: "Ocultar Enfoque",
    noDrawFound: "No se encontró ningún sorteo para la fecha seleccionada",
    lazyLoadBtn: "Pasar más atrás en el tiempo",

    sourcesTitle: "Fuentes de datos de EuroMillones",
    sourcesMeta: "Datos oficiales de EuroMillones y algoritmo estocástico",
    source1Title: "1. Archivos Oficiales Lotería FDJ",
    source1Desc: "Historial completo de sorteos certificados de EuroMillones desde el último cambio de reglas en septiembre de 2016.",
    source2Title: "2. API de sincronización automática",
    source2Desc: "Para una precisión total día a día, EuroMaths consulta de forma automática la API REST de referencia de Pedro Mealha en segundo plano. La ingesta y la actualización se realizan de manera transparente y dinámica en segundo plano.",
    integrityTitle: "Integridad Matemática",
    integrityDesc: "Cada sorteo se almacena de forma íntegra a nivel local. Ningún sesgo artificial altera los resultados.",
    gotIt: "¡Entendido, gracias!",

    welcomeTitle: "Simulador EuroMillones",
    welcomeSubtitle: "Simulador EuroMillones y Análisis Probabilístico",
    welcomeConceptTitle: "Rigor científico frente al azar absoluto",
    welcomeConceptDesc: "Bienvenido a EuroMaths. Esta herramienta no lee el futuro, es un simulador matemático basado en funciones de densidad acumulada.",
    welcomeMethod1: "Modelo Bayesiano multifactorial",
    welcomeMethod1Desc: "Modulación fina basada en la densidad de brechas e históricos con deslizadores dedicados.",
    welcomeMethod2: "Indexación de coocurrencia",
    welcomeMethod2Desc: "Análisis estocástico matricial 50x50 sobre 10 años de sorteos de lotería oficiales.",
    enterBtn: "Entrar al espacio de cálculo",

    warningTitle: "Combinatoria y Azar",
    warningPoint1: "Cada sorteo permanece independiente de forma absoluta. El análisis histórico no influye en la física del sorteo.",
    warningPoint2: "El modelo destaca inteligentemente las parejas con mayor afinidad para proponer bloques coherentes.",
    warningPoint3: "Puede agregar sorteos ficticios de prueba para probar cómo reaccionan las estadísticas en tiempo real.",
    preventionTitle: "Prevención de Riesgos:",
    preventionDesc: "El juego de azar puede generar adicción. Juegue con moderación y solo según su presupuesto financiero real.",

    footerCopyright: "© 2026 EuroMaths Simulator. Diseñado bajo principios de ciencia estadística combinatoria.",
    footerSlogan: "Diseño premium y modelado probabilístico de ayuda a la selección. No afiliado a los operadores oficiales de loterías."
  },
  PT: {
    activeAlgo: "Algoritmo Ativo",
    statsSync: "Sincronizado",
    engineTitle: "MOTOR ESTOCÁSTICO V1",
    moteurStochastique: "Motor Estocástico",
    adjustModel: "Ajustar meu modelo →",
    reset: "Redefinir",
    close: "Fechar",
    focus: "Foco",
    empty: "Vazio",
    draw: "Sorteio",
    draws: "Sorteios",

    headerSlogan: "Simulador estatístico do EuroMilhões e sorteios estocásticos ponderados",
    introTitle: "Como funciona o nosso simulador do EuroMilhões de cálculo estatístico?",
    introDesc: "Este simulador utiliza uma Seleção Aleatória Ponderada. Os números com maior intervalo de ausência ou maior frequência recebem coeficientes mais altos ajustáveis usando os sliders. Após cada número virtual extraído, a matriz de co-ocorrência atualiza os pesos para buscar combinações sinérgicas.",
    ethicalTitle: "Soberania dos Dados e Cálculo Local",
    ethicalDesc: "EuroMaths é uma ferramenta matemática sem intenções comerciais. Os algoritmos Bayesianos são executados no navegador. Nenhuma de suas sequências geradas é coletada ou transmitida.",

    generatorTitle: "Gerador Combinatório",
    generatorSubtitle: "Síntese estocástica e afinidade matricial",
    adjustSliders: "Ajustar Barras de Equilíbrio",
    weightFreq: "Ponderação da Frequência",
    weightFreqDesc: "Prioriza as bolas com maior índice de saídas históricas.",
    weightEcart: "Ponderação do Intervalo (Écart)",
    weightEcartDesc: "Prioriza as bolas frias (que não saem há mais tempo).",
    weightCooccur: "Sinergia de Co-ocorrência",
    weightCooccurDesc: "Ativa a atração de pares historicamente complementares.",
    generateBtn: "Gerar Sequência Ideal",
    generatedSequence: "Sequência Ideal Gerada",
    drawDetails: "Logística de Extração",
    drawDetailsDesc: "Histórico sequencial das probabilidades ativas no instante t",
    evenOddTitle: "Equilíbrio Par / Ímpar",
    theoreticalEntropy: "Entropia Teórica",

    backtestTitle: "Testes de Retrocesso (Backtesting)",
    backtestSubtitle: "Simule rodadas retrospectivas maciças e observe os resultados do modelo",
    simulateRuns: "Iniciar 1.000 simulações em massa",
    successRate: "Taxa de rendimento total",
    simulating: "Calculando distribuições probabilísticas...",
    simulationComplete: "Simulação finalizada!",

    matrixTitle: "Matriz de Co-ocorrência Multivariável (50×50)",
    matrixSubtitle: "Análise geométrica de atração entre duplas de dezenas",
    matrixHover: "Passe o rato pelas células para verificar afinidades estocásticas",
    matrixDetail: "Correlação detectada",

    statsTitle: "Densidade Distribuidora",
    statsSubtitle: "Painel interativo de dezenas e estrelas do EuroMilhões",
    frequentNumbers: "Números mais frequentes",
    frequentStars: "Estrelas mais frequentes",
    coldNumbers: "Números mais frios",
    coldStars: "Estrelas mais frias",
    kpiTotalDraws: "Historial de Sorteios",
    kpiParity: "Distribuição Par/Ímpar",
    kpiStoch: "Ponderação estocástica",
    kpiPair: "Pares",
    kpiImpair: "Ímpares",
    kpiMeanSum: "Soma Média",
    kpiTheoreticalMed: "Mediana teórica: ~127",
    statsAffinityTitle: "Análise de afinidade dos números (1 a 50)",
    statsLuckyStars: "Análise de Lucky Stars (1 a 12)",
    statsSynergyTitle: "Sinergia de binômios (Co-ocorrência)",
    statsSynergyDesc: "Pares de números com maior frequência de aparição conjunta no mesmo sorteio histórico:",
    statsDrawsUnit: "sorteios",
    statsGapUnit: "dias",
    statsApparitions: "Aparições",
    statsNone: "Nenhuma co-ocorrência identificada por enquanto.",

    historyTitle: "Historial Temporal",
    historySubtitle: "Cronologia e Retrospectiva FDJ & Santa Casa",
    sourcesBtn: "Fontes",
    calendarTooltip: "Filtrar por Calendário",
    calendarTitle: "Calendário EuroMaths",
    months: [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
    daysAbbr: ["Se", "Te", "Qu", "Qu", "Se", "Sá", "Do"],
    legendLoto: "Loto",
    legendEmpty: "Vazio",
    resetFilter: "Reset",
    targetDate: "Destacado",
    maskFocus: "Ocultar Foco",
    noDrawFound: "Nenhum sorteio encontrado para a data inserida",
    lazyLoadBtn: "Viajar mais longe no tempo",

    sourcesTitle: "Fontes de dados do EuroMilhões",
    sourcesMeta: "Dados oficiais do EuroMilhões e algoritmo estocástico",
    source1Title: "1. Arquivos Oficiais de Loterias FDJ",
    source1Desc: "Dados consolidados e oficiais de todos os sorteios do EuroMilhões desde a atualização das regras em 2016.",
    source2Title: "2. API de sincronização automática",
    source2Desc: "Para garantir total rigor todos os dias, o simulador acede automaticamente e em segundo plano à API REST de referência EuroMillions Pedro Mealha. A importação e actualização dos dados mais recentes da semana ocorrem de forma 100% dinâmica e autônoma.",
    integrityTitle: "Integridade Matemática",
    integrityDesc: "Todos os sorteios simulados ocorrem exclusivamente localmente sem qualquer alteração externa.",
    gotIt: "Entendido, obrigado!",

    welcomeTitle: "Simulador do EuroMilhões",
    welcomeSubtitle: "Simulador do EuroMilhões e Análise Probabilística",
    welcomeConceptTitle: "Máximo rigor científico em oposição ao acaso absoluto",
    welcomeConceptDesc: "Bem-vindo ao EuroMaths. Este simulador estocástico estuda as dezenas recorrendo a matrizes de frequência quadráticas.",
    welcomeMethod1: "Modelo Bayesiano multi-variável",
    welcomeMethod1Desc: "Ajuste fino de probabilidades com base em intervalos estatísticos e frequências cumulativas.",
    welcomeMethod2: "Indexação por correlação cruzada",
    welcomeMethod2Desc: "Análise estocástica por matriz complexa 50x50 sobre anos de dados da loteria oficial.",
    enterBtn: "Entrar no painel de computação",

    warningTitle: "Probabilidades & Azar",
    warningPoint1: "Cada sorteio físico permanece absolutamente independente sob o ponto de vista estatístico clássico.",
    warningPoint2: "O sistema destaca correlações fortes de saída conjunta para estruturar linhas mais robustas.",
    warningPoint3: "Pode inserir dados virtuais no historial para fazer testes rápidos com novas combinações.",
    preventionTitle: "Luta Contra a Dependência:",
    preventionDesc: "O jogo carrega risco de adição. Jogue com moderação, respeitando rigorosamente os seus limites financeiros.",

    footerCopyright: "© 2026 EuroMaths Simulator. Construído sob a ciência matemática do acaso.",
    footerSlogan: "Conceção profissional para ajuda à decisão de jogo. Sem qualquer afiliação a marcas ou lotarias oficiais do estado."
  }
};
