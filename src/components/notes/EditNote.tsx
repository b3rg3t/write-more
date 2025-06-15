import { useAppSelector } from "../../store/redux/hooks";
import { selectById } from "../../store/reducers/notes/notesSlice";
import { NoteForm } from "./NoteForm";

export const EditNote = () => {
  const note = useAppSelector((state) =>
    selectById(state, state.notes.isEditing ?? "")
  );

  if (!note) {
    return null;
  }
  return <NoteForm note={note} />;
};
