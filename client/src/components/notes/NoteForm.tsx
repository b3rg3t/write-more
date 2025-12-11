import {
  FormGroup,
  TextField,
  Button,
  ButtonGroup,
  Paper,
  Typography,
} from "@mui/material";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TBasicNote } from "../../models/type/TBasicNote";
import { ENoteForm } from "../../models/enum/ENoteForm";
import { text } from "../../localization/eng";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import { fontSize16 } from "../utils/FontSize";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { INote } from "../../models/interface/INote";
import { cancelNote, selectIsNew } from "../../store/reducers/notes/notesSlice";
import {
  useAddNoteMutation,
  useUpdateNoteMutation,
} from "../../store/reducers/api/apiSlice";

export const NoteForm: FC<{ note?: INote }> = ({ note }) => {
  const isNew = useAppSelector(selectIsNew);
  const [createNote] = useAddNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue,
  } = useForm<TBasicNote>({
    defaultValues: {
      [ENoteForm.TITLE]: note?.title || "",
      [ENoteForm.CONTENT]: note?.content || "",
    },
  });

  const {
    notes: { notesForm },
  } = text;

  useEffect(() => {
    setValue(ENoteForm.TITLE, note?.title || "");
    setValue(ENoteForm.CONTENT, note?.content || "");
  }, [note, setValue]);

  const handlePostNote = async (data: TBasicNote) => {
    if (isNew) {
      try {
        createNote({
          title: data[ENoteForm.TITLE],
          content: data[ENoteForm.CONTENT],
        });
      } catch (error) {
        console.error("Error creating note:", error);
      }
    } else if (note) {
      try {
        updateNote({
          _id: note._id,
          title: data[ENoteForm.TITLE],
          content: data[ENoteForm.CONTENT],
        });
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }
  };

  const onSubmit = (data: TBasicNote) => {
    handlePostNote(data);
    onCancel();
  };

  const onCancel = () => {
    reset();
    dispatch(cancelNote());
  };

  const formTitle = !isNew ? notesForm.titleEdit : notesForm.titleNew;

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 500,
        margin: "32px auto",
        borderRadius: 4,
        p: 2,
        my: 2,
        position: "relative",
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onCancel}
        sx={{ position: "absolute", top: 8, right: 8 }}
        size="small"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <Typography variant="h2" fontSize={fontSize16} sx={{ fontWeight: 600 }}>
        {formTitle}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <FormGroup sx={{ width: "100%" }}>
          <TextField
            id={ENoteForm.TITLE}
            label="Name"
            variant="outlined"
            error={!!errors[ENoteForm.TITLE]}
            helperText={
              errors[ENoteForm.TITLE] ? notesForm.helperText.nameRequired : ""
            }
            {...register(ENoteForm.TITLE, { required: true })}
            defaultValue={note?.title}
            margin="normal"
            fullWidth
          />
          <TextField
            id={ENoteForm.CONTENT}
            label="Content"
            variant="outlined"
            multiline
            minRows={4}
            error={!!errors[ENoteForm.CONTENT]}
            helperText={
              errors[ENoteForm.CONTENT]
                ? notesForm.helperText.contentRequired
                : ""
            }
            {...register(ENoteForm.CONTENT, { required: true })}
            defaultValue={note?.content}
            margin="normal"
            fullWidth
          />
          <ButtonGroup aria-label="Form action button group" sx={{ mt: 2 }}>
            <Button type="submit" variant="contained">
              {notesForm.buttons.submit}
            </Button>
            <Button onClick={onCancel} variant="outlined">
              {notesForm.buttons.cancel}
            </Button>
          </ButtonGroup>
        </FormGroup>
      </form>
    </Paper>
  );
};
