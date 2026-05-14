import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const email = localStorage.getItem("customerEmail") || "";

  useEffect(() => {
    if (!email) return;
    API.get(`/bookings/public/customer?email=${encodeURIComponent(email)}`)
      .then((res) => setBookings(res.data.data || []))
      .catch(() => setBookings([]));
  }, [email]);

  const upcomingBookings = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          new Date(booking.date).getTime() >= Date.now() &&
          booking.status !== "cancelled"
      ),
    [bookings]
  );

  const pastBookings = useMemo(
    () => bookings.filter((booking) => new Date(booking.date).getTime() < Date.now()),
    [bookings]
  );

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Customer Dashboard</h1>
      <p style={{ color: "#4f5687" }}>
        Upcoming bookings, past activity and notifications at one place.
      </p>

      <div style={{ marginTop: 16, border: "1px solid rgba(17, 20, 57, 0.12)", borderRadius: 12, padding: 14, background: "rgba(255,255,255,0.92)" }}>
        <h3>Upcoming Bookings</h3>
        {upcomingBookings.length === 0 && <div>No upcoming bookings.</div>}
        {upcomingBookings.map((booking) => (
          <div key={booking._id} style={{ marginBottom: 8 }}>
            {booking.eventType} - {new Date(booking.date).toLocaleDateString()} -{" "}
            {booking.status.toUpperCase()}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, border: "1px solid rgba(17, 20, 57, 0.12)", borderRadius: 12, padding: 14, background: "rgba(255,255,255,0.92)" }}>
        <h3>Past Bookings</h3>
        {pastBookings.length === 0 && <p>No past bookings.</p>}
        {pastBookings.map((booking) => (
          <div key={booking._id}>
            {booking.eventType} - {new Date(booking.date).toLocaleDateString()} -{" "}
            {booking.status.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}
