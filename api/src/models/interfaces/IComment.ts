import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  user: mongoose.Types.ObjectId;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}
