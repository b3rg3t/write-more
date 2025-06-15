import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  removeOneNote,
  selectAll,
} from "../../store/reducers/notes/notesSlice";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export const NoteList = () => {
  const notes = useAppSelector(selectAll);
  const dispatch = useAppDispatch();

  return (
    <List dense>
      {notes.map((note) => (
        <ListItem
          key={note.id}
          onClick={() => alert(`Clicked on note: ${note.name}`)}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => dispatch(removeOneNote(note.id))}
            >
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={note.name} secondary={"Secondary text"} />
        </ListItem>
      ))}
    </List>
  );
};
