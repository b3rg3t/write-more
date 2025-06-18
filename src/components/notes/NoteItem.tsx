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
import { editNote, removeOneNote } from "../../store/reducers/notes/notesSlice";
import { toLocalTime } from "../utils/ToLocalTime";
import { FC } from "react";
import { TNote } from "../../models/type/TNote";

export const NoteItem: FC<{ note: TNote }> = ({ note }) => {
  const dispatch = useAppDispatch();

  return (
    <Card variant="outlined" sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {note.name}
          </Typography>
          <Stack direction="column" alignItems="flex-end" spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Created: {toLocalTime(note.createdAt)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Updated: {toLocalTime(note.updatedAt)}
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {note.content}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <IconButton
          color="primary"
          edge="end"
          aria-label="edit"
          onClick={() => dispatch(editNote(note))}
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
      </CardActions>
    </Card>
  );
};
