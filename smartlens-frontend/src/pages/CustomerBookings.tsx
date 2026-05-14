import { useEffect, useState } from "react";
import API from "../services/api";

export default function CustomerBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const email = localStorage.getItem("customerEmail") || "";

  useEffect(() => {
    if (!email) return;
    API.get(`/bookings/public/customer?email=${encodeURIComponent(email)}`)
      .then((res) => setBookings(res.data.data || []))
      .catch(() => setBookings([]));
  }, [email]);

  if (!email) {
    return <div style={{ padding: 24 }}>Book one event first to view your bookings.</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>My Bookings</h1>
      {bookings.map((booking) => (
        <div key={booking._id} style={{ border: "1px solid rgba(17, 20, 57, 0.12)", padding: 10, borderRadius: 10, marginBottom: 8, background: "rgba(255,255,255,0.94)" }}>
          {booking.eventType} - {new Date(booking.date).toLocaleDateString()} {booking.eventTime} - {booking.status}
        </div>
      ))}
    </div>
  );
}
