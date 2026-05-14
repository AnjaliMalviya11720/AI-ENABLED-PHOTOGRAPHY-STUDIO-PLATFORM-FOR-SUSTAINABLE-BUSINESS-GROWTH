import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole") || "photographer";

  const handleLogout = () => {
    const wasCustomer = localStorage.getItem("userRole") === "customer";
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("customerEmail");
    navigate(wasCustomer ? "/customer/login" : "/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link
          to={
            token && role === "customer"
              ? "/customer/dashboard"
              : token
                ? "/dashboard"
                : "/"
          }
        >
          📸 SmartLens
        </Link>
      </div>
      <div className="navbar-links">
        {token ? (
          <>
            {role === "customer" ? (
              <>
                <Link to="/customer/dashboard">Dashboard</Link>
                <Link to="/browse-photographers">Browse photographers</Link>
                <Link to="/customer/bookings">My bookings</Link>
                <Link to="/customer/notifications">Notifications</Link>
                <Link to="/customer/payments">Payments</Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/photographer/profile">Profile</Link>
                <Link to="/gallery">My Photos</Link>
                <Link to="/photographer/albums">Albums</Link>
                <Link to="/bookings">Bookings</Link>
                <Link to="/photographer/calendar">Calendar</Link>
                <Link to="/billing">Billing</Link>
                <Link to="/photographer/earnings">Earnings</Link>
                <Link to="/photographer/settings">Settings</Link>
                <Link to="/photographer/booking-requests">Requests</Link>
              </>
            )}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/customer/login">Customer login</Link>
            <Link to="/login">Studio login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
