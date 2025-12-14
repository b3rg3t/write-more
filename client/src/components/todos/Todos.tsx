import { Container } from "@mui/material";
import { TodoFormModal } from "../modal/TodoFormModal";
import { TodoList } from "./TodoList";
import { DeleteTodoModal } from "../modal/DeleteTodoModal";

export const Todos = () => (
  <>
    <TodoFormModal />
    <DeleteTodoModal />
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <TodoList />
    </Container>
  </>
);
