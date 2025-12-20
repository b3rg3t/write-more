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
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  deleteTodo,
  selectIsDeleting,
} from "../../store/reducers/todos/todosSlice";
import {
  useDeleteTodoMutation,
  useGetAllTodosQuery,
} from "../../store/reducers/api/apiSlice";

export const DeleteTodoModal = () => {
  const isDeleting = useAppSelector(selectIsDeleting);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { todo } = useGetAllTodosQuery(undefined, {
    selectFromResult: ({ data }) => ({
      todo: isDeleting
        ? data?.find((note) => note._id === isDeleting)
        : undefined,
    }),
  });
  const [deleteTodoApi] = useDeleteTodoMutation();

  const onClose = () => {
    dispatch(deleteTodo(undefined));
  };
  const handleConfirm = async () => {
    if (todo) {
      try {
        const payload = await deleteTodoApi({ _id: todo._id }).unwrap();
        console.log("fulfilled", payload);
        dispatch(deleteTodo(undefined));
      } catch (error) {
        console.error("rejected", error);
      }
    }
  };

  const open = !!isDeleting;

  const { title, titleUnknown, confirmation, buttons } = text.notes.deleteNote;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      transitionDuration={0}
      aria-labelledby="delete-note-dialog-title"
      aria-describedby="delete-note-dialog-description"
    >
      <DialogTitle
        id="delete-note-dialog-title"
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
        <DialogContentText id="delete-note-dialog-description" sx={{ mb: 2 }}>
          {confirmation.replace("{title}", todo?.name || titleUnknown)}
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
