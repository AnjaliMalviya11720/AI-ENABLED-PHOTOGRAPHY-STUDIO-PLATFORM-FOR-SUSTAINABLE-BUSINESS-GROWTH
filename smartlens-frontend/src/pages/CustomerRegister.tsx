import { useState } from "react";
import API from "../services/api";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./common.css";

export default function CustomerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/customers/register", formData);
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
          ?.message || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create customer account</h2>
        <p>Browse studios, send booking requests, track status</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Your name</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Phone (optional)</label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 ..."
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? "Creating Account..." : "Sign up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/customer/login">Customer login</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: 8 }}>
          Photographer / studio?{" "}
          <Link to="/register">Register as studio</Link>
        </p>
      </div>
    </div>
  );
}
