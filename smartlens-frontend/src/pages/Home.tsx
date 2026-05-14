import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./home.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"studio" | "customer" | "platform">(
    "studio"
  );

  useEffect(() => {
    document.body.classList.add("home-theme-stripe");
    return () => {
      document.body.classList.remove("home-theme-stripe");
    };
  }, []);

  const tabContent = {
    studio: {
      title: "Studio Control Center",
      body: "Manage profile, albums, bookings, earnings, pricing and availability after Studio Login.",
    },
    customer: {
      title: "Customer Booking Flow",
      body: "Find photographers, compare details, login as customer and send booking request in minutes.",
    },
    platform: {
      title: "Secure Role-Based Access",
      body: "Each role sees only its own features. Unauthorized access is redirected to correct login.",
    },
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>Welcome to SmartLens</h1>
        <p>Please choose your login type to continue.</p>

        <div className="home-login-grid">
          <Link to="/login" className="home-login-card">
            <h2 className="home-login-title">Studio Login</h2>
            <p className="home-login-sub">
              Manage bookings, albums, profile and earnings.
            </p>
          </Link>
          <Link to="/customer/login" className="home-login-card">
            <h2 className="home-login-title">Customer Login</h2>
            <p className="home-login-sub">
              Browse studios and request event bookings.
            </p>
          </Link>
        </div>
      </div>

      <div className="home-section-grid">
        <section className="home-panel">
          <h2>About SmartLens Studios</h2>
          <p>
            SmartLens verified photography studios ko connect karta hai customers ke
            saath. Har studio apna profile, pricing, albums aur availability manage
            karta hai, aur customer compare karke best photographer book kar sakta
            hai.
          </p>

          <div className="home-tab-row">
            <button
              type="button"
              className={`home-tab ${activeTab === "studio" ? "active" : ""}`}
              onClick={() => setActiveTab("studio")}
            >
              Studio
            </button>
            <button
              type="button"
              className={`home-tab ${activeTab === "customer" ? "active" : ""}`}
              onClick={() => setActiveTab("customer")}
            >
              Customer
            </button>
            <button
              type="button"
              className={`home-tab ${activeTab === "platform" ? "active" : ""}`}
              onClick={() => setActiveTab("platform")}
            >
              Platform
            </button>
          </div>
          <div className="home-mini-card">
            <h3>{tabContent[activeTab].title}</h3>
            <p>{tabContent[activeTab].body}</p>
          </div>
        </section>

        <section className="home-panel">
          <h2>Contact Us</h2>
          <p>Need help with booking or onboarding your studio?</p>
          <div className="home-contact-line">
            Email: support@smartlens.com | Phone: +91 98765 43210
          </div>
          <p>We are available Monday to Saturday for support and onboarding.</p>
        </section>
      </div>

      <p className="home-note">
        Tip: pehle login karein, phir role-based features automatically open ho
        jayenge.
      </p>
    </div>
  );
}
