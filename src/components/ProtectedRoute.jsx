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

export default ProtectedRoute;