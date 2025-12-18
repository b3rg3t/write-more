import { Container, List, ListItem } from "@mui/material";
import { useReorderTodosMutation } from "../../store/reducers/api/todoApiSlice";
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

interface TodoListProps {
  todos: ITodo[];
}

export const TodoList: FC<TodoListProps> = ({ todos }) => {
  const [reorderTodos, {}] = useReorderTodosMutation();
  const [todosState, setTodos] = useState<ITodo[]>([]);

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
    setTodos(todos);
  }, [todos]);

  return (
    <Container disableGutters maxWidth="md" sx={{ px: 0 }}>
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
    </Container>
  );
};
