import { IBase } from "./IBase";

export interface IUser extends Omit<IBase, "__v" | "updatedAt"> {
  username: string;
  email: string;
  password: string;
}
