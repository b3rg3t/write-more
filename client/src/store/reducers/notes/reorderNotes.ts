import { INote } from "../../../models/interface/INote";

export const reorderNotesHelper = (
  notes: INote[],
  startIndex: number,
  endIndex: number
): INote[] => {
  const result = Array.from(notes);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result.map((note, index) => ({ ...note, _id: note._id, order: index }));
};
