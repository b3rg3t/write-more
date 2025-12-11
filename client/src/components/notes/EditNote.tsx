// import { useAppSelector } from "../../store/redux/hooks";
// import { selectById } from "../../store/reducers/notes/notesSlice";
import { useGetAllNotesQuery } from "../../store/reducers/api/apiSlice";
import { selectIsEditing, selectIsNew } from "../../store/reducers/notes/notesSlice";
import { useAppSelector } from "../../store/redux/hooks";
import { NoteForm } from "./NoteForm";

export const EditNote = () => {
  const isEditing = useAppSelector(selectIsEditing);
  const isNew = useAppSelector(selectIsNew);
  const { note } = useGetAllNotesQuery(undefined,{
    selectFromResult: ({ data }) => ({
      note: isEditing
        ? data?.find((note) => note._id === isEditing)
        : undefined,
    }),
  });

  if(!isEditing && !isNew){
    return null;  
  }
  return <NoteForm note={note} />;
};
