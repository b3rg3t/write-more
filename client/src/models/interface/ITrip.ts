import { IBase } from "./IBase";
import { INote } from "./INote";
import { ITodo } from "./ITodo";

export interface ITrip extends IBase {
  title: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  notes: INote[];
  todos: ITodo[];
  order: number;
}
