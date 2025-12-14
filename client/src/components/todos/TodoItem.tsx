import { FC, useState } from "react";
import { ITodo } from "../../models/interface/ITodo";
import { deleteTodo, setEditTodo } from "../../store/reducers/todos/todosSlice";
import { useAppDispatch } from "../../store/redux/hooks";
import {
  Card,
  Checkbox,
  Container,
  IconButton,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { useUpdateTodoMutation } from "../../store/reducers/api/todoApiSlice";

export const TodoItem: FC<{ todo: ITodo }> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const [updateTodo] = useUpdateTodoMutation();
  const [isChecked, setIsChecked] = useState(todo.isCompleted);

  const handleEditTodo = () => {
    dispatch(setEditTodo(todo._id));
  };

  const handleDeleteTodo = async () => {
    dispatch(deleteTodo(todo._id));
  };

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    updateTodo({
      _id: todo._id,
      isCompleted: event.target.checked,
    });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        width: "100%",
        mb: 0,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Checkbox
        checked={isChecked}
        onChange={handleClick}
        slotProps={{ input: { "aria-label": todo.name } }}
      />
      <Typography
        sx={{ textDecoration: isChecked ? "line-through" : undefined, py: 1 }}
      >
        {todo.name}
      </Typography>
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
          onClick={handleEditTodo}
        >
          <EditSquareIcon />
        </IconButton>
        <IconButton
          color="error"
          edge="end"
          aria-label="delete"
          onClick={handleDeleteTodo}
        >
          <DeleteIcon />
        </IconButton>
      </Container>
    </Card>
  );
};
