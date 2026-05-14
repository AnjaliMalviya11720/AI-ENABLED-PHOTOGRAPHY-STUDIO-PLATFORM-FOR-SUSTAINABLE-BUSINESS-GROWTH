import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "./portfolio.css";

export default function Portfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studio, setStudio] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    date: "",
    eventTime: "",
    location: "",
    eventType: "Wedding"
    ,
    budget: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get(`/public/studios/${id}`)
      .then(res => {
        setStudio(res.data.data.studio);
        setPhotos(res.data.data.photos);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Pre-fill booking form when logged in as customer
  useEffect(() => {
    if (localStorage.getItem("userRole") !== "customer") return;
    const token = localStorage.getItem("token");
    if (!token) return;
    API.get("/customers/profile")
      .then((res) => {
        const c = res.data.data;
        if (!c) return;
        setBookingForm((prev) => ({
          ...prev,
          clientName: c.name || prev.clientName,
          clientEmail: c.email || prev.clientEmail,
          clientPhone: c.phone || prev.clientPhone,
        }));
        if (c.email) localStorage.setItem("customerEmail", c.email);
      })
      .catch(() => {});
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "customer") {
      alert("Booking karne ke liye customer login zaroori hai.");
      navigate(`/customer/login?next=${encodeURIComponent(`/p/${id}`)}`);
      return;
    }
    setSubmitting(true);
    try {
      await API.post(`/bookings/public/${id}`, bookingForm);
      localStorage.setItem("customerEmail", bookingForm.clientEmail);
      alert("Booking request sent successfully! The studio will contact you soon.");
      setShowBooking(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Loading Portfolio...</div>;
  if (!studio) return <div className="error-state">Studio not found</div>;

  const handleBookClick = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "customer") {
      navigate(`/customer/login?next=${encodeURIComponent(`/p/${id}`)}`);
      return;
    }
    setShowBooking(true);
  };

  return (
    <div className="portfolio-container">
      <div className="portfolio-hero">
        <h1>{studio.name}</h1>
        <p>Professional Photography Portfolio</p>
        <button className="primary-btn book-btn" onClick={handleBookClick}>
          Book a Session
        </button>
      </div>

      {showBooking && (
        <div className="booking-modal">
          <div className="modal-content glass-panel">
            <span className="close-btn" onClick={() => setShowBooking(false)}>&times;</span>
            <h2>Request a Booking</h2>
            <form onSubmit={handleBooking}>
              <div className="input-group">
                <label>Your Name</label>
                <input required type="text" value={bookingForm.clientName} onChange={e => setBookingForm({...bookingForm, clientName: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input required type="email" value={bookingForm.clientEmail} onChange={e => setBookingForm({...bookingForm, clientEmail: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input required type="tel" value={bookingForm.clientPhone} onChange={e => setBookingForm({...bookingForm, clientPhone: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Date</label>
                <input required type="date" value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Event Time</label>
                <input required type="time" value={bookingForm.eventTime} onChange={e => setBookingForm({...bookingForm, eventTime: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Location</label>
                <input required type="text" value={bookingForm.location} onChange={e => setBookingForm({...bookingForm, location: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Event Type</label>
                <select value={bookingForm.eventType} onChange={e => setBookingForm({...bookingForm, eventType: e.target.value})}>
                  <option>Wedding</option>
                  <option>Pre-Wedding</option>
                  <option>Portrait</option>
                  <option>Corporate Event</option>
                </select>
              </div>
              <div className="input-group">
                <label>Budget</label>
                <input required type="number" min="0" value={bookingForm.budget} onChange={e => setBookingForm({...bookingForm, budget: e.target.value})} />
              </div>
              <button type="submit" disabled={submitting} className="primary-btn">
                {submitting ? "Sending..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="masonry-grid">
        {photos.map(photo => (
          <div key={photo._id} className="masonry-item">
            <img src={photo.imageUrl} alt={photo.title} />
            <div className="overlay">
              <span>{photo.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
