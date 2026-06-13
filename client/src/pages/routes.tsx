import { lazy } from "react";
import { Route } from "react-router-dom";
import { ERoutes } from "../models/enum/ERoutes";
import { ProtectedRoute } from "../components/wrapper/ProtectedRoute";

const AuthPage = lazy(() => import("./AuthPage").then((m) => ({ default: m.AuthPage })));
const TripsPage = lazy(() => import("./TripsPage").then((m) => ({ default: m.TripsPage })));
const NotesPage = lazy(() => import("./NotesPage").then((m) => ({ default: m.NotesPage })));
const TodosPage = lazy(() => import("./TodosPage").then((m) => ({ default: m.TodosPage })));
const UsersPage = lazy(() => import("./UsersPage").then((m) => ({ default: m.UsersPage })));
const ProfilePage = lazy(() => import("./ProfilePage").then((m) => ({ default: m.ProfilePage })));
const TripDetailPage = lazy(() => import("./TripDetailPage").then((m) => ({ default: m.TripDetailPage })));
const TripCalendarPage = lazy(() => import("./TripCalendarPage").then((m) => ({ default: m.TripCalendarPage })));
const NoteDetailPage = lazy(() => import("./NoteDetailPage").then((m) => ({ default: m.NoteDetailPage })));
const TodoDetailPage = lazy(() => import("./TodoDetailPage").then((m) => ({ default: m.TodoDetailPage })));

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
    key={ERoutes.TRIP_CALENDAR}
    path={ERoutes.TRIP_CALENDAR}
    element={
      <ProtectedRoute>
        <TripCalendarPage />
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
