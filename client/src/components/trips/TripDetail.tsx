import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTripQuery,
  useUpdateTripMutation,
} from "../../store/reducers/api/apiSlice";
import {
  Avatar,
  Card,
  Container,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import { text } from "../../localization/eng";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { TodoList } from "../todos/TodoList";
import { NoteList } from "../notes/NoteList";
import { fontSize16 } from "../utils/FontSize";
import { useAppDispatch } from "../../store/redux/hooks";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { createTodoForTrip } from "../../store/reducers/todos/todosSlice";
import { createNoteForTrip } from "../../store/reducers/notes/notesSlice";
import { setEditTrip } from "../../store/reducers/trips/tripsSlice";
import { setAddUserToTrip } from "../../store/reducers/trips/tripUsersSlice";

import { TripDates } from "../utils/TripDates";
import { TripImagesSection } from "./TripImagesSection";
import { useState } from "react";
import { TripSectionAccordion } from "./TripSectionAccordion";
import { ERoutes } from "../../models/enum/ERoutes";

export const TripDetail = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const dispatch = useAppDispatch();
  const [updateTrip] = useUpdateTripMutation();
  const [isImageUploadModalOpen, setIsImageUploadModalOpen] = useState(false);
  const {
    data: trip,
    isLoading,
    error,
    isUninitialized,
    isFetching,
  } = useGetTripQuery(tripId!);
  const navigate = useNavigate();

  const handleOpenCalendar = () => {
    if (!tripId) return;
    navigate(ERoutes.TRIP_CALENDAR.replace(":tripId", tripId));
  };

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
  return (
    <RtkQueryWrapper
      isLoading={isLoading || isUninitialized}
      data={trip ? [trip] : []}
      isFetching={isFetching}
      error={error}
      texts={{
        loading: text.trips.tripDetail.loading,
        createMessage: "",
        noData: text.trips.tripDetail.notFound,
        fetchError: text.trips.tripDetail.notFound,
      }}
    >
      <Container maxWidth="md" sx={{ px: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="end"
          sx={{ mb: 1 }}
        >
          <Button
            size="small"
            color="primary"
            variant="outlined"
            startIcon={<CalendarTodayIcon fontSize="small" />}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenCalendar();
            }}
            aria-label={text.trips.tripDetail.calendar}
            sx={{ textTransform: "none" }}
          >
            {text.trips.tripDetail.calendar}
          </Button>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            {trip?.users?.map((user, index) => {
              if (typeof user === "string") return null;
              const initials =
                [user.firstName, user.lastName]
                  .filter(Boolean)
                  .map((n) => n![0].toUpperCase())
                  .join("") ||
                user.username?.[0]?.toUpperCase() ||
                "?";
              const fullName =
                user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : `@${user.username}`;
              return (
                <Tooltip key={user._id ?? index} title={fullName}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: "0.7rem",
                      bgcolor: "primary.main",
                    }}
                  >
                    {initials}
                  </Avatar>
                </Tooltip>
              );
            })}
            <IconButton
              color="info"
              size="small"
              aria-label="add user"
              onClick={(e) => {
                e.stopPropagation();
                handleAddUser();
              }}
            >
              <GroupAddIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        <Card variant="outlined" sx={{ borderRadius: 2, px: 2, pb: 2, pt: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Typography
              variant="h2"
              fontSize={fontSize16}
              sx={{ fontWeight: 600, mt: 1 }}
            >
              {trip?.title}
            </Typography>
            <IconButton
              color="info"
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
          <TripDates
            startDate={trip?.startDate}
            endDate={trip?.endDate}
            onClick={handleOpenCalendar}
          />
          <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
            {trip?.description}
          </Typography>
        </Card>
        {trip?.createdBy && trip?.createdAt ? (
          <Typography fontSize={"small"} color="text.secondary" sx={{ mt: 1 }}>
            {`${text.trips.tripDetail.createdBy} ${trip.createdBy.firstName && trip.createdBy.lastName ? `${trip.createdBy.firstName} ${trip.createdBy.lastName}` : `@${trip.createdBy.username}`} on ${new Date(trip.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}`}
          </Typography>
        ) : (
          <span />
        )}
        <Divider sx={{ my: 2 }} />
        <TripSectionAccordion
          title={text.todos.header}
          count={`${trip?.todos?.filter((t) => !t.isCompleted).length ?? 0}/${trip?.todos?.length ?? 0}`}
          badgeColor="info"
          defaultExpanded={trip?.todosSection?.isAccordionOpen ?? true}
          onExpandedChange={(expanded) =>
            trip &&
            updateTrip({
              _id: trip._id,
              todosSection: {
                ...trip.todosSection,
                isAccordionOpen: expanded,
                showCompleted: trip.todosSection?.showCompleted ?? true,
              },
              notes:
                trip.notes?.map((n) => (typeof n === "string" ? n : n._id)) ??
                [],
              todos: trip.todos?.map((t) => t._id) ?? [],
            })
          }
          headerExtra={
            <Tooltip
              title={
                (trip?.todosSection?.showCompleted ?? true)
                  ? text.todos.todosList.hideCompleted
                  : text.todos.todosList.showCompleted
              }
            >
              <IconButton
                component="span"
                size="small"
                color="info"
                aria-label={
                  (trip?.todosSection?.showCompleted ?? true)
                    ? text.todos.todosList.hideCompleted
                    : text.todos.todosList.showCompleted
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (!trip) return;
                  const next = !(trip.todosSection?.showCompleted ?? true);
                  updateTrip({
                    _id: trip._id,
                    todosSection: {
                      isAccordionOpen:
                        trip.todosSection?.isAccordionOpen ?? true,
                      showCompleted: next,
                    },
                    notes:
                      trip.notes?.map((n) =>
                        typeof n === "string" ? n : n._id,
                      ) ?? [],
                    todos: trip.todos?.map((t) => t._id) ?? [],
                  });
                }}
              >
                {(trip?.todosSection?.showCompleted ?? true) ? (
                  <VisibilityIcon />
                ) : (
                  <VisibilityOffIcon />
                )}
              </IconButton>
            </Tooltip>
          }
          addAction={{
            ariaLabel: text.todos.todosList.createTodo,
            color: "info",
            icon: <FormatListBulletedAddIcon />,
            onClick: handleCreateTodo,
          }}
        >
          <TodoList
            trip={trip}
            todos={trip?.todos ?? []}
            headingLevel="h3"
            showCompleted={trip?.todosSection?.showCompleted ?? true}
          />
        </TripSectionAccordion>

        <TripSectionAccordion
          title={text.notes.header}
          count={trip?.notes?.length ?? 0}
          badgeColor="secondary"
          defaultExpanded={trip?.notesSection?.isAccordionOpen ?? true}
          onExpandedChange={(expanded) =>
            trip &&
            updateTrip({
              _id: trip._id,
              notesSection: { isAccordionOpen: expanded },
              notes:
                trip.notes?.map((n) => (typeof n === "string" ? n : n._id)) ??
                [],
              todos: trip.todos?.map((t) => t._id) ?? [],
            })
          }
          addAction={{
            ariaLabel: text.notes.notesList.createNote,
            color: "secondary",
            icon: <NoteAddIcon />,
            onClick: handleCreateNote,
          }}
        >
          <NoteList trip={trip} notes={trip?.notes ?? []} headingLevel="h3" />
        </TripSectionAccordion>

        <TripSectionAccordion
          title={text.trips.tripDetail.imagesHeader}
          count={trip?.images?.length ?? 0}
          badgeColor="info"
          defaultExpanded={trip?.imagesSection?.isAccordionOpen ?? true}
          onExpandedChange={(expanded) =>
            trip &&
            updateTrip({
              _id: trip._id,
              imagesSection: { isAccordionOpen: expanded },
              notes:
                trip.notes?.map((n) => (typeof n === "string" ? n : n._id)) ??
                [],
              todos: trip.todos?.map((t) => t._id) ?? [],
            })
          }
          addAction={{
            ariaLabel: text.trips.imageUpload.title,
            color: "info",
            icon: <AddPhotoAlternateIcon />,
            onClick: () => setIsImageUploadModalOpen(true),
          }}
        >
          <TripImagesSection
            tripId={tripId}
            isUploadModalOpen={isImageUploadModalOpen}
            onCloseUploadModal={() => setIsImageUploadModalOpen(false)}
          />
        </TripSectionAccordion>
      </Container>
    </RtkQueryWrapper>
  );
};
