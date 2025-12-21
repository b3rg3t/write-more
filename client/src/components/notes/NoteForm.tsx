import { FormGroup, TextField } from "@mui/material";
import { FC, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
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
      [ENoteForm.TITLE]: "",
      [ENoteForm.CONTENT]: "",
      [ENoteForm.LINKS]: [],
      [ENoteForm.START_DATE]: "",
      [ENoteForm.END_DATE]: "",
    },
  });

  const {
    notes: { notesForm },
  } = text;

  useEffect(() => {
    if (!note || isNew) {
      reset();
      return;
    } else {
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
    }
  }, [note, isNew, creatingNoteForTrip]);

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
        <Controller
          name={ENoteForm.TITLE}
          control={control}
          rules={{ required: notesForm.helperText.nameRequired }}
          render={({ field }) => (
            <TextField
              id={ENoteForm.TITLE}
              label="Name"
              variant="outlined"
              error={!!errors[ENoteForm.TITLE]}
              helperText={
                errors[ENoteForm.TITLE] ? notesForm.helperText.nameRequired : ""
              }
              {...field}
              margin="normal"
            />
          )}
        />
        <Controller
          name={ENoteForm.CONTENT}
          control={control}
          rules={{ required: notesForm.helperText.contentRequired }}
          render={({ field }) => (
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
              {...field}
              margin="normal"
              multiline
              minRows={3}
            />
          )}
        />
        <Controller
          name={ENoteForm.START_DATE}
          control={control}
          render={({ field }) => (
            <TextField
              id={ENoteForm.START_DATE}
              label="Start Date"
              type="date"
              {...field}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          )}
        />
        <Controller
          name={ENoteForm.END_DATE}
          control={control}
          render={({ field }) => (
            <TextField
              id={ENoteForm.END_DATE}
              label="End Date"
              type="date"
              {...field}
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          )}
        />
        <LinkForm control={control} register={register} errors={errors} />
        {children}
      </FormGroup>
    </form>
  );
};
