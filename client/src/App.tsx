import { ThemeProvider } from "@emotion/react";
import "./styles/App.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Todos } from "./components/todos/Todos";
import { Container, Typography, Button, Box, Divider } from "@mui/material";
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
      <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
        <Container sx={{ px: 2 }}>
          <Typography variant="h1" fontSize={fontSize16} fontWeight="bold">
            {text.appName}
          </Typography>
          <Box sx={{ mt: 1, mb: 0 }}>
            <Button
              component={Link}
              to={ERoutes.TRIPS}
              variant={
                location.pathname === ERoutes.TRIPS ? "contained" : "outlined"
              }
              sx={{ mr: 1 }}
            >
              {text.trips.tripsList.header}
            </Button>
            <Button
              component={Link}
              to={ERoutes.NOTES}
              variant={
                location.pathname === ERoutes.NOTES ? "contained" : "outlined"
              }
              sx={{ mr: 1 }}
            >
              {text.notes.notesList.header}
            </Button>
            <Button
              component={Link}
              to={ERoutes.TODOS}
              variant={
                location.pathname === ERoutes.TODOS ? "contained" : "outlined"
              }
            >
              {text.todos.todosList.header}
            </Button>
          </Box>
        </Container>
        <Divider sx={{ mt: 1 }} />
        <Routes>
          <Route path={ERoutes.TRIPS} element={<Trips />} />
          <Route path={ERoutes.NOTES} element={<Notes />} />
          <Route path={ERoutes.TODOS} element={<Todos />} />
          <Route path={ERoutes.TRIP_DETAIL} element={<TripDetail />} />
          <Route path={ERoutes.NOTE_DETAIL} element={<NoteDetail />} />
          <Route path={ERoutes.TODO_DETAIL} element={<TodoDetail />} />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};

export default App;
