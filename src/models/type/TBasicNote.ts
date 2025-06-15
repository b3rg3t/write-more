import { TNote } from "./TNote";

export type TBasicNote = Partial<Omit<TNote, "createdAt" | "updatedAt" | "id">>;
