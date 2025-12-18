import mongoose, { Document } from "mongoose";

export interface ITrip extends Document {
  title: string;
  description?: string;
  notes: mongoose.Types.ObjectId[];
  todos: mongoose.Types.ObjectId[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
