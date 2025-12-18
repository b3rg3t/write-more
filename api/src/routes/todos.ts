import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  getTodo,
  updateAll,
  updateTodo,
} from "../controller/todoController";

const router = express.Router();

// Get all notes
router.get("/", getTodos);

// Get a specific todo
router.get("/:id", getTodo);

// Create a new todo
router.post("/", createTodo);

// Update a todo
router.put("/:id", updateTodo);

// Update order for all todos
router.patch("/order", updateAll);

// Delete a todo
router.delete("/:id", deleteTodo);

export default router;
