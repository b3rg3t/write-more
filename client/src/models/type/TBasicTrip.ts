import { INote } from "../interface/INote";
import { ITodo } from "../interface/ITodo";
import { ITrip } from "../interface/ITrip";
import { IUser } from "../interface/IUser";

export type TBasicTrip = Partial<
  Omit<
    ITrip,
    | "createdAt"
    | "updatedAt"
    | "notes"
    | "todos"
    | "users"
    | "createdBy"
    | "startDate"
    | "endDate"
  > & {
    notes: INote[] | string[];
    todos: ITodo[] | string[];
    users?: IUser[] | string[];
    createdBy?: IUser | string;
    startDate?: Date | string;
    endDate?: Date | string;
  }
>;
