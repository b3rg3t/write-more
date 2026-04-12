import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  cancelNote,
  deleteNote,
  selectCreatingNoteForTrip,
  selectIsEditing,
  selectIsNew,
} from "../../store/reducers/notes/notesSlice";
import { useGetNoteQuery } from "../../store/reducers/api/apiSlice";
import { NoteForm } from "../notes/NoteForm";
import { text } from "../../localization/eng";
import { skipToken } from "@reduxjs/toolkit/query";

export const NoteFormModal = () => {
  const isNew = useAppSelector(selectIsNew);
  const isEditing = useAppSelector(selectIsEditing);
  const creatingNoteForTrip = useAppSelector(selectCreatingNoteForTrip);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const note1 = useGetNoteQuery(isEditing ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });

  const note = isEditing ? note1.data : undefined;

  const onClose = () => {
    dispatch(cancelNote());
  };

  const handleDeleteNote = async () => {
    if (note) {
      dispatch(deleteNote(note._id));
    }
  };

  const isButtonDisabled = !!(
    note1.error ||
    (isEditing &&
      (note1.isLoading || note1.isFetching || note1.isUninitialized))
  );

  const open = !!isNew || !!isEditing || !!creatingNoteForTrip;

  const { titleNew, titleEdit, buttons } = text.notes.notesForm;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      transitionDuration={0}
      aria-labelledby="note-form-dialog-title"
    >
      <DialogTitle
        id="note-form-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1, sm: 3 },
          py: { xs: 1, sm: 2 },
        }}
      >
        {isNew || creatingNoteForTrip ? titleNew : titleEdit}
        <Stack direction="row" spacing={1}>
          {note && (
            <IconButton
              color="error"
              edge="end"
              aria-label="delete"
              disabled={isButtonDisabled}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNote();
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{ px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 }, overflow: "auto" }}
      >
        {note1.error ? (
          <Alert severity="error">Failed to load note. Please try again.</Alert>
        ) : isEditing &&
          (note1.isLoading || note1.isFetching || note1.isUninitialized) ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : (
          <NoteForm note={note} formId="note-form" />
        )}
      </DialogContent>
      <DialogActions
        disableSpacing
        sx={{
          flexDirection: isMobile ? "column-reverse" : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap: 1,
          px: { xs: 1, sm: 3 },
          py: { xs: 1, sm: 2 },
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button onClick={onClose} color="inherit" fullWidth={isMobile}>
          {buttons.cancel}
        </Button>
        <Button
          type="submit"
          variant="contained"
          fullWidth={isMobile}
          form="note-form"
          disabled={isButtonDisabled}
        >
          {buttons.submit}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
