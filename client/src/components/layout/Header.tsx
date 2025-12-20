import { Box, Container, Typography } from "@mui/material";
import { fontSize16 } from "../utils/FontSize";
import { text } from "../../localization/eng";

export const Header = () => {
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
      <Container maxWidth="md" sx={{ px: 0 }}>
        <Typography
          variant="h1"
          fontSize={fontSize16}
          fontWeight="bold"
          sx={{ px: 2, py: 1 }}
        >
          {text.appName}
        </Typography>
      </Container>
    </Box>
  );
};
