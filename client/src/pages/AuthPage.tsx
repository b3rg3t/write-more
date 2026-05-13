import { AuthPage as AuthPageComponent } from "../components/user/AuthPage";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "../models/enum/ERoutes";

export const AuthPage = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate(ERoutes.TRIPS);
  };

  return <AuthPageComponent onSuccess={handleAuthSuccess} />;
};
