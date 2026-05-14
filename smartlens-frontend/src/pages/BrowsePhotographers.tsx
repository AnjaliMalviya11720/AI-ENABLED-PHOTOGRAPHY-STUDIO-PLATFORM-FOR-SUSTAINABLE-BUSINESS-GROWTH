import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

type Photographer = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  eventType: string;
};

export default function BrowsePhotographers() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [location, setLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [maxPrice, setMaxPrice] = useState(20000);

  useEffect(() => {
    API.get("/public/photographers")
      .then((res) => {
        const data = (res.data.data || []).map((studio: any) => ({
          id: studio._id,
          name: studio.name,
          location: studio.location || "N/A",
          price: Number(studio.pricing || 0),
          rating: 4.5,
          eventType: "Wedding",
        }));
        setPhotographers(data);
      })
      .catch(() => setPhotographers([]));
  }, []);

  const filtered = useMemo(
    () =>
      photographers.filter(
        (p) =>
          (!location || p.location.toLowerCase().includes(location.toLowerCase())) &&
          (!eventType || p.eventType === eventType) &&
          p.price <= maxPrice
      ),
    [location, eventType, maxPrice]
  );

  return (
    <div style={{ padding: 24, maxWidth: 950, margin: "0 auto" }}>
      <h1>Browse Photographers</h1>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <option value="">All Events</option>
          <option>Wedding</option>
          <option>Birthday</option>
          <option>Event</option>
        </select>
        <input
          type="range"
          min={5000}
          max={25000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
        <span>Max Price: {maxPrice}</span>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map((p) => (
          <div key={p.id} style={{ border: "1px solid rgba(17, 20, 57, 0.12)", borderRadius: 12, padding: 14, background: "rgba(255,255,255,0.94)" }}>
            <h3 style={{ margin: 0 }}>{p.name}</h3>
            <p style={{ margin: "6px 0", color: "#4f5687" }}>
              {p.location} | {p.eventType} | Rating {p.rating} | Starting {p.price}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <Link to={`/p/${p.id}`}>View Profile</Link>
              <Link to="/booking-page">Book Now</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
