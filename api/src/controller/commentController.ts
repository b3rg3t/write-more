import type { Response } from "express";
import mongoose from "mongoose";
import SComment from "../models/schemas/SComment";
import SNote from "../models/schemas/SNote";
import STrip from "../models/schemas/STrip";
import SUser from "../models/schemas/SUser";
import { AuthRequest } from "../middleware/authenticate";
import { EUserRole } from "../models/enums/EUserRole";

const withCommentUserName = (comment: any) => {
  const user = comment?.user;
  if (!user || typeof user === "string") {
    return comment;
  }

  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return {
    ...comment,
    user: {
      ...user,
      name,
    },
  };
};

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

const canAccessComment = async (userId: string, commentId: string) =>
  Boolean(
    await SComment.exists({
      _id: commentId,
      user: new mongoose.Types.ObjectId(userId),
    }),
  );

const canAccessNote = async (userId: string, noteId: string) =>
  Boolean(
    await STrip.exists({
      users: new mongoose.Types.ObjectId(userId),
      notes: noteId,
    }),
  );

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    if (!hasUserContext(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessContext = await resolveAccessContext(req);
    if (!accessContext) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const noteId =
      typeof req.query.noteId === "string" ? req.query.noteId : null;
    const filters: Record<string, unknown> = {};

    if (noteId) {
      const note = await SNote.findById(noteId).select("commentIds");
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      if (
        !accessContext.isAdmin &&
        !(await canAccessNote(accessContext.userId, noteId))
      ) {
        return res.status(404).json({ message: "Note not found" });
      }

      filters._id = { $in: note.commentIds ?? [] };
    }

    if (!accessContext.isAdmin && !noteId) {
      filters.user = new mongoose.Types.ObjectId(accessContext.userId);
    }

    const comments = await SComment.find(filters)
      .populate("user", "username firstName lastName")
      .sort({ createdAt: 1 })
      .lean();

    res.json(comments.map(withCommentUserName));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getComment = async (req: AuthRequest, res: Response) => {
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
      !(await canAccessComment(accessContext.userId, req.params.id))
    ) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = await SComment.findById(req.params.id)
      .populate("user", "username firstName lastName")
      .lean();
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(withCommentUserName(comment));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  const { content, noteId } = req.body;

  try {
    if (!hasUserContext(req)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessContext = await resolveAccessContext(req);
    if (!accessContext) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!noteId || !mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({ message: "Valid noteId is required" });
    }

    const note = await SNote.findById(noteId).select("commentIds");
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (
      !accessContext.isAdmin &&
      !(await canAccessNote(accessContext.userId, noteId))
    ) {
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

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  const { content } = req.body;

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
      !(await canAccessComment(accessContext.userId, req.params.id))
    ) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const updatedComment = await SComment.findByIdAndUpdate(
      req.params.id,
      { content, isEdited: true },
      { new: true },
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
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
      !(await canAccessComment(accessContext.userId, req.params.id))
    ) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const deletedComment = await SComment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await SNote.updateMany(
      { commentIds: deletedComment._id },
      { $pull: { commentIds: deletedComment._id } },
    );

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
