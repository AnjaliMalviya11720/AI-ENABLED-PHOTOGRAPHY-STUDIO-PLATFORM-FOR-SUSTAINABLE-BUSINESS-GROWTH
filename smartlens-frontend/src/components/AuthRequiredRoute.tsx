import { Navigate, Outlet } from "react-router-dom";

/** Any logged-in account can access wrapped routes. */
export default function AuthRequiredRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role === "customer") {
    return <Outlet />;
  }

  return <Outlet />;
}
