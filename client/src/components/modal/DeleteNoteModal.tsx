import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { text } from "../../localization/eng";
import {
  useDeleteNoteMutation,
  useGetAllNotesQuery,
} from "../../store/reducers/api/apiSlice";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  deleteNote,
  selectIsDeleting,
} from "../../store/reducers/notes/notesSlice";

export const DeleteNoteModal = () => {
  const isDeleting = useAppSelector(selectIsDeleting);
  const dispatch = useAppDispatch();
  const { note } = useGetAllNotesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      note: isDeleting
        ? data?.find((note) => note._id === isDeleting)
        : undefined,
    }),
  });
  const [deleteNoteApi] = useDeleteNoteMutation();

  const onClose = () => {
    dispatch(deleteNote(undefined));
  };
  const handleConfirm = async () => {
    if (note) {
      try {
        const payload = await deleteNoteApi({ _id: note._id }).unwrap();
        console.log("fulfilled", payload);
        dispatch(deleteNote(undefined));
      } catch (error) {
        console.error("rejected", error);
      }
    }
  };

  const open = !!isDeleting;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      transitionDuration={0}
      aria-labelledby="delete-note-dialog-title"
      aria-describedby="delete-note-dialog-description"
    >
      <DialogTitle id="delete-note-dialog-title">
        {text.notes.deleteNote.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-note-dialog-description">
          {text.notes.deleteNote.confirmation.replace(
            "{title}",
            note?.title || text.notes.notesForm.titleUnknown
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          {text.notes.deleteNote.cancel}
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          {text.notes.deleteNote.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
