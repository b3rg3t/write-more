import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  IconButton,
  Container,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { useAppDispatch } from "../../store/redux/hooks";
import { toLocalTime } from "../utils/ToLocalTime";
import { FC } from "react";
import { fontSize16 } from "../utils/FontSize";
import { ITrip } from "../../models/interface/ITrip";
import { text } from "../../localization/eng";
import { deleteTrip, setEditTrip } from "../../store/reducers/trips/tripsSlice";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from "react-router-dom";

export const TripItem: FC<{ trip: ITrip }> = ({ trip }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleEditTrip = () => {
    dispatch(setEditTrip(trip._id));
  };

  const handleDeleteTrip = async () => {
    dispatch(deleteTrip(trip._id));
  };

  const handleClick = () => {
    navigate(`/trip/${trip._id}`);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        width: "100%",
        mb: 0,
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ px: 1, pt: 1, pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h3"
            component="div"
            fontSize={fontSize16}
            sx={{ fontWeight: 600 }}
          >
            {trip.title ? trip.title : text.trips.tripsForm.titleUnknown}
          </Typography>
          <Stack direction="column" alignItems="flex-end" spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {toLocalTime(trip.updatedAt)}
            </Typography>
          </Stack>
        </Stack>
        {trip.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, whiteSpace: "pre-wrap" }}
          >
            {trip.description}
          </Typography>
        )}
        {trip.notes.length > 0 && (
          <Container disableGutters sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {text.notes.notesList.header}:
            </Typography>
            <Stack
              direction="row"
              spacing={0}
              flexWrap="wrap"
              sx={{ gap: 0.5 }}
            >
              {trip.notes.map((note) => (
                <Chip
                  key={note._id}
                  label={note.title}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Container>
        )}
        {trip.todos.length > 0 && (
          <Container disableGutters sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {text.todos.todosList.header}:
            </Typography>
            <Stack
              direction="row"
              spacing={0}
              flexWrap="wrap"
              sx={{ gap: 0.5 }}
            >
              {trip.todos.map((todo) => (
                <Chip
                  avatar={todo.isCompleted ? <DoneIcon /> : undefined}
                  key={todo._id}
                  label={
                    <Typography
                      variant="caption"
                      sx={{
                        textDecoration: todo.isCompleted
                          ? "line-through"
                          : undefined,
                        py: 0.5,
                        color: "white",
                      }}
                    >
                      {todo.name}
                    </Typography>
                  }
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Container>
        )}
      </CardContent>

      <CardActions
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "end",
          flex: 1,
          px: 0,
          pt: 0,
        }}
      >
        <Container
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flex: 1,
            pl: 0,
            pr: 1,
          }}
        >
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
          <IconButton
            color="error"
            edge="end"
            aria-label="delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTrip();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Container>
      </CardActions>
    </Card>
  );
};
