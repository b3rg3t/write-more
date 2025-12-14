import { Document } from "mongoose";
import { ILink } from "./ILink";

export interface INote extends Document {
  title: string;
  content: string;
  order: number;
  links: ILink[];
  createdAt: Date;
  updatedAt: Date;
}
