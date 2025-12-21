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
import { createTodoForTrip } from "../../store/reducers/todos/todosSlice";
import { createNoteForTrip } from "../../store/reducers/notes/notesSlice";
import { setEditTrip } from "../../store/reducers/trips/tripsSlice";

import { TripDates } from "../utils/TripDates";

export const TripDetail = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const dispatch = useAppDispatch();
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
            boxShadow: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            px: 2,
            pb: 2,
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
          <Card variant="outlined" sx={{ mt: 1, p: 2 }}>
            <Typography fontSize={fontSize16} fontWeight="bold" sx={{ mb: 1 }}>
              {text.trips.tripDetail.connectedUsers}
            </Typography>
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
          <Typography
            variant="h3"
            fontSize={fontSize16}
            fontWeight="bold"
            sx={{ px: 2 }}
          >
            {text.todos.header}
          </Typography>
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
        <TodoList trip={trip} todos={trip?.todos ?? []} headingLevel="h3" />
        <Divider sx={{ my: 2 }} />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="h3"
            fontSize={fontSize16}
            fontWeight="bold"
            sx={{ px: 2 }}
          >
            {text.notes.header}
          </Typography>
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
        <NoteList trip={trip} notes={trip?.notes ?? []} headingLevel="h3" />
      </Container>
    </RtkQueryWrapper>
  );
};
