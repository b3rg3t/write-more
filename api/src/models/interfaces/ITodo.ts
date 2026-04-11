import mongoose, { Document } from "mongoose";

export interface ITodo extends Document {
  name: string;
  order: number;
  isCompleted: boolean;
  users: mongoose.Types.ObjectId[];
}
