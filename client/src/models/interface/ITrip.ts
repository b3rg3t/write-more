import { IBase } from "./IBase";
import { ITripImage } from "./ITripImage";
import { INote } from "./INote";
import { ITodo } from "./ITodo";
import { ITripUser } from "./ITripUser";
import { IUser } from "./IUser";

export interface ITrip extends IBase {
  title: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  images: ITripImage[];
  notes: INote[];
  todos: ITodo[];
  users: ITripUser[] | string[];
  createdBy: IUser;
  order: number;
}
