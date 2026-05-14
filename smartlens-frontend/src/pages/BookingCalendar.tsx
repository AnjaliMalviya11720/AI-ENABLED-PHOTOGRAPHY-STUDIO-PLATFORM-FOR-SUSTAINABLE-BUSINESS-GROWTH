import { useEffect, useState } from "react";
import API from "../services/api";

export default function BookingCalendar() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    API.get("/bookings")
      .then((res) => setBookings(res.data.data || []))
      .catch(() => setBookings([]));
  }, []);

  const byDate = bookings.reduce((acc: Record<string, any[]>, booking) => {
    const key = new Date(booking.date).toLocaleDateString();
    acc[key] = acc[key] || [];
    acc[key].push(booking);
    return acc;
  }, {});

  return (
    <div style={{ padding: 24 }}>
      <h1>Booking Calendar</h1>
      {Object.keys(byDate).length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        Object.entries(byDate).map(([date, items]) => (
          <div key={date} style={{ marginBottom: 12, border: "1px solid rgba(17, 20, 57, 0.12)", borderRadius: 10, padding: 10, background: "rgba(255,255,255,0.94)" }}>
            <h3>{date}</h3>
            {(items as any[]).map((item) => (
              <div key={item._id}>
                {item.eventTime} - {item.eventType} - {item.location}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
