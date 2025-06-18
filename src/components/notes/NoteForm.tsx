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
import { useAppDispatch } from "../../store/redux/hooks";
import { stopEditNote } from "../../store/reducers/notes/notesSlice";
import { updateOneNote } from "../../store/reducers/notes/notesSlice";
import { TNote } from "../../models/type/TNote";
import { fontSize16 } from "../utils/FontSize";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export const NoteForm: FC<{ note: TNote }> = ({ note }) => {
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue,
  } = useForm<TBasicNote>({
    defaultValues: {
      [ENoteForm.NAME]: note?.name || "",
      [ENoteForm.CONTENT]: note?.content || "",
    },
  });

  const {
    notes: { notesForm },
  } = text;

  useEffect(() => {
    setValue(ENoteForm.NAME, note?.name || "");
    setValue(ENoteForm.CONTENT, note?.content || "");
  }, [note, setValue]);

  const onSubmit = (data: TBasicNote) => {
    if (note) {
      dispatch(
        updateOneNote({
          id: note.id,
          changes: {
            name: data[ENoteForm.NAME],
            content: data[ENoteForm.CONTENT],
            updatedAt: new Date().toISOString(),
            isNew: false,
          },
        })
      );
    }
    reset();
    dispatch(stopEditNote());
  };

  const onCancel = () => {
    reset();
    dispatch(stopEditNote());
  };

  const formTitle = !note.isNew ? notesForm.titleEdit : notesForm.titleNew;

  if (!note) return null;

  return (
    <Paper
      elevation={6}
      sx={{
        maxWidth: 500,
        margin: "32px auto",
        borderRadius: 4,
        p: 2,
        my: 2,
        mx: 2,
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
            id="note-name"
            label="Name"
            variant="outlined"
            error={!!errors[ENoteForm.NAME]}
            helperText={
              errors[ENoteForm.NAME] ? notesForm.helperText.nameRequired : ""
            }
            {...register(ENoteForm.NAME, { required: true })}
            defaultValue={note.name}
            margin="normal"
            fullWidth
          />
          <TextField
            id="note-content"
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
            defaultValue={note.content}
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
