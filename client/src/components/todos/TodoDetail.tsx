import { useParams } from "react-router-dom";
import { useGetAllTodosQuery } from "../../store/reducers/api/todoApiSlice";
import { TodoItem } from "./TodoItem";
import { Container, Typography } from "@mui/material";

export const TodoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: todos } = useGetAllTodosQuery();

  const todo = todos?.find((t) => t._id === id);

  if (!todo) {
    return <Typography>Todo not found</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <TodoItem todo={todo} />
    </Container>
  );
};
