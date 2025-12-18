import { Button, Container, List, ListItem, Typography } from "@mui/material";
import { createNewTodo } from "../../store/reducers/todos/todosSlice";
import { useAppDispatch } from "../../store/redux/hooks";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import {
  useGetAllTodosQuery,
  useReorderTodosMutation,
} from "../../store/reducers/api/todoApiSlice";
import { useEffect, useMemo, useState } from "react";
import { ITodo } from "../../models/interface/ITodo";
import { text } from "../../localization/eng";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { TodoItem } from "./TodoItem";
import { fontSize16 } from "../utils/FontSize";
import { reordersHelper } from "../../store/reducers/utils/reorderHelper";

export const TodoList = () => {
  const { data, isLoading, isUninitialized, isFetching, error } =
    useGetAllTodosQuery();
  const dispatch = useAppDispatch();
  const sortedData = useMemo(() => {
    return data ? [...data].sort((a, b) => a.order - b.order) : [];
  }, [data]);
  const [reorderTodos, {}] = useReorderTodosMutation();
  const [todos, setTodos] = useState<ITodo[]>([]);

  const { header, loading, createTodo, noTodos, fetchError } =
    text.todos.todosList;

  const handleReorderNotes = async (todo: Pick<ITodo, "_id" | "order">[]) => {
    try {
      const response = await reorderTodos(todo);
      console.log("Reordered todos response:", response);
    } catch (error) {
      console.error("Error reordering todos:", error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = reordersHelper(
      todos,
      result.source.index,
      result.destination.index
    );
    handleReorderNotes(reordered);
    setTodos(reordered);
  };

  useEffect(() => {
    setTodos(sortedData);
  }, [sortedData]);

  return (
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
      <Typography
        variant="h2"
        fontSize={fontSize16}
        fontWeight="bold"
        sx={{ px: 2 }}
      >
        {header}
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="note-list">
          {(provided) => (
            <List
              dense
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ pt: 1 }}
            >
              {todos.map((todo, index) => (
                <Draggable key={todo._id} draggableId={todo._id} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      sx={{ width: "100%", px: 1, py: 0 }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TodoItem todo={todo} />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Container sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <Button variant="contained" onClick={() => dispatch(createNewTodo())}>
          {createTodo}
        </Button>
      </Container>
    </RtkQueryWrapper>
  );
};
