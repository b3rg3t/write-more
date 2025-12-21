import { FC } from "react";
import { Navigate } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to auth page if not authenticated
    return <Navigate to={ERoutes.AUTH} replace />;
  }

  return <>{children}</>;
};
