import { useParams } from "react-router-dom";
import { useGetTodoQuery } from "../../store/reducers/api/todoApiSlice";
import { TodoItem } from "./TodoItem";
import { Container } from "@mui/material";
import { text } from "../../localization/eng";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";

export const TodoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: todo,
    isLoading,
    error,
    isUninitialized,
  } = useGetTodoQuery(id!);

  return (
    <RtkQueryWrapper
      isLoading={isLoading || isUninitialized}
      data={todo ? [todo] : []}
      error={error}
      texts={{
        loading: text.todos.todoDetail.loading,
        createMessage: "",
        noData: text.todos.todoDetail.notFound,
        fetchError: text.todos.todoDetail.notFound,
      }}
    >
      <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
        <TodoItem todo={todo!} />
      </Container>
    </RtkQueryWrapper>
  );
};
