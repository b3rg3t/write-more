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

  const { title, titleUnknown, confirmation, buttons } = text.notes.deleteNote;

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
      <DialogTitle id="delete-note-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-note-dialog-description" sx={{ mb: 2 }}>
          {confirmation.replace("{title}", note?.title || titleUnknown)}
        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {buttons.cancel}
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            {buttons.confirm}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
