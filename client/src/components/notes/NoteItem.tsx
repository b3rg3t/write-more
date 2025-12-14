import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  IconButton,
  Container,
  List,
  ListItem,
  Chip,
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
import { TLink } from "../../models/type/TLink";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export const NoteItem: FC<{ note: INote }> = ({ note }) => {
  const dispatch = useAppDispatch();

  const handleEditNote = () => {
    dispatch(setEditNote(note._id));
  };

  const handleDeleteNote = async () => {
    dispatch(deleteNote(note._id));
  };

  const handleClick = (url: TLink["url"]) => {
    window.open(url, "_blank", "noopener,noreferrer");
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
            variant="h3"
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

      <CardActions
        sx={{
          display: "flex",
          justifyContent: "between",
          alignItems: "end",
          flex: 1,
          px: 0,
          pt: 0,
        }}
      >
        {note.links && (
          <Container
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flex: 1,
              mt: 1,
              pr: 0,
              pl: 1,
            }}
          >
            <List
              dense
              sx={{ p: 0, display: "flex", flexWrap: "wrap", gap: 1 }}
            >
              {note.links.map((link, index) => (
                <ListItem key={link.url + index} sx={{ p: 0, display: "flex" }}>
                  <Chip
                    icon={<OpenInNewIcon fontSize="small" />}
                    label={link.name}
                    variant="outlined"
                    onClick={() => handleClick(link.url)}
                  />
                </ListItem>
              ))}
            </List>
          </Container>
        )}
        <Container
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flex: 1,
            pl: 0,
            pr: 1,
          }}
        >
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
        </Container>
      </CardActions>
    </Card>
  );
};
