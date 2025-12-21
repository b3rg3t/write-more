import { EUserRole } from "../enums/EUserRole";

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: EUserRole;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
