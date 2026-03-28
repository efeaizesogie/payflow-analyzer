import { useState } from "react";
import { EnrichedTransaction, linearRegressionForecast } from "../hooks/useTransactionEngine";
import { SpendChart } from "./SpendChart";
import { TransactionTable } from "./TransactionTable";
import { StatsRow } from "./StatsRow";
import { AnomalyPanel } from "./AnomalyPanel";

interface Props {
  transactions: EnrichedTransaction[];
  anomalies: EnrichedTransaction[];
  forecast: ReturnType<typeof linearRegressionForecast>;
}

const CATEGORIES = ["all","food","transport","utilities","entertainment","salary","transfer","unknown"];

export function Dashboard({ transactions, anomalies, forecast }: Props) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? transactions : transactions.filter(t => t.category === filter);
  const totalIn = transactions.filter(t => t.amount > 0).reduce((s,t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.amount < 0).reduce((s,t) => s + Math.abs(t.amount), 0);
  const net = totalIn - totalOut;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--brand)", boxShadow: "0 0 8px var(--brand)" }} />
          <span style={{ color: "var(--text-muted)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>March 2026</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 4 }}>PayFlow Analyzer</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{transactions.length} transactions · {anomalies.length} anomalies flagged</p>
      </div>

      <StatsRow totalIn={totalIn} totalOut={totalOut} net={net} anomalyCount={anomalies.length} />
      <SpendChart transactions={transactions} forecast={forecast} />
      {anomalies.length > 0 && <AnomalyPanel anomalies={anomalies} />}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, marginTop: 32 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "6px 14px", borderRadius: 20,
            border: `1px solid ${filter === cat ? "var(--brand)" : "var(--border)"}`,
            background: filter === cat ? "var(--brand-dim)" : "transparent",
            color: filter === cat ? "var(--brand)" : "var(--text-dim)",
            fontSize: 12, fontWeight: filter === cat ? 600 : 400,
            cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize", fontFamily: "inherit",
          }}>{cat}</button>
        ))}
      </div>

      <TransactionTable transactions={filtered} />
    </div>
  );
}
