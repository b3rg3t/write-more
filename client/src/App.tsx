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
import { NoteFormModal } from "./components/modal/NoteFormModal";
import { TodoFormModal } from "./components/modal/TodoFormModal";
import { TripFormModal } from "./components/modal/TripFormModal";
import { DeleteTripModal } from "./components/modal/DeleteTripModal";
import { DeleteTodoModal } from "./components/modal/DeleteTodoModal";
import { DeleteNoteModal } from "./components/modal/DeleteNoteModal";
import { Users } from "./components/user/Users";
import { AuthPage } from "./components/user/AuthPage";
import { ProtectedRoute } from "./components/wrapper/ProtectedRoute";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate(ERoutes.TRIPS);
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <TripFormModal />
      <DeleteTripModal />
      <NoteFormModal />
      <DeleteNoteModal />
      <TodoFormModal />
      <DeleteTodoModal />
      <Container maxWidth="md" sx={{ px: 1, py: 2, pt: 6, pb: 10 }}>
        <Routes>
          <Route
            path={ERoutes.AUTH}
            element={<AuthPage onSuccess={handleAuthSuccess} />}
          />
          <Route
            path={ERoutes.TRIPS}
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />
          <Route
            path={ERoutes.NOTES}
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path={ERoutes.TODOS}
            element={
              <ProtectedRoute>
                <Todos />
              </ProtectedRoute>
            }
          />
          <Route
            path={ERoutes.USERS}
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path={ERoutes.TRIP_DETAIL}
            element={
              <ProtectedRoute>
                <TripDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path={ERoutes.NOTE_DETAIL}
            element={
              <ProtectedRoute>
                <NoteDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path={ERoutes.TODO_DETAIL}
            element={
              <ProtectedRoute>
                <TodoDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
