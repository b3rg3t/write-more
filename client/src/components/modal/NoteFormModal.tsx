import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  cancelNote,
  selectIsEditing,
  selectIsNew,
} from "../../store/reducers/notes/notesSlice";
import { useGetAllNotesQuery } from "../../store/reducers/api/apiSlice";
import { NoteForm } from "../notes/NoteForm";
import { text } from "../../localization/eng";

export const NoteFormModal = () => {
  const isNew = useAppSelector(selectIsNew);
  const isEditing = useAppSelector(selectIsEditing);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { note } = useGetAllNotesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      note: isEditing
        ? data?.find((note) => note._id === isEditing)
        : undefined,
    }),
  });

  const onClose = () => {
    dispatch(cancelNote());
  };

  const open = !!isNew || !!isEditing;

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
        {isNew ? titleNew : titleEdit}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 } }}>
        <NoteForm note={note}>
          <DialogActions sx={{ p: 0 }}>
            <Button onClick={onClose} color="inherit">
              {buttons.cancel}
            </Button>
            <Button type="submit" variant="contained">
              {buttons.submit}
            </Button>
          </DialogActions>
        </NoteForm>
      </DialogContent>
    </Dialog>
  );
};
