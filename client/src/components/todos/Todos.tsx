import { TodoFormModal } from "../modal/TodoFormModal";
import { TodoList } from "./TodoList";
import { DeleteTodoModal } from "../modal/DeleteTodoModal";
import { Typography } from "@mui/material";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { useGetAllTodosQuery } from "../../store/reducers/api/todoApiSlice";
import { useAppDispatch } from "../../store/redux/hooks";
import { fontSize16 } from "../utils/FontSize";
import { text } from "../../localization/eng";
import { Action } from "../utils/Action";
import { createNewTodo } from "../../store/reducers/todos/todosSlice";
import { useMemo } from "react";

export const Todos = () => {
  const { data, isLoading, isUninitialized, isFetching, error } =
    useGetAllTodosQuery();
  const dispatch = useAppDispatch();

  const sortedTodos = useMemo(() => {
    return data ? [...data].sort((a, b) => a.order - b.order) : [];
  }, [data]);

  const { header } = text.todos;
  const { loading, createTodo, noTodos, fetchError } = text.todos.todosList;
  return (
    <>
      <TodoFormModal />
      <DeleteTodoModal />
      <Typography
        variant="h2"
        fontSize={fontSize16}
        fontWeight="bold"
        sx={{ px: 2 }}
      >
        {header}
      </Typography>
      <RtkQueryWrapper
        isLoading={isLoading || isUninitialized}
        data={data}
        error={error}
        isFetching={isFetching}
        texts={{
          loading,
          createMessage: createTodo,
          noData: noTodos,
          fetchError,
        }}
        onCreate={() => dispatch(createNewTodo())}
      >
        <TodoList todos={sortedTodos} />
        <Action
          onClick={() => dispatch(createNewTodo())}
          text={createTodo}
          variant="contained"
        />
      </RtkQueryWrapper>
    </>
  );
};
