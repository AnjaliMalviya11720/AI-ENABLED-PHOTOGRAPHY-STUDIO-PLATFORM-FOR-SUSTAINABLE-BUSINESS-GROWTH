import { useEffect, useState } from "react";
import API from "../services/api";
import "./common.css";
import "./dashboard.css";
import "./profile.css";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("available");
  const [loading, setLoading] = useState(true);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    API.get("/studios/profile")
      .then((res) => {
        const d = res.data.data || {};
        if (d.availabilityStatus) {
          setAvailabilityStatus(d.availabilityStatus);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setSavingPassword(true);
    try {
      await API.put("/studios/change-password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      alert("Password updated successfully.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not update password.";
      setPasswordError(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  const saveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAvailability(true);
    try {
      await API.put("/studios/profile", { availabilityStatus });
      alert("Availability saved.");
    } catch {
      alert("Could not save availability. Try again.");
    } finally {
      setSavingAvailability(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading settings…</div>;
  }

  return (
    <div className="profile-page">
      <div className="glass-card settings-hero">
        <div className="settings-hero-inner">
          <h1>Settings</h1>
          <p>
            Secure your account and control whether new clients can book you.
            Availability here matches your profile.
          </p>
        </div>
      </div>

      <form onSubmit={changePassword}>
        <div className="glass-card profile-section">
          <h2>Security</h2>
          <p className="profile-hint" style={{ marginBottom: 16, marginTop: -8 }}>
            Use a strong password you don’t reuse on other sites.
          </p>
          {passwordError ? (
            <div className="error-message" style={{ marginBottom: 16 }}>
              {passwordError}
            </div>
          ) : null}
          <div className="input-group">
            <label htmlFor="st-current-pw">Current password</label>
            <input
              id="st-current-pw"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="st-new-pw">New password</label>
            <input
              id="st-new-pw"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="settings-section-actions">
            <button
              type="submit"
              className="primary-btn profile-save-btn"
              disabled={savingPassword}
            >
              {savingPassword ? "Updating…" : "Update password"}
            </button>
          </div>
        </div>
      </form>

      <div className="settings-divider" aria-hidden />

      <form onSubmit={saveAvailability}>
        <div className="glass-card profile-section">
          <h2>Availability</h2>
          <p className="profile-hint" style={{ marginBottom: 16, marginTop: -8 }}>
            Clients browsing photographers will see this status.
          </p>
          <div className="input-group">
            <label htmlFor="st-availability">Booking status</label>
            <select
              id="st-availability"
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value)}
            >
              <option value="available">Available for new bookings</option>
              <option value="busy">Busy — limited availability</option>
              <option value="offline">Offline — not accepting bookings</option>
            </select>
          </div>
          <div className="settings-section-actions">
            <button
              type="submit"
              className="primary-btn profile-save-btn"
              disabled={savingAvailability}
            >
              {savingAvailability ? "Saving…" : "Save availability"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
