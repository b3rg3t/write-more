import { useParams } from "react-router-dom";
import { useGetTodoQuery } from "../../store/reducers/api/apiSlice";
import { TodoItem } from "./TodoItem";
import { Container } from "@mui/material";
import { text } from "../../localization/eng";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";

export const TodoDetail = () => {
  const { todoId } = useParams<{ todoId: string }>();
  const {
    data: todo,
    isLoading,
    error,
    isUninitialized,
    isFetching,
  } = useGetTodoQuery(todoId!);

  return (
    <RtkQueryWrapper
      isLoading={isLoading || isUninitialized || isFetching}
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
