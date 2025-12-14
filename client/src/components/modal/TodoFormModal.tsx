import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import { cancelTodo } from "../../store/reducers/todos/todosSlice";
import { useGetAllTodosQuery } from "../../store/reducers/api/todoApiSlice";
import { text } from "../../localization/eng";
import {
  selectIsEditing,
  selectIsNew,
} from "../../store/reducers/todos/todosSlice";
import { TodoForm } from "../todos/TodoForm";

export const TodoFormModal = () => {
  const isNew = useAppSelector(selectIsNew);
  const isEditing = useAppSelector(selectIsEditing);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { todo } = useGetAllTodosQuery(undefined, {
    selectFromResult: ({ data }) => ({
      todo: isEditing
        ? data?.find((todo) => todo._id === isEditing)
        : undefined,
    }),
  });

  console.log("TodoFormModal render", { isNew, isEditing, todo });

  const onClose = () => {
    dispatch(cancelTodo());
  };

  const open = !!isNew || !!isEditing;

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
        {isNew ? titleNew : titleEdit}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
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
          </DialogActions>{" "}
        </TodoForm>
      </DialogContent>
    </Dialog>
  );
};
