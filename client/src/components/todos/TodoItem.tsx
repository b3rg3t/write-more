import { FC, useState } from "react";
import { ITodo } from "../../models/interface/ITodo";
import { setEditTodo } from "../../store/reducers/todos/todosSlice";
import { useAppDispatch } from "../../store/redux/hooks";
import {
  Card,
  Checkbox,
  Container,
  IconButton,
  Typography,
  TypographyVariant,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { useUpdateTodoMutation } from "../../store/reducers/api/apiSlice";
import { fontSize16 } from "../utils/FontSize";

export const TodoItem: FC<{
  todo: ITodo;
  headingLevel?: TypographyVariant;
}> = ({ todo, headingLevel = "h3" }) => {
  const dispatch = useAppDispatch();
  const [updateTodo] = useUpdateTodoMutation();
  const [isChecked, setIsChecked] = useState(todo.isCompleted);

  const handleEditTodo = () => {
    dispatch(setEditTodo(todo._id));
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
        alignItems: "start",
      }}
    >
      <Checkbox
        checked={isChecked}
        onChange={handleCheckboxChange}
        slotProps={{ input: { "aria-label": todo.name } }}
        sx={{ cursor: "pointer" }}
      />
      <Typography
        variant={headingLevel}
        fontSize={fontSize16}
        sx={{
          textDecoration: isChecked ? "line-through" : undefined,
          pb: 1,
          pt: 1.5,
        }}
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
          pr: 2,
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
      </Container>
    </Card>
  );
};
