import { useEffect, useState } from "react";
import API from "../services/api";

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const email = localStorage.getItem("customerEmail") || "";

  useEffect(() => {
    if (!email) return;
    API.get(`/bookings/public/notifications?email=${encodeURIComponent(email)}`)
      .then((res) => setNotifications(res.data.data || []))
      .catch(() => setNotifications([]));
  }, [email]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <div key={notification.id} style={{ marginBottom: 8 }}>
            {notification.message}
          </div>
        ))
      )}
    </div>
  );
}
