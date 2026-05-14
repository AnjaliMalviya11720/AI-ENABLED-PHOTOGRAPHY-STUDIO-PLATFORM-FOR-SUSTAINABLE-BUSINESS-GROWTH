import { useState } from "react";
import API from "../services/api";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./common.css";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/customers/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", "customer");
      if (res.data.customer?.email) {
        localStorage.setItem("customerEmail", res.data.customer.email);
      }
      const params = new URLSearchParams(location.search);
      const next = params.get("next");
      navigate(next || "/customer/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Customer login</h2>
        <p>Book photographers, track bookings & notifications</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          New here?{" "}
          <Link to="/customer/register">Create a customer account</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: 8 }}>
          Are you a photographer?{" "}
          <Link to="/login">Studio login</Link>
        </p>
      </div>
    </div>
  );
}
