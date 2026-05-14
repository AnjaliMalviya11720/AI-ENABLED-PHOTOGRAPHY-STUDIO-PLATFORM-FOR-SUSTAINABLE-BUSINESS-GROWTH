import { Navigate, Outlet } from "react-router-dom";

/** Only logged-in customers (not photographers). */
export default function CustomerProtectedRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/customer/login" replace />;
  }
  if (role !== "customer") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
