import { Box, Button, Container, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";
import { text } from "../../localization/eng";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

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
            my: 0,
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
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FlightTakeoffIcon />
            <Typography
              fontSize={8}
              color={
                location.pathname === ERoutes.TRIPS ? "secondary" : "primary"
              }
            >
              {text.trips.header}
            </Typography>
          </Button>
          <Button
            component={Link}
            to={ERoutes.NOTES}
            variant={
              location.pathname === ERoutes.NOTES ? "contained" : undefined
            }
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StickyNote2Icon />
            <Typography
              fontSize={8}
              color={
                location.pathname === ERoutes.NOTES ? "secondary" : "primary"
              }
            >
              {text.notes.header}
            </Typography>
          </Button>
          <Button
            component={Link}
            to={ERoutes.TODOS}
            variant={
              location.pathname === ERoutes.TODOS ? "contained" : undefined
            }
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormatListBulletedIcon />
            <Typography
              fontSize={8}
              color={
                location.pathname === ERoutes.TODOS ? "secondary" : "primary"
              }
            >
              {text.todos.header}
            </Typography>
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
