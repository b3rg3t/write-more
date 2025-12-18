import { useParams } from "react-router-dom";
import { useGetTodoQuery } from "../../store/reducers/api/todoApiSlice";
import { TodoItem } from "./TodoItem";
import { Container, Typography } from "@mui/material";

export const TodoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: todo, isLoading, error } = useGetTodoQuery(id!);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error || !todo) {
    return <Typography>Todo not found</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <TodoItem todo={todo} />
    </Container>
  );
};
