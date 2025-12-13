import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import { useAppDispatch } from "../../store/redux/hooks";
import { toLocalTime } from "../utils/ToLocalTime";
import { FC } from "react";
import { fontSize16 } from "../utils/FontSize";
import { INote } from "../../models/interface/INote";
import { text } from "../../localization/eng";
import { deleteNote, setEditNote } from "../../store/reducers/notes/notesSlice";

export const NoteItem: FC<{ note: INote }> = ({ note }) => {
  const dispatch = useAppDispatch();

  const handleEditNote = () => {
    dispatch(setEditNote(note._id));
  };

  const handleDeleteNote = async () => {
    dispatch(deleteNote(note._id));
  };

  return (
    <Card
      variant="outlined"
      sx={{ boxShadow: 2, borderRadius: 2, width: "100%", mb: 0 }}
    >
      <CardContent sx={{ px: 1, pt: 1, pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h2"
            component="div"
            fontSize={fontSize16}
            sx={{ fontWeight: 600 }}
          >
            {note.title ? note.title : text.notes.notesForm.titleUnknown}
          </Typography>
          <Stack direction="column" alignItems="flex-end" spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {toLocalTime(note.updatedAt)}
            </Typography>
          </Stack>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, whiteSpace: "pre-wrap" }}
        >
          {note.content}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", px: 2, pt: 0 }}>
        <IconButton
          color="primary"
          edge="end"
          aria-label="edit"
          onClick={handleEditNote}
        >
          <EditSquareIcon />
        </IconButton>
        <IconButton
          color="error"
          edge="end"
          aria-label="delete"
          onClick={handleDeleteNote}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};
