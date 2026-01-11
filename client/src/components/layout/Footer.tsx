import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";
import { text } from "../../localization/eng";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { isMobileSafari, isSafari } from "react-device-detect";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { About } from "./About";

export const Footer = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            py: 1,
            borderRadius: 1,
            backgroundColor: "background.paper",
            maxWidth: 400,
          }}
        >
          <About />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Drawer
        anchor={"bottom"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ position: "relative", p: 2 }}>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <About />
        </Box>
      </Drawer>
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
          pb: isMobileSafari || isSafari ? 2 : 0,
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
                boxShadow: "none",
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
                boxShadow: "none",
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
                boxShadow: "none",
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
            <Button
              variant={undefined}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "none",
              }}
              onClick={() => setDrawerOpen((prevState) => !prevState)}
            >
              <InfoOutlineIcon />
              <Typography fontSize={8} color={"primary"}>
                {text.footer.about}
              </Typography>
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};
