import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { text } from "../../localization/eng";
import {
  useDeleteNoteMutation,
  useGetNoteQuery,
  useDeleteTodoMutation,
  useGetTodoQuery,
  useDeleteTripMutation,
  useGetTripQuery,
} from "../../store/reducers/api/apiSlice";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  deleteNote,
  selectIsDeleting as selectIsDeletingNote,
} from "../../store/reducers/notes/notesSlice";
import {
  deleteTodo,
  selectIsDeleting as selectIsDeletingTodo,
} from "../../store/reducers/todos/todosSlice";
import {
  deleteTrip,
  selectIsDeleting as selectIsDeletingTrip,
} from "../../store/reducers/trips/tripsSlice";
import { skipToken } from "@reduxjs/toolkit/query";

type ResourceType = "note" | "todo" | "trip";

interface DeleteModalProps {
  resourceType: ResourceType;
}

export const DeleteModal = ({ resourceType }: DeleteModalProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Select the appropriate selector and hooks based on resource type
  const isDeleting = useAppSelector(
    resourceType === "note"
      ? selectIsDeletingNote
      : resourceType === "todo"
      ? selectIsDeletingTodo
      : selectIsDeletingTrip
  );

  const noteQuery = useGetNoteQuery(
    resourceType === "note" && isDeleting ? isDeleting : skipToken
  );
  const todoQuery = useGetTodoQuery(
    resourceType === "todo" && isDeleting ? isDeleting : skipToken
  );
  const tripQuery = useGetTripQuery(
    resourceType === "trip" && isDeleting ? isDeleting : skipToken
  );

  const [deleteNoteApi] = useDeleteNoteMutation();
  const [deleteTodoApi] = useDeleteTodoMutation();
  const [deleteTripApi] = useDeleteTripMutation();

  const resource =
    resourceType === "note"
      ? noteQuery.data
      : resourceType === "todo"
      ? todoQuery.data
      : tripQuery.data;

  const onClose = () => {
    if (resourceType === "note") {
      dispatch(deleteNote(undefined));
    } else if (resourceType === "todo") {
      dispatch(deleteTodo(undefined));
    } else {
      dispatch(deleteTrip(undefined));
    }
  };

  const handleConfirm = async () => {
    if (resource) {
      try {
        if (resourceType === "note") {
          await deleteNoteApi({ _id: resource._id }).unwrap();
        } else if (resourceType === "todo") {
          await deleteTodoApi({ _id: resource._id }).unwrap();
        } else {
          await deleteTripApi({ _id: resource._id }).unwrap();
        }
        console.log("fulfilled");
        onClose();
      } catch (error) {
        console.error("rejected", error);
      }
    }
  };

  const open = !!isDeleting;

  // Get the appropriate text based on resource type
  const textConfig =
    resourceType === "note"
      ? text.notes.deleteNote
      : resourceType === "todo"
      ? text.todos.deleteTodo
      : text.trips.deleteTrip;

  const { title, titleUnknown, confirmation, buttons } = textConfig;

  // Get the resource title/name
  const resourceTitle =
    resourceType === "todo"
      ? (resource as any)?.name
      : (resource as any)?.title;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      transitionDuration={0}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle
        id="delete-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1, sm: 3 },
          py: { xs: 1, sm: 2 },
        }}
      >
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 } }}>
        <DialogContentText id="delete-dialog-description" sx={{ mb: 2 }}>
          {confirmation.replace("{title}", resourceTitle || titleUnknown)}
        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {buttons.cancel}
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            {buttons.confirm}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
