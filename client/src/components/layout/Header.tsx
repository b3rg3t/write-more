import { Box, Container, Stack, Typography, IconButton } from "@mui/material";
import { fontSize16 } from "../utils/FontSize";
import { text } from "../../localization/eng";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ShareIcon from "@mui/icons-material/Share";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";
import { useAppDispatch } from "../../store/redux/hooks";
import { apiSlice } from "../../store/reducers/api/apiSlice";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(apiSlice.util.resetApiState());
    navigate(ERoutes.AUTH);
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
