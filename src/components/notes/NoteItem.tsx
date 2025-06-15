import ListItem from "@mui/material/ListItem";
import { useAppDispatch } from "../../store/redux/hooks";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { editNote, removeOneNote } from "../../store/reducers/notes/notesSlice";
import { toLocalTime } from "../utils/ToLocalTime";
import ListItemText from "@mui/material/ListItemText";
import { FC } from "react";
import { TNote } from "../../models/type/TNote";

export const NoteItem: FC<{ note: TNote }> = ({ note }) => {
  const dispatch = useAppDispatch();
  return (
    <ListItem
      key={note.id}
      secondaryAction={
        <>
          <IconButton
            color="primary"
            edge="end"
            aria-label="edit"
            onClick={() => dispatch(editNote(note.id))}
          >
            <EditSquareIcon />
          </IconButton>
          <IconButton
            color="error"
            edge="end"
            aria-label="delete"
            onClick={() => dispatch(removeOneNote(note.id))}
          >
            <DeleteIcon />
          </IconButton>
        </>
      }
    >
      <ListItemText
        primary={`${toLocalTime(note.createdAt)} ${note.name}`}
        secondary={"Secondary text"}
      />
    </ListItem>
  );
};
