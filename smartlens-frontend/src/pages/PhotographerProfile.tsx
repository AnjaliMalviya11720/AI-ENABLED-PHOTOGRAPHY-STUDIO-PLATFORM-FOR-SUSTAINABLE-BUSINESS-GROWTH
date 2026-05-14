import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import "./common.css";
import "./dashboard.css";
import "./profile.css";

type StudioForm = {
  name: string;
  phone: string;
  location: string;
  pricing: number;
  experience: string;
  profilePhoto: string;
  availabilityStatus: string;
};

const defaultForm: StudioForm = {
  name: "",
  phone: "",
  location: "",
  pricing: 0,
  experience: "",
  profilePhoto: "",
  availabilityStatus: "available",
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PhotographerProfile() {
  const [form, setForm] = useState<StudioForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoLoadError, setPhotoLoadError] = useState(false);

  useEffect(() => {
    setPhotoLoadError(false);
  }, [form.profilePhoto]);

  useEffect(() => {
    API.get("/studios/profile")
      .then((res) => {
        const d = res.data.data || {};
        setForm({
          ...defaultForm,
          name: d.name ?? "",
          phone: d.phone ?? "",
          location: d.location ?? "",
          pricing: Number(d.pricing) || 0,
          experience: d.experience ?? "",
          profilePhoto: d.profilePhoto ?? "",
          availabilityStatus: d.availabilityStatus ?? "available",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const availabilityClass = useMemo(() => {
    const s = form.availabilityStatus || "available";
    if (s === "busy") return "busy";
    if (s === "offline") return "offline";
    return "available";
  }, [form.availabilityStatus]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put("/studios/profile", form);
      alert("Profile updated successfully.");
    } catch {
      alert("Could not save profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading your profile…</div>;
  }

  return (
    <div className="profile-page">
      <div className="glass-card profile-hero">
        <div className="profile-avatar-wrap">
          {form.profilePhoto?.trim() && !photoLoadError ? (
            <img
              className="profile-avatar"
              src={form.profilePhoto}
              alt=""
              onError={() => setPhotoLoadError(true)}
            />
          ) : (
            <div className="profile-avatar-placeholder" aria-hidden>
              {initials(form.name || "Studio")}
            </div>
          )}
        </div>
        <div className="profile-hero-text">
          <h1>{form.name || "Your studio"}</h1>
          <p>
            Update how clients see you — location, pricing, and availability appear on browse and portfolio.
          </p>
          <div className="profile-badge-row">
            <span className={`profile-badge ${availabilityClass}`}>
              {form.availabilityStatus === "busy"
                ? "Busy"
                : form.availabilityStatus === "offline"
                  ? "Offline"
                  : "Available"}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={save}>
        <div className="profile-grid">
          <div className="glass-card profile-section">
            <h2>Basic information</h2>
            <div className="input-group">
              <label htmlFor="pf-name">Studio / display name</label>
              <input
                id="pf-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Pixel Perfect Studio"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="pf-phone">Phone</label>
              <input
                id="pf-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                type="tel"
              />
            </div>
            <div className="input-group">
              <label htmlFor="pf-location">Location</label>
              <input
                id="pf-location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, area"
              />
            </div>
          </div>

          <div className="glass-card profile-section">
            <h2>Service & pricing</h2>
            <div className="input-group">
              <label htmlFor="pf-pricing">Starting price (₹)</label>
              <input
                id="pf-pricing"
                type="number"
                min={0}
                value={form.pricing || ""}
                onChange={(e) =>
                  setForm({ ...form, pricing: Number(e.target.value) || 0 })
                }
                placeholder="15000"
              />
              <p className="profile-hint">
                Shown on browse filters and helps clients compare packages.
              </p>
            </div>
            <div className="input-group">
              <label htmlFor="pf-availability">Availability</label>
              <select
                id="pf-availability"
                value={form.availabilityStatus}
                onChange={(e) =>
                  setForm({ ...form, availabilityStatus: e.target.value })
                }
              >
                <option value="available">Available for bookings</option>
                <option value="busy">Busy — limited slots</option>
                <option value="offline">Offline — not accepting new work</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card profile-section">
          <h2>About & experience</h2>
          <div className="input-group">
            <label htmlFor="pf-exp">Bio / experience</label>
            <textarea
              id="pf-exp"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              placeholder="Years of experience, specialties, gear, style…"
            />
          </div>
        </div>

        <div className="glass-card profile-section">
          <h2>Profile photo</h2>
          <div className="input-group">
            <label htmlFor="pf-photo-url">Image URL</label>
            <input
              id="pf-photo-url"
              value={form.profilePhoto}
              onChange={(e) => setForm({ ...form, profilePhoto: e.target.value })}
              placeholder="https://…"
              type="url"
            />
            <p className="profile-hint">
              Paste a direct image link. We’ll show it in the header and browse cards.
            </p>
          </div>
          {form.profilePhoto?.trim() ? (
            <div className="profile-photo-preview">
              <img src={form.profilePhoto} alt="Profile preview" />
            </div>
          ) : null}
        </div>

        <div className="profile-save-wrap">
          <button
            type="submit"
            className="primary-btn profile-save-btn"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
