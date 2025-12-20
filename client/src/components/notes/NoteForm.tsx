import { FormGroup, TextField } from "@mui/material";
import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TBasicNote } from "../../models/type/TBasicNote";
import { ENoteForm } from "../../models/enum/ENoteForm";
import { text } from "../../localization/eng";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import { INote } from "../../models/interface/INote";
import {
  cancelNote,
  selectCreatingNoteForTrip,
  selectIsNew,
} from "../../store/reducers/notes/notesSlice";
import {
  useAddNoteMutation,
  useUpdateNoteMutation,
  useCreateNoteForTripMutation,
} from "../../store/reducers/api/apiSlice";
import { LinkForm } from "./links/LinkForm";

export const NoteForm: FC<{
  note?: INote;
  children: React.ReactNode;
}> = ({ note, children }) => {
  const isNew = useAppSelector(selectIsNew);
  const creatingNoteForTrip = useAppSelector(selectCreatingNoteForTrip);
  const [createNote] = useAddNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [createNoteForTrip] = useCreateNoteForTripMutation();
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
      [ENoteForm.START_DATE]: note?.startDate
        ? new Date(note.startDate).toISOString().split("T")[0]
        : "",
      [ENoteForm.END_DATE]: note?.endDate
        ? new Date(note.endDate).toISOString().split("T")[0]
        : "",
    },
  });

  const {
    notes: { notesForm },
  } = text;

  useEffect(() => {
    setValue(ENoteForm.TITLE, note?.title || "");
    setValue(ENoteForm.CONTENT, note?.content || "");
    setValue(ENoteForm.LINKS, note?.links || []);
    setValue(
      ENoteForm.START_DATE,
      note?.startDate
        ? new Date(note.startDate).toISOString().split("T")[0]
        : ""
    );
    setValue(
      ENoteForm.END_DATE,
      note?.endDate ? new Date(note.endDate).toISOString().split("T")[0] : ""
    );
  }, [note, setValue]);

  useEffect(() => {
    // Focus the title field when the form opens
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const handlePostNote = async (data: TBasicNote) => {
    const payload = {
      title: data[ENoteForm.TITLE] || "",
      content: data[ENoteForm.CONTENT] || "",
      links: data[ENoteForm.LINKS],
      startDate: data[ENoteForm.START_DATE] || null,
      endDate: data[ENoteForm.END_DATE] || null,
    };
    if (creatingNoteForTrip) {
      try {
        await createNoteForTrip({
          tripId: creatingNoteForTrip,
          ...payload,
        });
      } catch (error) {
        console.error("Error creating note for trip:", error);
      }
    } else if (isNew) {
      try {
        createNote(payload);
      } catch (error) {
        console.error("Error creating note:", error);
      }
    } else if (note) {
      try {
        updateNote({
          _id: note._id,
          ...payload,
        });
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }
  };

  const onSubmit = (data: TBasicNote) => {
    handlePostNote(data);
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
        />
        <TextField
          id={ENoteForm.CONTENT}
          label="Content"
          variant="outlined"
          error={!!errors[ENoteForm.CONTENT]}
          helperText={
            errors[ENoteForm.CONTENT]
              ? notesForm.helperText.contentRequired
              : ""
          }
          {...register(ENoteForm.CONTENT, { required: true })}
          defaultValue={note?.content}
          margin="normal"
          multiline
          minRows={3}
        />
        <TextField
          id={ENoteForm.START_DATE}
          label="Start Date"
          type="date"
          {...register(ENoteForm.START_DATE)}
          defaultValue={
            note?.startDate
              ? new Date(note.startDate).toISOString().split("T")[0]
              : ""
          }
          margin="normal"
        />
        <TextField
          id={ENoteForm.END_DATE}
          label="End Date"
          type="date"
          {...register(ENoteForm.END_DATE)}
          defaultValue={
            note?.endDate
              ? new Date(note.endDate).toISOString().split("T")[0]
              : ""
          }
          margin="normal"
        />
        <LinkForm control={control} register={register} errors={errors} />
        {children}
      </FormGroup>
    </form>
  );
};
