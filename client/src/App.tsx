import { ThemeProvider } from "@emotion/react";
import "./styles/App.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Todos } from "./components/todos/Todos";
import { Container } from "@mui/material";
import { Notes } from "./components/notes/Notes";
import { Trips } from "./components/trips/Trips";
import { Routes, Route } from "react-router-dom";
import { TripDetail } from "./components/trips/TripDetail";
import { NoteDetail } from "./components/notes/NoteDetail";
import { TodoDetail } from "./components/todos/TodoDetail";
import { ERoutes } from "./models/enum/ERoutes";
import { theme } from "./theme";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container maxWidth="md" sx={{ px: 1, py: 2, pt: 6, pb: 10 }}>
        <Routes>
          <Route path={ERoutes.TRIPS} element={<Trips />} />
          <Route path={ERoutes.NOTES} element={<Notes />} />
          <Route path={ERoutes.TODOS} element={<Todos />} />
          <Route path={ERoutes.TRIP_DETAIL} element={<TripDetail />} />
          <Route path={ERoutes.NOTE_DETAIL} element={<NoteDetail />} />
          <Route path={ERoutes.TODO_DETAIL} element={<TodoDetail />} />
        </Routes>
      </Container>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
