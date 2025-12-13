import { Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
