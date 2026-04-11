import { FC, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";
import {
  clearCredentials,
  TOKEN_STORAGE_KEY,
} from "../../util/authCredentials";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  useEffect(() => {
    if (!token) {
      clearCredentials();
    }
  }, [token]);

  if (!token) {
    // Redirect to auth page if not authenticated
    return <Navigate to={ERoutes.AUTH} replace />;
  }

  return <>{children}</>;
};
