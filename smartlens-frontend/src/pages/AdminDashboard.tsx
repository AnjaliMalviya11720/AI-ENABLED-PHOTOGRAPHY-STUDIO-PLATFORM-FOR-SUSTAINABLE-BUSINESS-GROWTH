import { useEffect, useState } from "react";
import API from "../services/api";

interface DashboardData {
  totalStudios: number;
  totalPhotos: number;
  premiumStudios: number;
  freeStudios: number;
  totalRevenue: number;
  conversionRate: string;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  revenueGrowth: string;
  mostActiveStudio?: {
    name: string;
    email: string;
    photoCount: number;
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setData(res.data.data);
      } catch (error) {
        alert("Failed to load dashboard");
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 40 }}>
      <h1>📊 SmartLens Admin Dashboard</h1>

      <p>Total Studios: {data.totalStudios}</p>
      <p>Total Photos: {data.totalPhotos}</p>
      <p>Premium Studios: {data.premiumStudios}</p>
      <p>Free Studios: {data.freeStudios}</p>
      <p>Total Revenue: ₹{data.totalRevenue}</p>
      <p>Conversion Rate: {data.conversionRate}</p>
      <p>This Month Revenue: ₹{data.thisMonthRevenue}</p>
      <p>Last Month Revenue: ₹{data.lastMonthRevenue}</p>
      <p>Revenue Growth: {data.revenueGrowth}</p>

      {data.mostActiveStudio && (
        <div style={{ marginTop: 20 }}>
          <h3>🔥 Most Active Studio</h3>
          <p>Name: {data.mostActiveStudio.name}</p>
          <p>Email: {data.mostActiveStudio.email}</p>
          <p>Photos Uploaded: {data.mostActiveStudio.photoCount}</p>
        </div>
      )}
    </div>
  );
}
