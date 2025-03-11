import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const user = useSelector(state => state.user);

  if (!user || user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // If user has the required role, render the child routes
  return <Outlet />;
};

const ProtectedRouteAdmin = () => {
  const user = useSelector(state => state.user);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const ProtectedRouteUser = () => {
  const user = useSelector(state => state.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export {ProtectedRoute, ProtectedRouteAdmin, ProtectedRouteUser};