import List from "@mui/material/List";
import { useAppSelector } from "../../store/redux/hooks";
import { selectAll } from "../../store/reducers/notes/notesSlice";

import { NoteItem } from "./NoteItem";

export const NoteList = () => {
  const notes = useAppSelector(selectAll);

  return (
    <List dense>
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </List>
  );
};
