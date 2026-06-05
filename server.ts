/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { HISTORIQUE_EUROMILLIONS_REEL } from "./src/data/euroMillionsData";
import { calculerStatistiques, genererCombinaisonIntelligente } from "./src/utils/algo";
import { WeightsConfig } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parser JSON pour requêtes d'API
  app.use(express.json());

  // API 1: Liste historique complète
  app.get("/api/history", (req, res) => {
    res.json(HISTORIQUE_EUROMILLIONS_REEL);
  });

  // API 2: Données de co-occurrence de numéros
  app.get("/api/cooccurrence", (req, res) => {
    const stats = calculerStatistiques(HISTORIQUE_EUROMILLIONS_REEL);
    const selectedNum = req.query.selected ? parseInt(req.query.selected as string, 10) : null;

    if (selectedNum && !isNaN(selectedNum)) {
      // Filtrer les co-occurrences liées au numéro sélectionné
      const entries = Object.entries(stats.coOccurrenceNumeros)
        .map(([key, count]) => {
          const parts = key.split("-").map(Number);
          if (parts.includes(selectedNum)) {
            const coNum = parts[0] === selectedNum ? parts[1] : parts[0];
            return { number: coNum, count };
          }
          return null;
        })
        .filter((item): item is { number: number; count: number } => item !== null)
        .sort((a, b) => b.count - a.count);

      return res.json({ selectedNum, coOccurrences: entries });
    }

    res.json({
      coOccurrenceNumeros: stats.coOccurrenceNumeros,
      totalKeys: Object.keys(stats.coOccurrenceNumeros).length
    });
  });

  // API 3: Simulation stochastique intelligente
  app.post("/api/generate", (req, res) => {
    try {
      const config: WeightsConfig = {
        weightFrequence: typeof req.body.weightFrequence === "number" ? req.body.weightFrequence : 0.5,
        weightEcart: typeof req.body.weightEcart === "number" ? req.body.weightEcart : 0.5,
        coOccurrenceBonus: typeof req.body.coOccurrenceBonus === "number" ? req.body.coOccurrenceBonus : 0.4,
        entropyNoise: typeof req.body.entropyNoise === "number" ? req.body.entropyNoise : 0.0,
        distancePenalty: typeof req.body.distancePenalty === "number" ? req.body.distancePenalty : 0.0,
        temperatureScale: typeof req.body.temperatureScale === "number" ? req.body.temperatureScale : 0.5,
      };

      const combination = genererCombinaisonIntelligente(HISTORIQUE_EUROMILLIONS_REEL, config);
      res.json({ config, combination });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid parameters setup" });
    }
  });

  app.get("/api/generate", (req, res) => {
    try {
      const config: WeightsConfig = {
        weightFrequence: req.query.weightFrequence ? parseFloat(req.query.weightFrequence as string) : 0.5,
        weightEcart: req.query.weightEcart ? parseFloat(req.query.weightEcart as string) : 0.5,
        coOccurrenceBonus: req.query.coOccurrenceBonus ? parseFloat(req.query.coOccurrenceBonus as string) : 0.4,
        entropyNoise: req.query.entropyNoise ? parseFloat(req.query.entropyNoise as string) : 0.0,
        distancePenalty: req.query.distancePenalty ? parseFloat(req.query.distancePenalty as string) : 0.0,
        temperatureScale: req.query.temperatureScale ? parseFloat(req.query.temperatureScale as string) : 0.5,
      };

      const combination = genererCombinaisonIntelligente(HISTORIQUE_EUROMILLIONS_REEL, config);
      res.json({ config, combination });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Invalid query parameters setup" });
    }
  });

  // API 4: Simulateur de rétro-stats / Backtesting stochastique
  app.post("/api/backtest", (req, res) => {
    try {
      const nbDrawsToTest = typeof req.body.nbDrawsToTest === "number" ? req.body.nbDrawsToTest : 30;
      const config: WeightsConfig = {
        weightFrequence: typeof req.body.weightFrequence === "number" ? req.body.weightFrequence : 0.5,
        weightEcart: typeof req.body.weightEcart === "number" ? req.body.weightEcart : 0.5,
        coOccurrenceBonus: typeof req.body.coOccurrenceBonus === "number" ? req.body.coOccurrenceBonus : 0.4,
        entropyNoise: typeof req.body.entropyNoise === "number" ? req.body.entropyNoise : 0.0,
        distancePenalty: typeof req.body.distancePenalty === "number" ? req.body.distancePenalty : 0.0,
        temperatureScale: typeof req.body.temperatureScale === "number" ? req.body.temperatureScale : 0.5,
      };

      const drawingsToTest = HISTORIQUE_EUROMILLIONS_REEL.slice(0, nbDrawsToTest);
      
      let match2 = 0;
      let match3 = 0;
      let match4 = 0;
      let match5 = 0;
      let matchStar1 = 0;
      let matchStar2 = 0;
      const totalRuns = 100;

      const historyMatchSeries: any[] = [];

      drawingsToTest.forEach((draw, dIdx) => {
        let correctNumsAlgoCount = 0;
        let correctNumsRandomCount = 0;

        for (let i = 0; i < totalRuns; i++) {
          const subHistory = HISTORIQUE_EUROMILLIONS_REEL.slice(dIdx + 1);
          const simAlgo = genererCombinaisonIntelligente(subHistory, config);

          const matchNums = simAlgo.numeros.filter(n => draw.numeros.includes(n)).length;
          const matchStars = simAlgo.etoiles.filter(s => draw.etoiles.includes(s)).length;

          if (matchNums === 2) match2++;
          if (matchNums === 3) match3++;
          if (matchNums === 4) match4++;
          if (matchNums >= 5) match5++;
          if (matchStars === 1) matchStar1++;
          if (matchStars === 2) matchStar2++;

          correctNumsAlgoCount += matchNums;

          const simRandomNums: number[] = [];
          while (simRandomNums.length < 5) {
            const r = Math.floor(Math.random() * 50) + 1;
            if (!simRandomNums.includes(r)) simRandomNums.push(r);
          }
          const matchRandomNums = simRandomNums.filter(n => draw.numeros.includes(n)).length;
          correctNumsRandomCount += matchRandomNums;
        }

        historyMatchSeries.unshift({
          date: draw.date,
          algorithmEfficiency: parseFloat((correctNumsAlgoCount / totalRuns).toFixed(2)),
          randomEfficiency: parseFloat((correctNumsRandomCount / totalRuns).toFixed(2))
        });
      });

      res.json({
        totalDrawsEvaluated: nbDrawsToTest,
        configUsed: config,
        summaryMatcherMetrics: {
          match2Exact: match2,
          match3Exact: match3,
          match4Exact: match4,
          match5Exact: match5,
          matchStar1Exact: matchStar1,
          matchStar2Exact: matchStar2
        },
        historyMatchSeries
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || "Failed running backtest calculation" });
    }
  });

  // Setup de Vite en tant que Middleware pour le développement
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Servir les fichiers statiques de production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EURO-MATH EXPRESS DAEMON] Server running on http://localhost:${PORT}`);
  });
}

startServer();
