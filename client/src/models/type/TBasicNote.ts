import { INote } from "../interface/INote";

export type TBasicNote = Partial<Omit<INote, "createdAt" | "updatedAt">>;
