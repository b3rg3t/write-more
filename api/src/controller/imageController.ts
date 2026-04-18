import type { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/authenticate";
import STrip from "../models/schemas/STrip";
import SImage from "../models/schemas/SImage";
import {
  openTripImageDownloadStream,
  deleteTripImageFromGridFs,
} from "../utils/tripImageStorage";

// Get all images for a trip the user has access to
export const getTripImages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const trip = await STrip.findOne({
      _id: req.params.id,
      users: userId,
    }).lean();
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    const images = await SImage.find({ _id: { $in: trip.images } })
      .sort({ uploadedAt: -1 })
      .lean();

    const imageSnapshots = images.map((image) => ({
      _id: image._id,
      originalName: image.originalName,
      uploadedAt: image.uploadedAt,
      thumbnailContentType: image.thumbnailContentType || image.contentType,
      thumbnailSize: image.thumbnailSize || image.size,
      snapshotUrl: `/api/trips/${trip._id}/images/${image._id}?snapshot=true`,
    }));

    return res.json({
      tripId: trip._id,
      images: imageSnapshots,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get one specific image file for a trip the user has access to
export const getTripImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id: tripId, imageId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Types.ObjectId.isValid(imageId)) {
      return res.status(400).json({ message: "Invalid image id" });
    }

    const trip = await STrip.findOne({ _id: tripId, users: userId }).lean();
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    const hasImage = trip.images.some(
      (storedId) => storedId.toString() === imageId,
    );
    if (!hasImage) {
      return res.status(404).json({ message: "Image not found for this trip" });
    }

    const image = await SImage.findById(imageId).lean();
    if (!image) {
      return res.status(404).json({ message: "Image metadata not found" });
    }

    const snapshotRequested = req.query.snapshot !== "false";
    const selectedFileId =
      snapshotRequested && image.thumbnailFileId
        ? image.thumbnailFileId
        : image.fileId;
    const selectedContentType =
      snapshotRequested && image.thumbnailContentType
        ? image.thumbnailContentType
        : image.contentType;
    const selectedName = snapshotRequested
      ? `${image.originalName}.snapshot.webp`
      : image.originalName;

    let downloadStream;
    try {
      downloadStream = openTripImageDownloadStream(selectedFileId);
    } catch (err) {
      return res.status(404).json({ message: "Image file not found" });
    }

    res.setHeader(
      "Content-Type",
      selectedContentType || "application/octet-stream",
    );
    res.setHeader("Content-Disposition", `inline; filename="${selectedName}"`);

    downloadStream.on("error", () => {
      if (!res.headersSent) {
        res.status(404).json({ message: "Image file not found" });
      }
    });

    return downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a specific image from a trip
export const deleteTripImage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { id: tripId, imageId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Types.ObjectId.isValid(imageId)) {
      return res.status(400).json({ message: "Invalid image id" });
    }

    const trip = await STrip.findOne({ _id: tripId, users: userId });
    if (!trip) {
      return res
        .status(404)
        .json({ message: "Trip not found or access denied" });
    }

    const hasImage = trip.images.some(
      (storedId) => storedId.toString() === imageId,
    );
    if (!hasImage) {
      return res.status(404).json({ message: "Image not found for this trip" });
    }

    const image = await SImage.findById(imageId).lean();
    if (image) {
      await deleteTripImageFromGridFs(image.fileId);
      if (image.thumbnailFileId) {
        await deleteTripImageFromGridFs(image.thumbnailFileId);
      }
      await SImage.findByIdAndDelete(imageId);
    }

    trip.images = trip.images.filter(
      (storedId) => storedId.toString() !== imageId,
    );
    await trip.save();

    return res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
