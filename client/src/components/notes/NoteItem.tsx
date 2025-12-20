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
  TypographyVariant,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useAppDispatch } from "../../store/redux/hooks";
import { toLocalTime } from "../utils/ToLocalTime";
import { FC } from "react";
import { fontSize16 } from "../utils/FontSize";
import { INote } from "../../models/interface/INote";
import { text } from "../../localization/eng";
import { setEditNote } from "../../store/reducers/notes/notesSlice";
import { TLink } from "../../models/type/TLink";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";

export const NoteItem: FC<{
  note: INote;
  headingLevel?: TypographyVariant;
}> = ({ headingLevel = "h3", note }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleEditNote = () => {
    dispatch(setEditNote(note._id));
  };

  const handleClick = () => {
    navigate(ERoutes.NOTE_DETAIL.replace(":noteId", note._id));
  };

  const handleLinkClick = (url: TLink["url"]) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      variant="outlined"
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        width: "100%",
        mb: 0,
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ px: 1, pt: 0.5, pb: 0 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant={headingLevel}
            fontSize={fontSize16}
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {note.title ? note.title : text.notes.notesForm.titleUnknown}
          </Typography>
          <Stack direction="column" alignItems="flex-end" spacing={0.5}>
            <IconButton
              color="primary"
              edge="end"
              aria-label="edit"
              onClick={(e) => {
                e.stopPropagation();
                handleEditNote();
              }}
              sx={{ pr: 0.5 }}
            >
              <EditSquareIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0, whiteSpace: "pre-wrap" }}
        >
          {note.content}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "between",
          alignItems: "end",
          flex: 1,
          px: 0,
          pt: 0,
          pb: 1,
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
              pb: 0,
            }}
          >
            <List
              dense
              sx={{ p: 0, display: "flex", flexWrap: "wrap", gap: 1 }}
            >
              {note.links.map((link, index) => (
                <ListItem
                  key={link.url + index}
                  sx={{ p: 0, display: "flex", width: "auto" }}
                >
                  <Chip
                    icon={<OpenInNewIcon fontSize="small" />}
                    label={link.name}
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLinkClick(link.url);
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Container>
        )}
      </CardActions>
    </Card>
  );
};
