import { useState, useEffect } from "react";
import API from "../services/api";
import "./dashboard.css"; // Reuse card styles

export default function Billing() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    API.get("/studios/profile")
      .then(res => {
        setProfile(res.data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async () => {
    if (!window.confirm("Simulate payment of ₹3000 to upgrade to Premium?")) return;
    
    setProcessing(true);
    try {
      // Create payment mock
      await API.post("/payments/pay", { amount: 3000, paymentMethod: "mock_cc" });
      
      // Update plan directly based on backend routes (might need to call /studios/upgrade)
      await API.put("/studios/upgrade", { plan: "premium" }).catch(() => null); 
      
      alert("Payment successful! Welcome to Premium 🌟");
      
      // Refresh profile
      const res = await API.get("/studios/profile");
      setProfile(res.data.data);
    } catch (error: any) {
      alert(error.response?.data?.message || "Payment processing failed.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="loading-state">Loading billing info...</div>;

  const isPremium = profile?.subscriptionPlan === "premium";

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Subscription & Billing</h1>
      </div>

      <div className="glass-card" style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ marginBottom: 10 }}>Current Plan: <span className="plan-value" style={{ color: isPremium ? '#d4a322' : '#4f5687' }}>{profile?.subscriptionPlan}</span></h2>
        
        <p style={{ color: "var(--text-muted)", marginBottom: 30 }}>
          {isPremium 
            ? "You have access to all premium features. Your subscription is active." 
            : "Upgrade to premium to unlock unlimited photo uploads, client galleries, and advanced analytics."}
        </p>

        {!isPremium && (
          <div style={{ background: "rgba(95,111,255,0.08)", padding: 30, borderRadius: 16, marginBottom: 20, border: "1px solid rgba(17,20,57,0.1)" }}>
            <h3 style={{ margin: 0, fontSize: 24, marginBottom: 10 }}>Premium Plan</h3>
            <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 20, color: "var(--text-light)" }}>
              ₹3,000 <span style={{ fontSize: 16, fontWeight: 400, color: "var(--text-muted)" }}>/month</span>
            </div>
            
            <button 
              className="primary-btn" 
              onClick={handleUpgrade}
              disabled={processing}
            >
              {processing ? "Processing payment..." : "Upgrade Now"}
            </button>
          </div>
        )}

        {isPremium && (
          <button className="logout-btn" style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid var(--glass-border)" }}>
            Cancel Subscription
          </button>
        )}
      </div>
    </div>
  );
}
