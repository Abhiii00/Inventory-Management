import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const role = getUserRole();

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
