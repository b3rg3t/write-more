import { IBase } from "../../../models/interface/IBase";

export const reordersHelper = <T extends IBase>(
  notes: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(notes);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result.map((note, index) => ({
    ...note,
    _id: note._id,
    order: index,
  })) as T[];
};
