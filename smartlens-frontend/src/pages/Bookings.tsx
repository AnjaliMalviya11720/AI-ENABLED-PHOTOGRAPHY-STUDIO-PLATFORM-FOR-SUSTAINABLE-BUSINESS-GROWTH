import { useState, useEffect } from "react";
import API from "../services/api";

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings");
      setBookings(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="loading-state">Loading Bookings...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Client Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">No bookings received yet!</div>
      ) : (
        <div className="glass-panel" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <th style={{ padding: "16px 8px" }}>Client</th>
                <th style={{ padding: "16px 8px" }}>Event</th>
                <th style={{ padding: "16px 8px" }}>Date</th>
                <th style={{ padding: "16px 8px" }}>Time</th>
                <th style={{ padding: "16px 8px" }}>Location</th>
                <th style={{ padding: "16px 8px" }}>Offered Price</th>
                <th style={{ padding: "16px 8px" }}>Status</th>
                <th style={{ padding: "16px 8px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} style={{ borderBottom: "1px solid rgba(17,20,57,0.08)" }}>
                  <td style={{ padding: "16px 8px" }}>
                    <strong>{b.clientName}</strong><br/>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{b.clientEmail} • {b.clientPhone}</span>
                  </td>
                  <td style={{ padding: "16px 8px" }}>{b.eventType}</td>
                  <td style={{ padding: "16px 8px" }}>{new Date(b.date).toLocaleDateString()}</td>
                  <td style={{ padding: "16px 8px" }}>{b.eventTime || "-"}</td>
                  <td style={{ padding: "16px 8px" }}>{b.location || "-"}</td>
                  <td style={{ padding: "16px 8px" }}>Rs {b.budget || 0}</td>
                  <td style={{ padding: "16px 8px" }}>
                    <span className={`plan-badge ${b.status === 'confirmed' ? 'premium' : b.status === 'cancelled' ? 'free' : ''}`} 
                          style={{ background: b.status === 'pending' ? 'rgba(95,111,255,0.14)' : undefined, color: b.status==='pending'?'#4f5ecf':undefined }}>
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "16px 8px" }}>
                    {b.status === "pending" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => handleUpdateStatus(b._id, "confirmed")} style={{ background: "rgba(95,111,255,0.14)", color: "#3642a8", border: "1px solid rgba(95,111,255,0.35)", padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}>Confirm</button>
                        <button onClick={() => handleUpdateStatus(b._id, "cancelled")} style={{ background: "rgba(220, 38, 38, 0.12)", color: "#a33030", border: "1px solid rgba(220, 38, 38, 0.3)", padding: "6px 12px", borderRadius: "8px", cursor: "pointer" }}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
