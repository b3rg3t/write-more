import express from "express";
import {
  getNotes,
  getNote,
  createNote,
  createCommentForNote,
  updateNote,
  updateOrder,
  deleteNote,
} from "../controller/noteController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.use(authenticate);

// Get all notes
router.get("/", getNotes);

// Get a specific note
router.get("/:id", getNote);

// Create a new note
router.post("/", createNote);

// Create a comment for a note
router.post("/:id/comments", createCommentForNote);

// Update a note
router.put("/:id", updateNote);

// Update order for all notes
router.patch("/order", updateOrder);

// Delete a note
router.delete("/:id", deleteNote);

export default router;
