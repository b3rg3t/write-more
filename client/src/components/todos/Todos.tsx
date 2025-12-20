import { TodoList } from "./TodoList";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { useGetAllTodosQuery } from "../../store/reducers/api/apiSlice";
import { useAppDispatch } from "../../store/redux/hooks";
import { text } from "../../localization/eng";
import { Action } from "../utils/Action";
import { createNewTodo } from "../../store/reducers/todos/todosSlice";
import { useMemo } from "react";
import { PageHeader } from "../layout/PageHeader";

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
      <PageHeader title={header} amount={data ? data.length : 0} />
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
