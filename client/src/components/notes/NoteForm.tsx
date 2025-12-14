import { FormGroup, TextField } from "@mui/material";
import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TBasicNote } from "../../models/type/TBasicNote";
import { ENoteForm } from "../../models/enum/ENoteForm";
import { text } from "../../localization/eng";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import { INote } from "../../models/interface/INote";
import { cancelNote, selectIsNew } from "../../store/reducers/notes/notesSlice";
import {
  useAddNoteMutation,
  useUpdateNoteMutation,
} from "../../store/reducers/api/apiSlice";
import { LinkForm } from "./links/LinkForm";

export const NoteForm: FC<{
  note?: INote;
  children: React.ReactNode;
}> = ({ note, children }) => {
  const isNew = useAppSelector(selectIsNew);
  const [createNote] = useAddNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const dispatch = useAppDispatch();
  const titleRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue,
    control,
  } = useForm<TBasicNote>({
    defaultValues: {
      [ENoteForm.TITLE]: note?.title || "",
      [ENoteForm.CONTENT]: note?.content || "",
      [ENoteForm.LINKS]: [],
    },
  });

  const {
    notes: { notesForm },
  } = text;

  useEffect(() => {
    setValue(ENoteForm.TITLE, note?.title || "");
    setValue(ENoteForm.CONTENT, note?.content || "");
    setValue(ENoteForm.LINKS, note?.links || []);
  }, [note, setValue]);

  useEffect(() => {
    // Focus the title field when the form opens
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const handlePostNote = async (data: TBasicNote) => {
    if (isNew) {
      try {
        createNote({
          title: data[ENoteForm.TITLE],
          content: data[ENoteForm.CONTENT],
          links: data[ENoteForm.LINKS],
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
          links: data[ENoteForm.LINKS],
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <FormGroup sx={{ width: "100%", px: 0, pb: 0, pt: 1 }}>
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
          sx={{ mt: 0 }}
          inputRef={titleRef}
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
          sx={{ mb: 2 }}
        />
        <LinkForm control={control} register={register} errors={errors} />
        {children}
      </FormGroup>
    </form>
  );
};
