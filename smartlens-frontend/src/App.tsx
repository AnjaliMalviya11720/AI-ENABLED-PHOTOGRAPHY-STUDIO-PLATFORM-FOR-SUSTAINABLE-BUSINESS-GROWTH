import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PhotographerProtectedRoute from "./components/PhotographerProtectedRoute";
import CustomerProtectedRoute from "./components/CustomerProtectedRoute";
import AuthRequiredRoute from "./components/AuthRequiredRoute";
import AdminRoute from "./components/AdminRoute";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Gallery from "./pages/Gallery";
import Billing from "./pages/Billing";
import Portfolio from "./pages/Portfolio";
import Bookings from "./pages/Bookings";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import BrowsePhotographers from "./pages/BrowsePhotographers";
import CustomerDashboard from "./pages/CustomerDashboard";
import GenericFeaturePage from "./pages/GenericFeaturePage";
import PhotographerProfile from "./pages/PhotographerProfile";
import AlbumManagement from "./pages/AlbumManagement";
import BookingCalendar from "./pages/BookingCalendar";
import Earnings from "./pages/Earnings";
import Settings from "./pages/Settings";
import CustomerBookings from "./pages/CustomerBookings";
import CustomerNotifications from "./pages/CustomerNotifications";
import CustomerPayments from "./pages/CustomerPayments";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerRegister from "./pages/CustomerRegister";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route
          path="/forgot-password"
          element={
            <GenericFeaturePage
              title="Forgot Password"
              subtitle="Password reset workflow placeholder."
              points={[
                "Reset request form can be connected to backend email OTP",
                "Secure token validation and password update pending",
              ]}
            />
          }
        />
        <Route path="/admin" element={<AdminRoute />} />

        {/* Routes that require any authenticated user */}
        <Route element={<AuthRequiredRoute />}>
          <Route
            path="/about"
            element={
              <GenericFeaturePage
                title="About Us"
                subtitle="Photographer booking and studio growth platform."
                points={[
                  "Multi-role architecture foundation added",
                  "Public browsing and booking flow scaffolded",
                  "Studio dashboard and admin analytics already integrated",
                ]}
              />
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/p/:id" element={<Portfolio />} />
          <Route path="/browse-photographers" element={<BrowsePhotographers />} />
          <Route
            path="/booking-page"
            element={
              <GenericFeaturePage
                title="Booking Page"
                subtitle="Customer booking request form."
                points={[
                  "Fields: event date, event time, location, event type, budget",
                  "Photographer can accept/reject requests from dashboard",
                ]}
              />
            }
          />
        </Route>

        <Route element={<CustomerProtectedRoute />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/bookings" element={<CustomerBookings />} />
          <Route path="/customer/payments" element={<CustomerPayments />} />
          <Route path="/customer/notifications" element={<CustomerNotifications />} />
        </Route>

        {/* Protected Studio / photographer routes */}
        <Route element={<PhotographerProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route
            path="/photographer/profile"
            element={<PhotographerProfile />}
          />
          <Route
            path="/photographer/albums"
            element={<AlbumManagement />}
          />
          <Route
            path="/photographer/booking-requests"
            element={
              <GenericFeaturePage
                title="Booking Requests"
                subtitle="Accept/reject workflow based on location and offered price."
                points={[
                  "Request list with customer details",
                  "Compare price and location",
                  "Accept/Reject with status updates",
                ]}
              />
            }
          />
          <Route
            path="/photographer/calendar"
            element={<BookingCalendar />}
          />
          <Route
            path="/photographer/earnings"
            element={<Earnings />}
          />
          <Route
            path="/photographer/settings"
            element={<Settings />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
