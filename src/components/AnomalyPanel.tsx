import { EnrichedTransaction } from "../hooks/useTransactionEngine";

export function AnomalyPanel({ anomalies }: { anomalies: EnrichedTransaction[] }) {
  return (
    <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "var(--radius)", padding: "18px 22px", marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 15 }}>⚠️</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--amber)" }}>{anomalies.length} Anomalous Transaction{anomalies.length > 1 ? "s" : ""} Detected</span>
        <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 4 }}>Greater than 2 standard deviations from category mean</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {anomalies.map((tx) => (
          <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(245,158,11,0.06)", borderRadius: 6, padding: "8px 12px" }}>
            <div>
              <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{tx.description}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 8 }}>{tx.date}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: tx.amount > 0 ? "var(--green)" : "var(--red)" }}>
              {tx.amount > 0 ? "+" : "−"}₦{Math.abs(tx.amount).toLocaleString("en-NG")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
