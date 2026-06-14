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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import { useAppDispatch } from "../../store/redux/hooks";
import { FC } from "react";
import { fontSize16 } from "../utils/FontSize";
import { INote } from "../../models/interface/INote";
import { IComment } from "../../models/interface/IComment";
import { text } from "../../localization/eng";
import { setEditNote } from "../../store/reducers/notes/notesSlice";
import { TLink } from "../../models/type/TLink";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";
import { TripDates } from "../utils/TripDates";
import { NoteComments } from "./NoteComments";
import { useUpdateNoteMutation } from "../../store/reducers/api/apiSlice";

const NoteSummary: FC<{ note: INote }> = ({ note }) => {
  const commentCount = (note.commentIds ?? []).filter(
    (c): c is IComment => typeof c !== "string",
  ).length;
  const linkCount = note.links?.length ?? 0;

  if (commentCount === 0 && linkCount === 0) return null;

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
      {commentCount > 0 && (
        <Chip
          icon={<ChatBubbleOutlineIcon />}
          label={commentCount}
          variant="outlined"
          sx={{ p: 0.5 }}
        />
      )}
      {linkCount > 0 && (
        <Chip
          icon={<OpenInNewIcon />}
          label={linkCount}
          variant="outlined"
          sx={{ p: 0.5 }}
        />
      )}
    </Stack>
  );
};

export const NoteItem: FC<{
  note: INote;
  headingLevel?: TypographyVariant;
  tripId?: string;
  titleOnly?: boolean;
}> = ({ headingLevel = "h3", note, tripId, titleOnly = false }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [updateNote] = useUpdateNoteMutation();

  const handleEditNote = () => {
    dispatch(setEditNote(note._id));
  };

  const handleClick = () => {
    navigate(ERoutes.NOTE_DETAIL.replace(":noteId", note._id), {
      state: tripId ? { tripId } : undefined,
    });
  };

  const handleLinkClick = (url: TLink["url"]) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleToggleArchive = async () => {
    try {
      await updateNote({ _id: note._id, archived: !note.archived }).unwrap();
    } catch (error) {
      console.error("Error toggling note archive status:", error);
    }
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
          alignItems="start"
        >
          <Typography
            variant={headingLevel}
            fontSize={fontSize16}
            sx={{ fontWeight: 600, my: 1 }}
          >
            {note.title ? note.title : text.notes.notesForm.titleUnknown}
          </Typography>
          <Stack direction="row" alignItems="start" spacing={0.5}>
            <IconButton
              edge="end"
              aria-label={
                note.archived
                  ? text.notes.noteItem.unarchive
                  : text.notes.noteItem.archive
              }
              onClick={(e) => {
                e.stopPropagation();
                handleToggleArchive();
              }}
              sx={{ pr: 0.5, color: "warning.main" }}
            >
              {note.archived ? <UnarchiveIcon /> : <ArchiveIcon />}
            </IconButton>
            <IconButton
              color="info"
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
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0 }}>
          {titleOnly && (
            <TripDates
              startDate={note.startDate}
              endDate={note.endDate}
              styles={{ mt: 0, mb: 1 }}
            />
          )}

          {titleOnly && <NoteSummary note={note} />}
          {titleOnly ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
              }}
            >
              {note.content}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0, whiteSpace: "pre-wrap" }}
            >
              {note.content}
            </Typography>
          )}
        </Stack>
      </CardContent>

      {!titleOnly && (
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "between",
            alignItems: "stretch",
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
          <NoteComments
            noteId={note._id}
            comments={(note.commentIds ?? []).filter(
              (c): c is IComment => typeof c !== "string",
            )}
          />
        </CardActions>
      )}
    </Card>
  );
};
