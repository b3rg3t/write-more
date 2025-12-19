import { ThemeProvider } from "@emotion/react";
import "./styles/App.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Todos } from "./components/todos/Todos";
import { Container, Typography, Button, Box } from "@mui/material";
import { text } from "./localization/eng";
import { fontSize16 } from "./components/utils/FontSize";
import { Notes } from "./components/notes/Notes";
import { Trips } from "./components/trips/Trips";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { TripDetail } from "./components/trips/TripDetail";
import { NoteDetail } from "./components/notes/NoteDetail";
import { TodoDetail } from "./components/todos/TodoDetail";
import { ERoutes } from "./models/enum/ERoutes";
import { theme } from "./theme";

const App = () => {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
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
      <Container maxWidth="md" sx={{ px: 0, py: 2, pt: 6, pb: 10 }}>
        <Routes>
          <Route path={ERoutes.TRIPS} element={<Trips />} />
          <Route path={ERoutes.NOTES} element={<Notes />} />
          <Route path={ERoutes.TODOS} element={<Todos />} />
          <Route path={ERoutes.TRIP_DETAIL} element={<TripDetail />} />
          <Route path={ERoutes.NOTE_DETAIL} element={<NoteDetail />} />
          <Route path={ERoutes.TODO_DETAIL} element={<TodoDetail />} />
        </Routes>
      </Container>
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
              mt: 1,
              mb: 1,
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
              sx={{ mr: 1 }}
            >
              {text.trips.header}
            </Button>
            <Button
              component={Link}
              to={ERoutes.NOTES}
              variant={
                location.pathname === ERoutes.NOTES ? "contained" : undefined
              }
              sx={{ mr: 1 }}
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
    </ThemeProvider>
  );
};

export default App;
