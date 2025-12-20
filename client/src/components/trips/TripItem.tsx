import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  IconButton,
  Container,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { useAppDispatch } from "../../store/redux/hooks";
import { FC, useState } from "react";
import { fontSize16 } from "../utils/FontSize";
import { ITrip } from "../../models/interface/ITrip";
import { text } from "../../localization/eng";
import { setEditTrip } from "../../store/reducers/trips/tripsSlice";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const TripItem: FC<{ trip: ITrip }> = ({ trip }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleEditTrip = () => {
    dispatch(setEditTrip(trip._id));
  };

  const handleClick = () => {
    navigate(ERoutes.TRIP_DETAIL.replace(":tripId", trip._id));
  };

  const handleNoteClick = (noteId: string) => {
    navigate(ERoutes.NOTE_DETAIL.replace(":noteId", noteId));
  };

  const handleTodoClick = (todoId: string) => {
    navigate(ERoutes.TODO_DETAIL.replace(":todoId", todoId));
  };

  const handleAccordionChange =
    (panel: string) =>
    (event: React.SyntheticEvent<Element, Event>, newExpanded: boolean) => {
      event.stopPropagation();
      setExpanded(newExpanded ? panel : false);
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
            sx={{ color: "text.primary", fontWeight: 600 }}
          >
            {trip.title ? trip.title : text.trips.tripsForm.titleUnknown}
          </Typography>
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "end",
              flex: 1,
              px: 0,
              pt: 0,
              pb: 0,
            }}
          >
            <Container
              disableGutters
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
            </Container>
          </CardActions>
        </Stack>
        <Container disableGutters>
          {trip.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, whiteSpace: "pre-wrap" }}
            >
              {trip.description}
            </Typography>
          )}
        </Container>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleAccordionChange("panel1")}
          sx={{ mt: 1, boxShadow: "none" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography variant="body2">
              {text.notes.header} ({trip.notes.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 1, pb: 1 }}>
            {trip.notes.length > 0 && (
              <Container disableGutters sx={{ mt: 1 }}>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNoteClick(note._id);
                      }}
                      sx={{ cursor: "pointer" }}
                    />
                  ))}
                </Stack>
              </Container>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleAccordionChange("panel2")}
          sx={{ mt: 0, boxShadow: "none" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
            sx={{}}
          >
            <Typography variant="body2">
              {text.todos.header} ({trip.todos.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 1, pb: 1 }}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTodoClick(todo._id);
                  }}
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};
