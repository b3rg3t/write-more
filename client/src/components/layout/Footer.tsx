import { Box, Button, Container } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";
import { text } from "../../localization/eng";

export const Footer = () => {
  const location = useLocation();
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        zIndex: 1000,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container sx={{ px: 2 }}>
        <Box
          sx={{
            my: 0.5,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            component={Link}
            to={ERoutes.TRIPS}
            variant={
              location.pathname === ERoutes.TRIPS ? "contained" : undefined
            }
          >
            {text.trips.header}
          </Button>
          <Button
            component={Link}
            to={ERoutes.NOTES}
            variant={
              location.pathname === ERoutes.NOTES ? "contained" : undefined
            }
          >
            {text.notes.header}
          </Button>
          <Button
            component={Link}
            to={ERoutes.TODOS}
            variant={
              location.pathname === ERoutes.TODOS ? "contained" : undefined
            }
          >
            {text.todos.header}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
