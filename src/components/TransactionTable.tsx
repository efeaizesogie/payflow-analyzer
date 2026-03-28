import { EnrichedTransaction } from "../hooks/useTransactionEngine";

const CAT_COLORS: Record<string, string> = {
  food: "#22c55e", transport: "#3b82f6", utilities: "#a855f7",
  entertainment: "#ec4899", salary: "#10b981", transfer: "#f59e0b", unknown: "#6b7280",
};

function fmt(n: number) { return "₦" + Math.abs(n).toLocaleString("en-NG"); }

export function TransactionTable({ transactions }: { transactions: EnrichedTransaction[] }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Date","Description","Category","Confidence","Amount","Flag"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={tx.id} style={{ borderBottom: i < transactions.length - 1 ? "1px solid var(--border)" : "none", background: tx.isAnomaly ? "rgba(245,158,11,0.04)" : "transparent" }}>
                <td style={{ padding: "11px 16px", color: "var(--text-muted)", fontSize: 13, whiteSpace: "nowrap" }}>{tx.date}</td>
                <td style={{ padding: "11px 16px", color: "var(--text)", fontSize: 13, maxWidth: 240 }}>{tx.description}</td>
                <td style={{ padding: "11px 16px" }}>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: CAT_COLORS[tx.category] + "22", color: CAT_COLORS[tx.category], textTransform: "capitalize" }}>{tx.category}</span>
                </td>
                <td style={{ padding: "11px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 48, height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: (tx.confidence * 100) + "%", background: "var(--brand)", borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{Math.round(tx.confidence * 100)}%</span>
                  </div>
                </td>
                <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 600, color: tx.amount > 0 ? "var(--green)" : "var(--red)", textAlign: "right", whiteSpace: "nowrap" }}>
                  {tx.amount > 0 ? "+" : "−"}{fmt(tx.amount)}
                </td>
                <td style={{ padding: "11px 16px", textAlign: "center" }}>
                  {tx.isAnomaly && <span style={{ color: "var(--amber)", fontSize: 14 }}>⚠️</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
