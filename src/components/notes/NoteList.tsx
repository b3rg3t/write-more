import List from "@mui/material/List";
import { useAppSelector } from "../../store/redux/hooks";
import { selectAll } from "../../store/reducers/notes/notesSlice";

import { NoteItem } from "./NoteItem";

export const NoteList = () => {
  const notes = useAppSelector(selectAll);
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <List dense>
      {sortedNotes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </List>
  );
};
