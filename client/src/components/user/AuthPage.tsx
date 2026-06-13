import { FC, useState } from "react";
import { SigninForm } from "./SigninForm";
import { SignupForm } from "./SignupForm";
import { Box, Stack, Typography } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { text } from "../../localization/eng";

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: FC<AuthPageProps> = ({ onSuccess }) => {
  const [showSignin, setShowSignin] = useState(true);

  return (
    <Box sx={{ p: 0 }}>
      <Stack alignItems="center" spacing={0.5} sx={{ mt: 6, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <BorderColorIcon color="primary" />
          <Typography variant="h1" fontSize="1.5rem" color="primary">
            {text.appName}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {text.tagline}
        </Typography>
      </Stack>
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
