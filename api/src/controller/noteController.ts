import type { Request, Response } from "express";
import mongoose from "mongoose";
import { INote } from "../models/interfaces/INote";
import SComment from "../models/schemas/SComment";
import SNote from "../models/schemas/SNote";
import STrip from "../models/schemas/STrip";
import SUser from "../models/schemas/SUser";
import { AuthRequest } from "../middleware/authenticate";
import { EUserRole } from "../models/enums/EUserRole";

const hasUserContext = (req: AuthRequest) => Boolean(req.userId);

const resolveAccessContext = async (req: AuthRequest) => {
  if (!req.userId || !mongoose.Types.ObjectId.isValid(req.userId)) {
    return null;
  }

  const user = await SUser.findById(req.userId).select("role");
  if (!user) {
    return null;
  }

  const role = String(user.role || "").toLowerCase();

  return {
    userId: req.userId,
    isAdmin: role === EUserRole.ADMIN,
  };
};

const getAccessibleNoteIds = async (userId: string) =>
  STrip.distinct("notes", {
    users: new mongoose.Types.ObjectId(userId),
  });

const canAccessNote = async (userId: string, noteId: string) =>
  Boolean(
    await STrip.exists({
      users: new mongoose.Types.ObjectId(userId),
      notes: noteId,
    }),
  );

// Get all notes
export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    if (!hasUserContext(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessContext = await resolveAccessContext(req);
    if (!accessContext) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notes = accessContext.isAdmin
      ? await SNote.find()
      : await SNote.find({
          _id: {
            $in: await getAccessibleNoteIds(accessContext.userId),
          },
        });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific note by ID
export const getNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!hasUserContext(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessContext = await resolveAccessContext(req);
    if (!accessContext) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !accessContext.isAdmin &&
      !(await canAccessNote(accessContext.userId, req.params.id))
    ) {
      return res.status(404).json({ message: "Note not found" });
    }

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
export const createNote = async (req: AuthRequest, res: Response) => {
  const { title, content, links, startDate, endDate } = req.body;

  try {
    if (!hasUserContext(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the highest order
    const highestOrderNote = await SNote.findOne().sort({ order: -1 });
    const newOrder = highestOrderNote ? highestOrderNote.order + 1 : 0;

    const newNote = new SNote({
      title,
      content,
      links,
      order: newOrder,
      users: [req.userId],
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
export const updateNote = async (req: AuthRequest, res: Response) => {
  const { title, content, links, startDate, endDate } = req.body;

  try {
    if (!hasUserContext(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessContext = await resolveAccessContext(req);
    if (!accessContext) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !accessContext.isAdmin &&
      !(await canAccessNote(accessContext.userId, req.params.id))
    ) {
      return res.status(404).json({ message: "Note not found" });
    }

    const updatedNote = await SNote.findByIdAndUpdate(
      req.params.id,
      { title, content, links, startDate, endDate },
      { new: true },
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
export const updateOrder = async (req: AuthRequest, res: Response) => {
  const updates: Pick<INote, "_id" | "order">[] = req.body; // array of { id, order }

  try {
    if (!hasUserContext(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessContext = await resolveAccessContext(req);
    if (!accessContext) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!accessContext.isAdmin) {
      const allowedIds = new Set(
        (await getAccessibleNoteIds(accessContext.userId)).map((id) =>
          id.toString(),
        ),
      );
      const hasForbiddenItem = updates.some(
        (update) => !allowedIds.has(update._id.toString()),
      );

      if (hasForbiddenItem) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const promises = updates.map((update) =>
      SNote.findByIdAndUpdate(
        update._id,
        { order: update.order },
        { new: true },
      ),
    );
    const updatedNotes = await Promise.all(promises);
    res.json(updatedNotes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a note
export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    if (!hasUserContext(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessContext = await resolveAccessContext(req);
    if (!accessContext) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !accessContext.isAdmin &&
      !(await canAccessNote(accessContext.userId, req.params.id))
    ) {
      return res.status(404).json({ message: "Note not found" });
    }

    const deletedNote = await SNote.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a comment for a specific note
export const createCommentForNote = async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  const noteId = req.params.id;

  try {
    if (!hasUserContext(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessContext = await resolveAccessContext(req);
    if (!accessContext) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Invalid note id" });
    }

    if (
      !accessContext.isAdmin &&
      !(await canAccessNote(accessContext.userId, noteId))
    ) {
      return res.status(404).json({ message: "Note not found" });
    }

    const note = await SNote.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const newComment = new SComment({
      content,
      user: req.userId,
    });

    const savedComment = await newComment.save();
    await SNote.findByIdAndUpdate(noteId, {
      $addToSet: { commentIds: savedComment._id },
    });

    return res.status(201).json(savedComment);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
