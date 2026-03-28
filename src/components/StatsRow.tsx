interface Props {
  totalIn: number;
  totalOut: number;
  net: number;
  anomalyCount: number;
}

function fmt(n: number) {
  return "₦" + Math.abs(n).toLocaleString("en-NG");
}

export function StatsRow({ totalIn, totalOut, net, anomalyCount }: Props) {
  const cards = [
    { label: "Total Income",  value: fmt(totalIn),  color: "var(--green)", sign: "+" },
    { label: "Total Spend",   value: fmt(totalOut), color: "var(--red)",   sign: "−" },
    { label: "Net Balance",   value: fmt(net),      color: net >= 0 ? "var(--green)" : "var(--red)", sign: net >= 0 ? "+" : "−" },
    { label: "Anomalies",     value: String(anomalyCount), color: "var(--amber)", sign: "⚠" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{c.label}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ color: c.color, fontSize: 13, fontWeight: 600 }}>{c.sign}</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{c.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
