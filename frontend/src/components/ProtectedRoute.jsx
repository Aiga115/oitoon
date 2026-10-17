import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { user, admin } = useAuth();
  const loggedIn = role === "admin" ? admin : user;
  if (!loggedIn) {
    return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  }
  return children;
}