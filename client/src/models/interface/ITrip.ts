import { IBase } from "./IBase";
import { INote } from "./INote";
import { ITodo } from "./ITodo";
import { IUser } from "./IUser";

export interface ITrip extends IBase {
  title: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  notes: INote[];
  todos: ITodo[];
  users: IUser[] | string[];
  createdBy: IUser | string;
  order: number;
}
