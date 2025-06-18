import { TNote } from "../../../models/type/TNote";

export const reorderNotes = (
  notes: TNote[],
  startIndex: number,
  endIndex: number
): TNote[] => {
  const result = Array.from(notes);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
