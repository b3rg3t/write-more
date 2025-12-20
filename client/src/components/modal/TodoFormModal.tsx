import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  cancelTodo,
  deleteTodo,
  selectCreatingTodoForTrip,
} from "../../store/reducers/todos/todosSlice";
import { useGetTodoQuery } from "../../store/reducers/api/apiSlice";
import { text } from "../../localization/eng";
import {
  selectIsEditing,
  selectIsNew,
} from "../../store/reducers/todos/todosSlice";
import { TodoForm } from "../todos/TodoForm";
import { skipToken } from "@reduxjs/toolkit/query";

export const TodoFormModal = () => {
  const isNew = useAppSelector(selectIsNew);
  const isEditing = useAppSelector(selectIsEditing);
  const creatingTodoForTrip = useAppSelector(selectCreatingTodoForTrip);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const todo1 = useGetTodoQuery(isEditing ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });

  const todo = isEditing ? todo1.data : undefined;
  const onClose = () => {
    dispatch(cancelTodo());
  };

  const handleDeleteTodo = async () => {
    if (todo) {
      dispatch(deleteTodo(todo._id));
    }
  };

  const open = !!isNew || !!isEditing || !!creatingTodoForTrip;

  const { titleNew, titleEdit, buttons } = text.todos.todosForm;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      transitionDuration={0}
      aria-labelledby="todo-form-dialog-title"
    >
      <DialogTitle
        id="todo-form-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1, sm: 3 },
          py: { xs: 1, sm: 2 },
        }}
      >
        {isNew || creatingTodoForTrip ? titleNew : titleEdit}
        <Stack direction="row" spacing={1}>
          {todo && (
            <IconButton
              color="error"
              edge="end"
              aria-label="delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTodo();
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 } }}>
        <TodoForm todo={todo}>
          <DialogActions sx={{ p: 0 }}>
            <Button onClick={onClose} color="inherit">
              {buttons.cancel}
            </Button>
            <Button type="submit" variant="contained">
              {buttons.submit}
            </Button>
          </DialogActions>
        </TodoForm>
      </DialogContent>
    </Dialog>
  );
};
