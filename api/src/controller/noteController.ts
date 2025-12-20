import type { Request, Response } from "express";
import { INote } from "../models/interfaces/INote";
import SNote from "../models/schemas/SNote";

// Get all notes
export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await SNote.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific note by ID
export const getNote = async (req: Request, res: Response) => {
  try {
    const note = await SNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  const { title, content, links, startDate, endDate } = req.body;

  try {
    // Find the highest order
    const highestOrderNote = await SNote.findOne().sort({ order: -1 });
    const newOrder = highestOrderNote ? highestOrderNote.order + 1 : 0;

    const newNote = new SNote({
      title,
      content,
      links,
      order: newOrder,
      startDate,
      endDate,
    });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a note
export const updateNote = async (req: Request, res: Response) => {
  const { title, content, links, startDate, endDate } = req.body;

  try {
    const updatedNote = await SNote.findByIdAndUpdate(
      req.params.id,
      { title, content, links, startDate, endDate },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update order for all notes
export const updateOrder = async (req: Request, res: Response) => {
  const updates: Pick<INote, "_id" | "order">[] = req.body; // array of { id, order }

  try {
    const promises = updates.map((update) =>
      SNote.findByIdAndUpdate(
        update._id,
        { order: update.order },
        { new: true }
      )
    );
    const updatedNotes = await Promise.all(promises);
    res.json(updatedNotes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const deletedNote = await SNote.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
