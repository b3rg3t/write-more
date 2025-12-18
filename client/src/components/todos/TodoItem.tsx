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
import { useNavigate } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";

export const TodoItem: FC<{ todo: ITodo }> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const [updateTodo] = useUpdateTodoMutation();
  const [isChecked, setIsChecked] = useState(todo.isCompleted);
  const navigate = useNavigate();

  const handleEditTodo = () => {
    dispatch(setEditTodo(todo._id));
  };

  const handleDeleteTodo = async () => {
    dispatch(deleteTodo(todo._id));
  };

  const handleClick = () => {
    navigate(ERoutes.TODO_DETAIL.replace(":id", todo._id));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
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
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <Checkbox
        checked={isChecked}
        onChange={handleCheckboxChange}
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
          onClick={(e) => {
            e.stopPropagation();
            handleEditTodo();
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
            handleDeleteTodo();
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Container>
    </Card>
  );
};
