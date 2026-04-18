import { List, ListItem, Typography, TypographyVariant } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ITodo } from "../../models/interface/ITodo";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { TodoItem } from "./TodoItem";
import { reordersHelper } from "../../store/reducers/utils/reorderHelper";
import {
  useReorderTodosMutation,
  useUpdateTripMutation,
} from "../../store/reducers/api/apiSlice";
import { ITrip } from "../../models/interface/ITrip";
import { text } from "../../localization/eng";

interface TodoListProps {
  todos: ITodo[];
  headingLevel?: TypographyVariant;
  trip?: ITrip;
  showCompleted?: boolean;
}

export const TodoList: FC<TodoListProps> = ({
  todos,
  headingLevel,
  trip,
  showCompleted = true,
}) => {
  const [reorderTodos, {}] = useReorderTodosMutation();
  const [updateTrip, {}] = useUpdateTripMutation();
  const [todosState, setTodos] = useState<ITodo[]>([]);

  const handleReorderNotes = async (updatedTodos: ITodo[]) => {
    if (!!trip) {
      try {
        await updateTrip({
          ...trip,
          notes:
            trip?.notes?.map((n) => (typeof n === "string" ? n : n._id)) || [],
          todos: updatedTodos.map((t) => t._id),
        }).unwrap();
      } catch (error) {
        console.error("Error reordering todos:", error);
      }
    } else {
      try {
        await reorderTodos(updatedTodos).unwrap();
      } catch (error) {
        console.error("Error reordering todos:", error);
      }
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    const reordered = reordersHelper(
      todos,
      result.source.index,
      result.destination.index,
    );
    handleReorderNotes(reordered);
    setTodos(reordered);
  };

  useEffect(() => {
    setTodos(todos);
  }, [todos]);

  const visibleTodos = showCompleted
    ? todosState
    : todosState.filter((t) => !t.isCompleted);

  if (todosState.length === 0 && todos.length === 0) {
    return (
      <Typography variant={"body1"}>
        {text.todos.todosList.noTodosAvailable}
      </Typography>
    );
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="note-list">
        {(provided) => (
          <List
            dense
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ pt: 1 }}
          >
            {visibleTodos.map((todo, index) => (
              <Draggable key={todo._id} draggableId={todo._id} index={index}>
                {(provided) => (
                  <ListItem
                    ref={provided.innerRef}
                    sx={{ width: "100%", px: 0, py: 0 }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TodoItem todo={todo} headingLevel={headingLevel} />
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};
