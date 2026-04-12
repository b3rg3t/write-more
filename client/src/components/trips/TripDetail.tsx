import { useParams } from "react-router-dom";
import { useGetTripQuery } from "../../store/reducers/api/apiSlice";
import {
  Card,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { text } from "../../localization/eng";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { TodoList } from "../todos/TodoList";
import { NoteList } from "../notes/NoteList";
import { fontSize16 } from "../utils/FontSize";
import { useAppDispatch } from "../../store/redux/hooks";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { createTodoForTrip } from "../../store/reducers/todos/todosSlice";
import { createNoteForTrip } from "../../store/reducers/notes/notesSlice";
import { setEditTrip } from "../../store/reducers/trips/tripsSlice";
import { setAddUserToTrip } from "../../store/reducers/trips/tripUsersSlice";

import { TripDates } from "../utils/TripDates";
import { useState } from "react";

export const TripDetail = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const dispatch = useAppDispatch();
  const [showTodos, setShowTodos] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const {
    data: trip,
    isLoading,
    error,
    isUninitialized,
  } = useGetTripQuery(tripId!);

  const handleCreateTodo = () => {
    if (trip) {
      dispatch(createTodoForTrip(trip._id));
    }
  };

  const handleCreateNote = () => {
    if (trip) {
      dispatch(createNoteForTrip(trip._id));
    }
  };

  const handleEditTrip = () => {
    if (trip) {
      dispatch(setEditTrip(trip._id));
    }
  };

  const handleAddUser = () => {
    if (trip) {
      dispatch(setAddUserToTrip(trip._id));
    }
  };

  const handleToggleTodoVisibility = () => {
    setShowTodos((prev) => !prev);
  };

  const handleToggleNoteVisibility = () => {
    setShowNotes((prev) => !prev);
  };

  return (
    <RtkQueryWrapper
      isLoading={isLoading || isUninitialized}
      data={trip ? [trip] : []}
      error={error}
      texts={{
        loading: text.trips.tripDetail.loading,
        createMessage: "",
        noData: text.trips.tripDetail.notFound,
        fetchError: text.trips.tripDetail.notFound,
      }}
    >
      <Container maxWidth="md" sx={{ px: 0 }}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Typography fontSize={"small"}>
            {trip?.createdBy && `@${trip.createdBy.username}`}
          </Typography>
          <Typography fontSize={"small"}>
            {trip?.createdAt &&
              new Date(trip.createdAt).toLocaleString(undefined, {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
          </Typography>
        </Stack>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            px: 2,
            pb: 2,
            pt: 1,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Typography
              variant="h2"
              fontSize={fontSize16}
              sx={{ fontWeight: 600, mt: 1 }}
            >
              {trip?.title}
            </Typography>
            <IconButton
              color="primary"
              edge="end"
              aria-label="edit"
              onClick={(e) => {
                e.stopPropagation();
                handleEditTrip();
              }}
            >
              <EditSquareIcon />
            </IconButton>
          </Stack>
          <TripDates startDate={trip?.startDate} endDate={trip?.endDate} />
          <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
            {trip?.description}
          </Typography>
        </Card>
        {trip?.users && trip.users.length > 0 && (
          <Card variant="outlined" sx={{ mt: 1, p: 2, pt: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h3" fontSize={fontSize16} fontWeight="bold">
                {text.users.header}
              </Typography>
              <IconButton
                color="info"
                edge="end"
                aria-label="add user"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddUser();
                }}
              >
                <GroupAddIcon />
              </IconButton>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {trip.users.map((user, index) => {
                if (typeof user === "string") {
                  return (
                    <Typography key={index} fontSize={"small"}>
                      {user}
                    </Typography>
                  );
                }
                const displayName =
                  user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : `@${user.username}`;
                return (
                  <Typography
                    key={user._id}
                    fontSize={"small"}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      backgroundColor: "primary.light",
                      borderRadius: 2,
                      color: "primary.contrastText",
                    }}
                  >
                    {`@${user.username}, ${displayName}`}
                  </Typography>
                );
              })}
            </Stack>
          </Card>
        )}
        <Divider sx={{ my: 2 }} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="h3"
              fontSize={fontSize16}
              fontWeight="bold"
              sx={{ pl: 2 }}
            >
              {text.todos.header}
            </Typography>
            <IconButton
              size="small"
              color="info"
              edge="end"
              aria-label="toggle todo visibility"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleTodoVisibility();
              }}
              sx={{ ml: 0 }}
            >
              {showTodos ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Stack>
          <IconButton
            color="info"
            edge="end"
            aria-label="add todo"
            onClick={(e) => {
              e.stopPropagation();
              handleCreateTodo();
            }}
            sx={{ mr: 1 }}
          >
            <FormatListBulletedAddIcon />
          </IconButton>
        </Stack>
        {showTodos && (
          <TodoList trip={trip} todos={trip?.todos ?? []} headingLevel="h3" />
        )}
        <Divider sx={{ my: 2 }} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="h3"
              fontSize={fontSize16}
              fontWeight="bold"
              sx={{ pl: 2 }}
            >
              {text.notes.header}
            </Typography>
            <IconButton
              size="small"
              color="secondary"
              edge="end"
              aria-label="toggle note visibility"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleNoteVisibility();
              }}
              sx={{ ml: 0 }}
            >
              {showNotes ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Stack>
          <IconButton
            color="secondary"
            edge="end"
            aria-label="add note"
            onClick={(e) => {
              e.stopPropagation();
              handleCreateNote();
            }}
            sx={{ mr: 1 }}
          >
            <NoteAddIcon />
          </IconButton>
        </Stack>
        {showNotes && (
          <NoteList trip={trip} notes={trip?.notes ?? []} headingLevel="h3" />
        )}
      </Container>
    </RtkQueryWrapper>
  );
};
