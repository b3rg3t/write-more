import type { Request, Response } from "express";
import { ITodo } from "../models/interfaces/ITodo";
import STodo from "../models/schemas/STodos";

// Get all notes
export const getTodos = async (req: Request, res: Response) => {
  try {
    const notes = await STodo.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new note
export const createTodo = async (req: Request, res: Response) => {
  const { name, isCompleted } = req.body;

  try {
    // Find the highest order
    const highestOrderNote = await STodo.findOne().sort({ order: -1 });
    const newOrder = highestOrderNote ? highestOrderNote.order + 1 : 0;

    const newNote = new STodo({ name, isCompleted, order: newOrder });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a note
export const updateTodo = async (req: Request, res: Response) => {
  const { name, isCompleted, order } = req.body;

  try {
    const updatedNote = await STodo.findByIdAndUpdate(
      req.params.id,
      { name, isCompleted, order },
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
export const updateAll = async (req: Request, res: Response) => {
  const updates: Pick<ITodo, "_id" | "order">[] = req.body;

  try {
    const promises = updates.map((update) =>
      STodo.findByIdAndUpdate(
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
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const deletedNote = await STodo.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
