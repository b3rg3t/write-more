import { IComment } from "../interface/IComment";

export type TBasicComment = Partial<Omit<IComment, "createdAt" | "updatedAt">>;
