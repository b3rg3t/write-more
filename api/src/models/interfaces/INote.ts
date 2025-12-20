import { Document } from "mongoose";
import { ILink } from "./ILink";

export interface INote extends Document {
  title: string;
  content: string;
  order: number;
  links: ILink[];
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
