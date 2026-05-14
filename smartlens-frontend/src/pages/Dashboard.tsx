import { useEffect, useState } from "react";
import API from "../services/api";
import "./dashboard.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          API.get("/studios/profile"),
          API.get("/studios/dashboard-overview").catch(() => null)
        ]);
        
        setProfile(profileRes.data.data);
        if (statsRes) setStats(statsRes.data.data || statsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-state">Loading dashboard...</div>;
  }

  if (!profile) {
    return <div className="error-state">Failed to load profile. Please try logging out and in again.</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {profile.name} 👋</h1>
        <div className={`plan-badge ${profile.subscriptionPlan}`}>
          {profile.subscriptionPlan.toUpperCase()} PLAN
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <h3>Total Bookings</h3>
          <p className="stat-value">{stats?.totalBookings || 0}</p>
        </div>
        <div className="stat-card glass-card">
          <h3>Pending Requests</h3>
          <p className="stat-value">{stats?.pendingBookingRequests || 0}</p>
        </div>
        <div className="stat-card glass-card">
          <h3>Earnings</h3>
          <p className="stat-value">Rs {stats?.earnings || 0}</p>
        </div>
        <div className="stat-card glass-card">
          <h3>Subscription Status</h3>
          <p className="stat-value plan-value">{profile.subscriptionPlan}</p>
          {profile.subscriptionPlan === "free" && (
            <Link to="/billing" className="upgrade-link">Upgrade Now</Link>
          )}
        </div>
        <div className="stat-card glass-card">
          <h3>Quick Actions</h3>
          <div className="action-links">
            <Link to="/gallery" className="action-btn">Manage Photos</Link>
            <Link to="/photographer/albums" className="action-btn">Manage Albums</Link>
            <Link to="/photographer/booking-requests" className="action-btn">Review Requests</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
