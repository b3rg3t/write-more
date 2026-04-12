import { Box, Container, Stack, Typography, IconButton } from "@mui/material";
import { fontSize16 } from "../utils/FontSize";
import { text } from "../../localization/eng";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ShareIcon from "@mui/icons-material/Share";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";
import { useAppDispatch } from "../../store/redux/hooks";
import { apiSlice } from "../../store/reducers/api/apiSlice";
import {
  clearCredentials,
  TOKEN_STORAGE_KEY,
} from "../../util/authCredentials";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = !!localStorage.getItem(TOKEN_STORAGE_KEY);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleLogout = () => {
    clearCredentials();
    dispatch(apiSlice.util.resetApiState());
    navigate(ERoutes.AUTH);
  };

  const handleOpenProfile = () => {
    navigate(ERoutes.PROFILE);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        zIndex: 1000,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="md" sx={{ px: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center">
            <BorderColorIcon sx={{ mr: 1 }} fontSize="small" color="primary" />
            <Typography
              variant="h1"
              fontSize={fontSize16}
              fontWeight="bold"
              sx={{ py: 1 }}
            >
              {text.appName}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              color="primary"
              onClick={handleCopyUrl}
              aria-label="copy current URL"
            >
              <ShareIcon />
            </IconButton>
            {isAuthenticated && (
              <IconButton
                color="primary"
                onClick={handleOpenProfile}
                aria-label={text.user.profile.open}
                size="small"
              >
                <AccountCircleIcon />
              </IconButton>
            )}
            {isAuthenticated && (
              <IconButton
                color="primary"
                onClick={handleLogout}
                aria-label="logout"
                size="small"
              >
                <LogoutIcon />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
