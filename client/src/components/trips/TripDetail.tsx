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
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { createTodoForTrip } from "../../store/reducers/todos/todosSlice";
import { createNoteForTrip } from "../../store/reducers/notes/notesSlice";
import { setEditTrip } from "../../store/reducers/trips/tripsSlice";
import { TripFormModal } from "../modal/TripFormModal";
import { DeleteTripModal } from "../modal/DeleteTripModal";

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
      <TripFormModal />
      <DeleteTripModal />
      <Container maxWidth="md" sx={{ px: 0 }}>
        <Stack direction="row" justifyContent="end" spacing={2} sx={{ px: 2 }}>
          <Typography fontSize={"small"}>
            {trip?.createdAt &&
              `Created at: ${new Date(trip.createdAt).toLocaleDateString()}`}
          </Typography>
        </Stack>
        <Container disableGutters sx={{ px: 1 }}>
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
              alignItems="center"
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
            <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
              {trip?.description}
            </Typography>
          </Card>
        </Container>
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
            <PlaylistAddIcon />
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
