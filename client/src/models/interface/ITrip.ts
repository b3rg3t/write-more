import { IBase } from "./IBase";
import { INote } from "./INote";
import { ITodo } from "./ITodo";
import { ITripUser } from "./ITripUser";
import { IUser } from "./IUser";

export interface ITrip extends IBase {
  title: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  notes: INote[];
  todos: ITodo[];
  users: ITripUser[] | string[];
  createdBy: IUser;
  order: number;
}
