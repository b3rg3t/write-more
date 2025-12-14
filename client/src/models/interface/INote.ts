import { TLink } from "../type/TLink";

export interface INote {
  content: string;
  createdAt: string;
  title: string;
  updatedAt: string;
  order: number;
  links: TLink[];
  __v: number;
  _id: string;
}
