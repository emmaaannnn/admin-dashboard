import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminSession } from "../providers/AdminSessionProvider";

function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isHydrated } = useAdminSession();

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;