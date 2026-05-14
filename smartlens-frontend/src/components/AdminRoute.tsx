import { Navigate } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";

/** Admin UI — not for customer accounts. */
export default function AdminRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role === "customer") {
    return <Navigate to="/customer/dashboard" replace />;
  }
  return <AdminDashboard />;
}
