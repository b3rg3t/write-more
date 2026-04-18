import type { Request, Response } from "express";
import sharp from "sharp";
import { ITrip } from "../models/interfaces/ITrip";
import STrip from "../models/schemas/STrip";
import STodo from "../models/schemas/STodos";
import SNote from "../models/schemas/SNote";
import SImage from "../models/schemas/SImage";
import SUser from "../models/schemas/SUser";
import { AuthRequest } from "../middleware/authenticate";
import { EUserRole } from "../models/enums/EUserRole";
import { uploadTripImageToGridFs } from "../utils/tripImageStorage";

type TripImageUploadRequest = AuthRequest & {
  file?: Express.Multer.File;
};

const MAX_COMPRESSED_IMAGE_BYTES = 512 * 1024;

const tripImagePopulate = {
  path: "images",
  select: "originalName uploadedAt thumbnailContentType thumbnailSize",
};

// Get all trips for the authenticated user
export const getTrips = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    // Only get trips where the user is in the users array
    const trips = await STrip.find({ users: userId })
      .populate(tripImagePopulate)
      .populate("notes")
      .populate("todos")
      .populate("users", "username email firstName lastName")
      .populate("createdBy", "username email")
      .sort({ order: 1 });

    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin endpoint - get all trips
export const getAllTripsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    // Check if user is admin
    const user = await SUser.findById(userId);
    if (!user || user.role !== EUserRole.ADMIN) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Get all trips
    const trips = await STrip.find()
      .populate(tripImagePopulate)
      .populate("notes")
      .populate("todos")
      .populate("users", "username email firstName lastName")
      .populate("createdBy", "username email")
      .sort({ order: 1 });

    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a specific trip by ID
