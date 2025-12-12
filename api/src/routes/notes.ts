import express from "express";
import type { INote } from "../models/types/Note";
import Note from "../models/types/Note";

const router = express.Router();

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new note
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  try {
    // Find the highest order
    const highestOrderNote = await Note.findOne().sort({ order: -1 });
    const newOrder = highestOrderNote ? highestOrderNote.order + 1 : 0;

    const newNote = new Note({ title, content, order: newOrder });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a note
router.put("/:id", async (req, res) => {
  const { title, content } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update order for all notes
router.patch("/order", async (req, res) => {
  const updates: Pick<INote, "_id" | "order">[] = req.body; // array of { id, order }

  try {
    const promises = updates.map((update) =>
      Note.findByIdAndUpdate(update._id, { order: update.order }, { new: true })
    );
    const updatedNotes = await Promise.all(promises);
    res.json(updatedNotes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a note
router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
