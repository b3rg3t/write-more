import { EUserRole } from "../enum/EUserRole";
import { IUser } from "../interface/IUser";
import { TBasicUser } from "./TBasicUser";

export type TUser = TBasicUser &
  IUser & {
    firstName: string;
    lastName: string;
    role: EUserRole;
  };
