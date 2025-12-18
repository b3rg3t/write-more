import {
  FormGroup,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { FC, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { TBasicTrip } from "../../models/type/TBasicTrip";
import { ETripForm } from "../../models/enum/ETripForm";
import { text } from "../../localization/eng";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import { ITrip } from "../../models/interface/ITrip";
import { cancelTrip, selectIsNew } from "../../store/reducers/trips/tripsSlice";
import {
  useAddTripMutation,
  useUpdateTripMutation,
} from "../../store/reducers/api/tripApiSlice";
import { useGetAllNotesQuery } from "../../store/reducers/api/noteApiSlice";
import { useGetAllTodosQuery } from "../../store/reducers/api/todoApiSlice";

export const TripForm: FC<{
  trip?: ITrip;
  children: React.ReactNode;
}> = ({ trip, children }) => {
  const isNew = useAppSelector(selectIsNew);
  const [createTrip] = useAddTripMutation();
  const [updateTrip] = useUpdateTripMutation();
  const dispatch = useAppDispatch();
  const titleRef = useRef<HTMLInputElement>(null);

  const { data: notes } = useGetAllNotesQuery();
  const { data: todos } = useGetAllTodosQuery();

  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue,
    control,
  } = useForm<TBasicTrip>({
    defaultValues: {
      [ETripForm.TITLE]: trip?.title || "",
      [ETripForm.DESCRIPTION]: trip?.description || "",
      [ETripForm.NOTES]: trip?.notes || [],
      [ETripForm.TODOS]: trip?.todos || [],
    },
  });

  const {
    trips: { tripsForm },
  } = text;

  useEffect(() => {
    setValue(ETripForm.TITLE, trip?.title || "");
    setValue(ETripForm.DESCRIPTION, trip?.description || "");
    setValue(ETripForm.NOTES, trip?.notes || []);
    setValue(ETripForm.TODOS, trip?.todos || []);
  }, [trip, setValue]);

  useEffect(() => {
    // Focus the title field when the form opens
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const handlePostTrip = async (data: TBasicTrip) => {
    if (isNew) {
      try {
        createTrip({
          title: data[ETripForm.TITLE],
          description: data[ETripForm.DESCRIPTION],
          notes: data[ETripForm.NOTES] || [],
          todos: data[ETripForm.TODOS] || [],
        });
      } catch (error) {
        console.error("Error creating trip:", error);
      }
    } else if (trip) {
      try {
        updateTrip({
          _id: trip._id,
          title: data[ETripForm.TITLE],
          description: data[ETripForm.DESCRIPTION],
          notes: data[ETripForm.NOTES] || [],
          todos: data[ETripForm.TODOS] || [],
        });
      } catch (error) {
        console.error("Error creating trip:", error);
      }
    }
  };

  const onSubmit = (data: TBasicTrip) => {
    handlePostTrip(data);
    reset();
    dispatch(cancelTrip());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <FormGroup sx={{ width: "100%", px: 0, pb: 0, pt: 1 }}>
        <TextField
          id={ETripForm.TITLE}
          label="Title"
          variant="outlined"
          error={!!errors[ETripForm.TITLE]}
          helperText={
            errors[ETripForm.TITLE] ? tripsForm.helperText.titleRequired : ""
          }
          {...register(ETripForm.TITLE, { required: true })}
          defaultValue={trip?.title}
          margin="normal"
          fullWidth
          sx={{ mt: 0 }}
          inputRef={titleRef}
        />
        <TextField
          id={ETripForm.DESCRIPTION}
          label="Description"
          variant="outlined"
          multiline
          minRows={2}
          error={!!errors[ETripForm.DESCRIPTION]}
          {...register(ETripForm.DESCRIPTION)}
          defaultValue={trip?.description}
          margin="normal"
          fullWidth
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>{text.notes.header}</InputLabel>
          <Controller
            name={ETripForm.NOTES}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                multiple
                label="Notes"
                value={field.value || []}
              >
                {notes?.map((note) => (
                  <MenuItem key={note._id} value={note._id}>
                    {note.title}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>{text.todos.header}</InputLabel>
          <Controller
            name={ETripForm.TODOS}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                multiple
                label="Todos"
                value={field.value || []}
              >
                {todos?.map((todo) => (
                  <MenuItem key={todo._id} value={todo._id}>
                    {todo.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        {children}
      </FormGroup>
    </form>
  );
};
