import { Navigate, Outlet } from "react-router-dom";

/** Studio / photographer tools — customers are redirected to their dashboard. */
export default function PhotographerProtectedRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role === "customer") {
    return <Navigate to="/customer/dashboard" replace />;
  }
  return <Outlet />;
}
