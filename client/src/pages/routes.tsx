import { Route } from "react-router-dom";
import { ERoutes } from "../models/enum/ERoutes";
import { ProtectedRoute } from "../components/wrapper/ProtectedRoute";
import { AuthPage } from "./AuthPage";
import { TripsPage } from "./TripsPage";
import { NotesPage } from "./NotesPage";
import { TodosPage } from "./TodosPage";
import { UsersPage } from "./UsersPage";
import { ProfilePage } from "./ProfilePage";
import { TripDetailPage } from "./TripDetailPage";
import { NoteDetailPage } from "./NoteDetailPage";
import { TodoDetailPage } from "./TodoDetailPage";

export const appRoutes = [
  <Route key={ERoutes.AUTH} path={ERoutes.AUTH} element={<AuthPage />} />,
  <Route
    key={ERoutes.TRIPS}
    path={ERoutes.TRIPS}
    element={
      <ProtectedRoute>
        <TripsPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key={ERoutes.NOTES}
    path={ERoutes.NOTES}
    element={
      <ProtectedRoute>
        <NotesPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key={ERoutes.TODOS}
    path={ERoutes.TODOS}
    element={
      <ProtectedRoute>
        <TodosPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key={ERoutes.USERS}
    path={ERoutes.USERS}
    element={
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key={ERoutes.PROFILE}
    path={ERoutes.PROFILE}
    element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    }
  />,
  <Route
    key={ERoutes.TRIP_DETAIL}
    path={ERoutes.TRIP_DETAIL}
    element={
      <ProtectedRoute>
        <TripDetailPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key={ERoutes.NOTE_DETAIL}
    path={ERoutes.NOTE_DETAIL}
    element={
      <ProtectedRoute>
        <NoteDetailPage />
      </ProtectedRoute>
    }
  />,
  <Route
    key={ERoutes.TODO_DETAIL}
    path={ERoutes.TODO_DETAIL}
    element={
      <ProtectedRoute>
        <TodoDetailPage />
      </ProtectedRoute>
    }
  />,
];
