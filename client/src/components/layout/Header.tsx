import { Box, Container, Stack, Typography, IconButton } from "@mui/material";
import { fontSize16 } from "../utils/FontSize";
import { text } from "../../localization/eng";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ShareIcon from "@mui/icons-material/Share";

export const Header = () => {
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
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
          <IconButton
            color="primary"
            onClick={handleCopyUrl}
            aria-label="copy current URL"
          >
            <ShareIcon />
          </IconButton>
        </Stack>
      </Container>
    </Box>
  );
};
