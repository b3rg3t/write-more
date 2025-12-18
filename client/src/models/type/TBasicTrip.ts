import { INote } from "../interface/INote";
import { ITodo } from "../interface/ITodo";
import { ITrip } from "../interface/ITrip";

export type TBasicTrip = Partial<
  Omit<ITrip, "createdAt" | "updatedAt" | "notes" | "todos"> & {
    notes: INote[] | string[];
    todos: ITodo[] | string[];
  }
>;
