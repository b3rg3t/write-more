import { Document } from "mongoose";

export interface IImage extends Document {
  fileId: string;
  contentType: string;
  originalName: string;
  size: number;
  thumbnailFileId?: string;
  thumbnailContentType?: string;
  thumbnailSize?: number;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
