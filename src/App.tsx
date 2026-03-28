import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { MOCK_TRANSACTIONS } from "./data/mockTransactions";
import { useTransactionEngine } from "./hooks/useTransactionEngine";

export default function App() {
  const [transactions] = useState(MOCK_TRANSACTIONS);
  const { enriched, anomalies, forecast } = useTransactionEngine(transactions);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Dashboard
        transactions={enriched}
        anomalies={anomalies}
        forecast={forecast}
      />
    </div>
  );
}
