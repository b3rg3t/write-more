import mongoose, { Document } from "mongoose";

export interface ITripSectionBase {
  isAccordionOpen: boolean;
}

export interface ITripNotesSection extends ITripSectionBase {}

export interface ITripTodosSection extends ITripSectionBase {
  showCompleted: boolean;
}

export interface ITripImagesSection extends ITripSectionBase {}

export interface ITrip extends Document {
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  images: mongoose.Types.ObjectId[];
  notes: mongoose.Types.ObjectId[];
  todos: mongoose.Types.ObjectId[];
  users: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  order: number;
  notesSection?: ITripNotesSection;
  todosSection?: ITripTodosSection;
  imagesSection?: ITripImagesSection;
  createdAt: Date;
  updatedAt: Date;
}
