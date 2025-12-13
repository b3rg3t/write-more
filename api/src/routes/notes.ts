import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  updateOrder,
  deleteNote,
} from "../controller/noteController";

const router = express.Router();

// Get all notes
router.get("/", getNotes);

// Create a new note
router.post("/", createNote);

// Update a note
router.put("/:id", updateNote);

// Update order for all notes
router.patch("/order", updateOrder);

// Delete a note
router.delete("/:id", deleteNote);

export default router;
