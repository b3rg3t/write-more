import { List, ListItem, TypographyVariant } from "@mui/material";
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

interface TodoListProps {
  todos: ITodo[];
  headingLevel?: TypographyVariant;
  trip?: ITrip;
}

export const TodoList: FC<TodoListProps> = ({ todos, headingLevel, trip }) => {
  const [reorderTodos, {}] = useReorderTodosMutation();
  const [updateTrip, {}] = useUpdateTripMutation();
  const [todosState, setTodos] = useState<ITodo[]>([]);

  const handleReorderNotes = async (updatedTodos: ITodo[]) => {
    if (!!trip) {
      try {
        const response = await updateTrip({
          ...trip,
          notes:
            trip?.notes?.map((n) => (typeof n === "string" ? n : n._id)) || [],
          todos: updatedTodos.map((t) => t._id),
        });
        console.log("Reordered todos response:", response);
      } catch (error) {
        console.error("Error reordering todos:", error);
      }
    } else {
      try {
        const response = await reorderTodos(updatedTodos);
        console.log("Reordered todos response:", response);
      } catch (error) {
        console.error("Error reordering todos:", error);
      }
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
    setTodos(todos);
  }, [todos]);

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
            {todosState.map((todo, index) => (
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
