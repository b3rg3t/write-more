import { IUser } from "../interface/IUser";

export type TBasicUser = Partial<Omit<IUser, "createdAt" | "updatedAt">>;
