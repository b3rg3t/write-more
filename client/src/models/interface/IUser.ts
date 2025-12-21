import { IBase } from "./IBase";

export interface IUser extends Omit<IBase, "_id" | "__v" | "updatedAt"> {
  username: string;
  email: string;
  password: string;
}
