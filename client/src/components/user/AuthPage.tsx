import { FC, useState } from "react";
import { SigninForm } from "./SigninForm";
import { SignupForm } from "./SignupForm";
import { Box } from "@mui/material";

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: FC<AuthPageProps> = ({ onSuccess }) => {
  const [showSignin, setShowSignin] = useState(true);

  return (
    <Box sx={{ p: 3 }}>
      {showSignin ? (
        <SigninForm
          onSuccess={onSuccess}
          onSwitchToSignup={() => setShowSignin(false)}
        />
      ) : (
        <SignupForm
          onSuccess={onSuccess}
          onSwitchToSignin={() => setShowSignin(true)}
        />
      )}
    </Box>
  );
};
