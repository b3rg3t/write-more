import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ITodo } from "../models/interfaces/ITodo";
import STodo from "../models/schemas/STodos";
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

const getAccessibleTodoIds = async (userId: string) =>
  STrip.distinct("todos", {
    users: new mongoose.Types.ObjectId(userId),
  });

const canAccessTodo = async (userId: string, todoId: string) =>
  Boolean(
    await STrip.exists({
      users: new mongoose.Types.ObjectId(userId),
      todos: todoId,
    }),
  );

// Get all notes
export const getTodos = async (req: AuthRequest, res: Response) => {
  try {
    if (!hasUserContext(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessContext = await resolveAccessContext(req);
    if (!accessContext) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const todos = accessContext.isAdmin
      ? await STodo.find()
      : await STodo.find({
          _id: {
            $in: await getAccessibleTodoIds(accessContext.userId),
          },
        });

    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific todo by ID
export const getTodo = async (req: AuthRequest, res: Response) => {
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
      !(await canAccessTodo(accessContext.userId, req.params.id))
    ) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const todo = await STodo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new note
export const createTodo = async (req: AuthRequest, res: Response) => {
  const { name, isCompleted } = req.body;

  try {
    if (!hasUserContext(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the highest order
    const highestOrderNote = await STodo.findOne().sort({ order: -1 });
    const newOrder = highestOrderNote ? highestOrderNote.order + 1 : 0;

    const newNote = new STodo({
      name,
      isCompleted,
      order: newOrder,
      users: [req.userId],
    });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a note
export const updateTodo = async (req: AuthRequest, res: Response) => {
  const { name, isCompleted } = req.body;

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
      !(await canAccessTodo(accessContext.userId, req.params.id))
    ) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const updatedNote = await STodo.findByIdAndUpdate(
      req.params.id,
      { name, isCompleted },
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
export const updateAll = async (req: AuthRequest, res: Response) => {
  const updates: Pick<ITodo, "_id" | "order">[] = req.body;

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
        (await getAccessibleTodoIds(accessContext.userId)).map((id) =>
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
      STodo.findByIdAndUpdate(
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
export const deleteTodo = async (req: AuthRequest, res: Response) => {
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
      !(await canAccessTodo(accessContext.userId, req.params.id))
    ) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const deletedNote = await STodo.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