export const getTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const trip = await STrip.findOne({ _id: req.params.id, users: userId })
      .populate(tripImagePopulate)
      .populate({
        path: "notes",
        populate: {
          path: "commentIds",
          populate: {
            path: "user",
            select: "username firstName lastName",
          },
        },
      })
      .populate("todos")
      .populate("users", "username email firstName lastName")
      .populate("createdBy", "username email")
      .lean();

    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    const tripWithCommentUserNames = {
      ...trip,
      notes: (trip.notes || []).map((note: any) => ({
        ...note,
        commentIds: (note.commentIds || []).map((comment: any) => {
          const user = comment?.user;
          if (!user) {
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
        }),
      })),
    };

    res.json(tripWithCommentUserNames);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new trip
export const createTrip = async (req: AuthRequest, res: Response) => {
  const { title, description, startDate, endDate, notes, todos } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the highest order
    const highestOrderTrip = await STrip.findOne().sort({ order: -1 });
    const newOrder = highestOrderTrip ? highestOrderTrip.order + 1 : 0;

    const newTrip = new STrip({
      title,
      description,
      startDate,
      endDate,
      notes: notes || [],
      todos: todos || [],
      images: [],
      users: [userId], // Creator is automatically added
      createdBy: userId,
      order: newOrder,
    });
    const savedTrip = await newTrip.save();

    const populatedTrip = await STrip.findById(savedTrip._id)
      .populate(tripImagePopulate)
      .populate("notes")
      .populate("todos")
      .populate("users", "username email firstName lastName")
      .populate("createdBy", "username email");

    res.status(201).json(populatedTrip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a trip
export const updateTrip = async (req: AuthRequest, res: Response) => {
  const { title, description, startDate, endDate, notes, todos } = req.body;
  const userId = req.userId;

  try {
    // Check if user has access to this trip
    const existingTrip = await STrip.findOne({
      _id: req.params.id,
      users: userId,
    });
    if (!existingTrip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    const updatedTrip = await STrip.findByIdAndUpdate(
      req.params.id,
      { title, description, startDate, endDate, notes, todos },
      { new: true },
    )
      .populate(tripImagePopulate)
      .populate("notes")
      .populate("todos")
      .populate("users", "username email firstName lastName")
      .populate("createdBy", "username email");

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update order for all trips
export const updateOrder = async (req: Request, res: Response) => {
  const updates: Pick<ITrip, "_id" | "order">[] = req.body; // array of { id, order }

  try {
    const promises = updates.map((update) =>
      STrip.findByIdAndUpdate(
        update._id,
        { order: update.order },
        { new: true },
      ),
    );
    const updatedTrips = await Promise.all(promises);
    res.json(updatedTrips);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a trip
export const deleteTrip = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    // Only creator can delete
    const trip = await STrip.findOne({ _id: req.params.id, createdBy: userId });
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or not authorized to delete" });
    }

    const deletedTrip = await STrip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a todo and connect it to a trip
export const createTodoForTrip = async (req: AuthRequest, res: Response) => {
  const { name, isCompleted } = req.body;
  const tripId = req.params.tripId;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // First, create the todo
    const highestOrderTodo = await STodo.findOne().sort({ order: -1 });
    const newOrder = highestOrderTodo ? highestOrderTodo.order + 1 : 0;

    const newTodo = new STodo({
      name,
      isCompleted,
      order: newOrder,
      users: [userId],
    });
    const savedTodo = await newTodo.save();

    // Then, connect the todo to the trip
    const updatedTrip = await STrip.findByIdAndUpdate(
      tripId,
      {
        $addToSet: {
          todos: savedTodo._id,
          users: userId,
        },
      },
      { new: true },
    ).populate("todos");

    if (!updatedTrip) {
      // If trip update fails, we should probably delete the created todo
      await STodo.findByIdAndDelete(savedTodo._id);
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(201).json({
      todo: savedTodo,
      trip: updatedTrip,
      message: "Todo created and connected to trip successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a note and connect it to a trip
export const createNoteForTrip = async (req: AuthRequest, res: Response) => {
  const { title, content, links, startDate, endDate } = req.body;
  const tripId = req.params.tripId;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // First, create the note
    const highestOrderNote = await SNote.findOne().sort({ order: -1 });
    const newOrder = highestOrderNote ? highestOrderNote.order + 1 : 0;

    const newNote = new SNote({
      title,
      content,
      links,
      order: newOrder,
      users: [userId],
      startDate,
      endDate,
    });
    const savedNote = await newNote.save();

    // Then, connect the note to the trip
    const updatedTrip = await STrip.findByIdAndUpdate(
      tripId,
      {
        $addToSet: {
          notes: savedNote._id,
          users: userId,
        },
      },
      { new: true },
    ).populate("notes");

    if (!updatedTrip) {
      // If trip update fails, we should probably delete the created note
      await SNote.findByIdAndDelete(savedNote._id);
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(201).json({
      note: savedNote,
      trip: updatedTrip,
      message: "Note created and connected to trip successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add users to a trip
export const addUserToTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId: userIdToAdd } = req.body;
    const currentUserId = req.userId;

    // Check if current user has access
    const trip = await STrip.findOne({ _id: id, users: currentUserId });
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    // Add user if not already in the array
    if (!trip.users.includes(userIdToAdd)) {
      trip.users.push(userIdToAdd);
      await trip.save();
    }

    const updatedTrip = await STrip.findById(id)
      .populate(tripImagePopulate)
      .populate("notes")
      .populate("todos")
      .populate("users", "username email firstName lastName")
      .populate("createdBy", "username email");

    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({ message: "Error adding user to trip" });
  }
};

// Remove user from a trip
export const removeUserFromTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { id, userId: userIdToRemove } = req.params;
    const currentUserId = req.userId;

    // Check if current user is the creator
    const trip = await STrip.findOne({ _id: id, createdBy: currentUserId });
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or not authorized" });
    }

    // Don't allow removing the creator
    if (userIdToRemove === trip.createdBy.toString()) {
      return res.status(400).json({ message: "Cannot remove trip creator" });
    }

    trip.users = trip.users.filter(
      (userId) => userId.toString() !== userIdToRemove,
    );
    await trip.save();

    const updatedTrip = await STrip.findById(id)
      .populate(tripImagePopulate)
      .populate("notes")
      .populate("todos")
      .populate("users", "username email firstName lastName")
      .populate("createdBy", "username email");

    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({ message: "Error removing user from trip" });
  }
};

// Upload and compress trip image
export const uploadTripImage = async (
  req: TripImageUploadRequest,
  res: Response,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Image file is required (field name: image)." });
    }

    const trip = await STrip.findOne({ _id: req.params.id, users: userId });
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    const compressedImage = await sharp(req.file.buffer)
      .rotate()
      .webp({ quality: 20 })
      .toBuffer({ resolveWithObject: true });

    if (compressedImage.info.size > MAX_COMPRESSED_IMAGE_BYTES) {
      return res.status(413).json({
        message:
          "Compressed image is too large. Maximum allowed size is 524288 bytes (0.5MB).",
      });
    }

    const thumbnailImage = await sharp(compressedImage.data)
      .resize({ width: 320, withoutEnlargement: true })
      .webp({ quality: 50 })
      .toBuffer({ resolveWithObject: true });

    const baseName = req.file.originalname.replace(/\.[^/.]+$/, "") || "trip";
    const compressedFileName = `${baseName}.webp`;

    const uploadedFileId = await uploadTripImageToGridFs({
      buffer: compressedImage.data,
      fileName: compressedFileName,
      mimeType: "image/webp",
      tripId: trip._id.toString(),
      userId,
    });

    const thumbnailFileId = await uploadTripImageToGridFs({
      buffer: thumbnailImage.data,
      fileName: `${baseName}-snapshot.webp`,
      mimeType: "image/webp",
      tripId: trip._id.toString(),
      userId,
    });

    const savedImage = await new SImage({
      fileId: uploadedFileId,
      contentType: "image/webp",
      originalName: req.file.originalname,
      size: compressedImage.info.size,
      thumbnailFileId,
      thumbnailContentType: "image/webp",
      thumbnailSize: thumbnailImage.info.size,
      uploadedAt: new Date(),
    }).save();

    trip.images.push(savedImage._id);

    await trip.save();

    return res.json({
      message: "Trip image uploaded successfully",
      tripId: trip._id,
      image: {
        id: savedImage._id,
        fileId: savedImage.fileId,
        contentType: savedImage.contentType,
        originalName: savedImage.originalName,
        size: savedImage.size,
        thumbnailContentType: savedImage.thumbnailContentType,
        thumbnailSize: savedImage.thumbnailSize,
        uploadedAt: savedImage.uploadedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
