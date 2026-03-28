import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { EnrichedTransaction, linearRegressionForecast } from "../hooks/useTransactionEngine";

interface Props {
  transactions: EnrichedTransaction[];
  forecast: ReturnType<typeof linearRegressionForecast>;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{name: string; color: string; value: number}>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a1a24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "var(--text-muted)", marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, display: "flex", gap: 8, justifyContent: "space-between" }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 600 }}>₦{Math.abs(p.value).toLocaleString("en-NG")}</span>
        </div>
      ))}
    </div>
  );
};

export function SpendChart({ transactions, forecast }: Props) {
  const dailyMap = new Map<string, number>();
  for (const tx of transactions) {
    if (tx.amount < 0) {
      const day = tx.date.slice(0, 10);
      dailyMap.set(day, (dailyMap.get(day) ?? 0) + Math.abs(tx.amount));
    }
  }

  const actual = [...dailyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, spend]) => ({ date: date.slice(5), spend, projected: null }));

  const projected = forecast.map(f => ({ date: f.date.slice(5), spend: null, projected: Math.max(0, Math.round(f.projected)) }));
  const data = [...actual, ...projected];

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "24px", marginBottom: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Daily Spend + 7-Day Forecast</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Actual bars · dashed line = linear regression projection</div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => "₦" + (v/1000).toFixed(0) + "k"} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="spend" name="Spend" fill="var(--brand)" opacity={0.85} radius={[3,3,0,0]} maxBarSize={28} />
          <Line dataKey="projected" name="Forecast" stroke="var(--amber)" strokeWidth={2} strokeDasharray="5 3" dot={false} connectNulls />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
