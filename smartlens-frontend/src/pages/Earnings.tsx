import { useEffect, useState } from "react";
import API from "../services/api";

export default function Earnings() {
  const [summary, setSummary] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([API.get("/payments/earnings"), API.get("/payments/history")])
      .then(([summaryRes, historyRes]) => {
        setSummary(summaryRes.data.data);
        setHistory(historyRes.data.data || []);
      })
      .catch(() => {
        setSummary({ totalEarnings: 0, totalTransactions: 0 });
        setHistory([]);
      });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Earnings and Payments</h1>
      <p>Total Earnings: Rs {summary?.totalEarnings || 0}</p>
      <p>Total Transactions: {summary?.totalTransactions || 0}</p>
      <h3>Payment History</h3>
      {history.map((item) => (
        <div key={item._id}>
          {new Date(item.createdAt).toLocaleString()} - Rs {item.amount} - {item.status}
        </div>
      ))}
    </div>
  );
}
