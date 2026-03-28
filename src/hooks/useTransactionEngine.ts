import { useMemo } from "react";

export type Category =
  | "food"
  | "transport"
  | "utilities"
  | "entertainment"
  | "salary"
  | "transfer"
  | "unknown";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  raw_category?: string;
}

export interface EnrichedTransaction extends Transaction {
  category: Category;
  confidence: number;
  isAnomaly: boolean;
}

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  food: ["restaurant","cafe","pizza","kfc","dominos","spar","shoprite","grocery","eatery","food"],
  transport: ["uber","bolt","taxify","fuel","petrol","bus","airline","flight","parking","toll"],
  utilities: ["dstv","mtn","airtel","glo","9mobile","ikedc","ekedc","water","internet","netflix"],
  entertainment: ["cinema","tickets","spotify","gaming","steam","playstation","bet","sport"],
  salary: ["salary","payroll","wages","stipend","income"],
  transfer: ["transfer","sent","received","wire","remittance","zelle","wise","paypal"],
  unknown: [],
};

function classifyTransaction(description: string): { category: Category; confidence: number } {
  const desc = description.toLowerCase();
  const tokens = desc.split(/\s+/);
  const scores: Partial<Record<Category, number>> = {};

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Category, string[]][]) {
    if (cat === "unknown") continue;
    let score = 0;
    for (const kw of keywords) {
      if (desc.includes(kw)) score += 2;
      for (const token of tokens) {
        if (token.startsWith(kw.slice(0, 4)) && kw.length >= 4) score += 1;
      }
    }
    if (score > 0) scores[cat] = score;
  }

  const entries = Object.entries(scores) as [Category, number][];
  if (entries.length === 0) return { category: "unknown", confidence: 0 };

  const total = entries.reduce((s, [, v]) => s + v, 0);
  const [topCat, topScore] = entries.sort((a, b) => b[1] - a[1])[0];
  return { category: topCat, confidence: Math.min(1, topScore / total) };
}

function detectAnomalies(transactions: EnrichedTransaction[]): Map<string, boolean> {
  const byCategory = new Map<Category, number[]>();
  for (const tx of transactions) {
    const abs = Math.abs(tx.amount);
    const list = byCategory.get(tx.category) ?? [];
    list.push(abs);
    byCategory.set(tx.category, list);
  }
  const stats = new Map<Category, { mean: number; std: number }>();
  for (const [cat, amounts] of byCategory) {
    const mean = amounts.reduce((s, v) => s + v, 0) / amounts.length;
    const variance = amounts.reduce((s, v) => s + (v - mean) ** 2, 0) / amounts.length;
    stats.set(cat, { mean, std: Math.sqrt(variance) });
  }
  const anomalySet = new Map<string, boolean>();
  for (const tx of transactions) {
    const s = stats.get(tx.category);
    const isAnomaly = s != null && s.std > 0 && Math.abs(Math.abs(tx.amount) - s.mean) > 2 * s.std;
    anomalySet.set(tx.id, isAnomaly);
  }
  return anomalySet;
}

export function linearRegressionForecast(
  dailyTotals: { date: string; spend: number }[],
  daysAhead: number
): { date: string; projected: number }[] {
  const n = dailyTotals.length;
  if (n < 2) return [];
  const xs = dailyTotals.map((_, i) => i);
  const ys = dailyTotals.map((d) => d.spend);
  const xMean = xs.reduce((s, v) => s + v, 0) / n;
  const yMean = ys.reduce((s, v) => s + v, 0) / n;
  const slope =
    xs.reduce((s, x, i) => s + (x - xMean) * (ys[i] - yMean), 0) /
    xs.reduce((s, x) => s + (x - xMean) ** 2, 0);
  const intercept = yMean - slope * xMean;
  const lastDate = new Date(dailyTotals[n - 1].date);
  return Array.from({ length: daysAhead }, (_, i) => {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + i + 1);
    return { date: d.toISOString().slice(0, 10), projected: intercept + slope * (n + i) };
  });
}

export function useTransactionEngine(raw: Transaction[]): {
  enriched: EnrichedTransaction[];
  anomalies: EnrichedTransaction[];
  forecast: ReturnType<typeof linearRegressionForecast>;
} {
  return useMemo(() => {
    const enriched: EnrichedTransaction[] = raw.map((tx) => {
      const { category, confidence } = classifyTransaction(tx.description);
      return { ...tx, category, confidence, isAnomaly: false };
    });
    const anomalyMap = detectAnomalies(enriched);
    const withAnomalies = enriched.map((tx) => ({ ...tx, isAnomaly: anomalyMap.get(tx.id) ?? false }));
    const dailyMap = new Map<string, number>();
    for (const tx of withAnomalies) {
      if (tx.amount < 0) {
        const day = tx.date.slice(0, 10);
        dailyMap.set(day, (dailyMap.get(day) ?? 0) + Math.abs(tx.amount));
      }
    }
    const dailyTotals = [...dailyMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, spend]) => ({ date, spend }));
    return {
      enriched: withAnomalies,
      anomalies: withAnomalies.filter((tx) => tx.isAnomaly),
      forecast: linearRegressionForecast(dailyTotals, 7),
    };
  }, [raw]);
}
