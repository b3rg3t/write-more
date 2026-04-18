import mongoose, { Schema } from "mongoose";
import { IImage } from "../interfaces/IImage";

const SImage: Schema = new Schema(
  {
    fileId: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    thumbnailFileId: {
      type: String,
    },
    thumbnailContentType: {
      type: String,
    },
    thumbnailSize: {
      type: Number,
    },
    uploadedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IImage>("Image", SImage, "my_images");
