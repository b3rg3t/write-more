import { ThemeProvider } from "@emotion/react";
import "./styles/App.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Container } from "@mui/material";
import { Routes } from "react-router-dom";
import { theme } from "./theme";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { NoteFormModal } from "./components/modal/NoteFormModal";
import { TodoFormModal } from "./components/modal/TodoFormModal";
import { TripFormModal } from "./components/modal/TripFormModal";
import { DeleteModal } from "./components/modal/DeleteModal";
import { UpdatePrompt } from "./components/utils/UpdatePrompt";
import { AddUserToTripModal } from "./components/modal/AddUserToTripModal";
import { appRoutes } from "./pages/routes";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <UpdatePrompt />
      <Header />
      <TripFormModal />
      <DeleteModal resourceType="trip" />
      <AddUserToTripModal />
      <NoteFormModal />
      <DeleteModal resourceType="note" />
      <TodoFormModal />
      <DeleteModal resourceType="todo" />
      <Container maxWidth="md" sx={{ px: 1, py: 2, pt: 6, pb: 10 }}>
        <Routes>{appRoutes}</Routes>
      </Container>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
