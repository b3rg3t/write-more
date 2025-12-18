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
import { Routes, Route, Link } from "react-router-dom";
import { TripDetail } from "./components/trips/TripDetail";
import { theme } from "./theme";

const App = () => (
  <ThemeProvider theme={theme}>
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <Container sx={{ px: 2 }}>
        <Typography variant="h1" fontSize={fontSize16} fontWeight="bold">
          {text.appName}
        </Typography>
        <Box sx={{ mt: 1, mb: 0 }}>
          <Button component={Link} to="/" variant="outlined" sx={{ mr: 1 }}>
            {text.trips.tripsList.header}
          </Button>
          <Button
            component={Link}
            to="/notes"
            variant="outlined"
            sx={{ mr: 1 }}
          >
            {text.notes.notesList.header}
          </Button>
          <Button component={Link} to="/todos" variant="outlined">
            {text.todos.todosList.header}
          </Button>
        </Box>
      </Container>
      <Divider sx={{ mt: 1 }} />
      <Routes>
        <Route path="/" element={<Trips />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/trip/:id" element={<TripDetail />} />
      </Routes>
    </Container>
  </ThemeProvider>
);

export default App;
