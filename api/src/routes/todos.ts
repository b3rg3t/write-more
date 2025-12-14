import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateAll,
  updateTodo,
} from "../controller/todoController";

const router = express.Router();

// Get all notes
router.get("/", getTodos);

// Create a new note
router.post("/", createTodo);

// Update a note
router.put("/:id", updateTodo);

// Update isCompleted for all notes
router.patch("/done", updateAll);

// Delete a note
router.delete("/:id", deleteTodo);

export default router;
