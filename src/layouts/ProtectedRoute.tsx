import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/AuthStore";

export default function ProtectedRoute() {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}