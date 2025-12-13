import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
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
      transitionDuration={0}
      aria-labelledby="note-form-dialog-title"
    >
      <DialogTitle id="note-form-dialog-title">
        {isNew ? titleNew : titleEdit}
      </DialogTitle>
      <DialogContent>
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
