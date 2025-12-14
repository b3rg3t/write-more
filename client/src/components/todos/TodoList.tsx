import { Button, List, ListItem } from "@mui/material";
import { createNewTodo } from "../../store/reducers/todos/todosSlice";
import { useAppDispatch } from "../../store/redux/hooks";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { useGetAllTodosQuery } from "../../store/reducers/api/todoApiSlice";
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
// import { reorderNotesHelper } from "../../store/reducers/notes/reorderNotes";

export const TodoList = () => {
  const { data, isLoading, isUninitialized, isFetching, error } =
    useGetAllTodosQuery();
  const dispatch = useAppDispatch();
  const sortedData = useMemo(() => {
    return data || [];
  }, [data]);
  const [todos, setTodos] = useState<ITodo[]>([]);

  const { loading, createTodo, noTodos, fetchError } = text.todos.todosList;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    // const reordered = reorderNotesHelper(
    //   todos,
    //   result.source.index,
    //   result.destination.index
    // );
    // handleReorderNotes(reordered);
    // setTodos(reordered);
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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="note-list">
          {(provided) => (
            <List dense ref={provided.innerRef} {...provided.droppableProps}>
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
      <Button onClick={() => dispatch(createNewTodo())}>Create Todo</Button>
    </RtkQueryWrapper>
  );
};
