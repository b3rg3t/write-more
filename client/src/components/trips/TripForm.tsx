import {
  FormGroup,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
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
} from "../../store/reducers/api/apiSlice";
import { useGetAllNotesQuery } from "../../store/reducers/api/apiSlice";
import { useGetAllTodosQuery } from "../../store/reducers/api/apiSlice";
import { useGetAllUsersQuery } from "../../store/reducers/api/apiSlice";

export const TripForm: FC<{
  trip?: ITrip;
  children?: React.ReactNode;
  formId?: string;
}> = ({ trip, children, formId }) => {
  const isNew = useAppSelector(selectIsNew);
  const [createTrip] = useAddTripMutation();
  const [updateTrip] = useUpdateTripMutation();
  const dispatch = useAppDispatch();
  const titleRef = useRef<HTMLInputElement>(null);

  const {
    data: notes,
    isLoading: notesLoading,
    error: notesError,
  } = useGetAllNotesQuery();
  const {
    data: todos,
    isLoading: todosLoading,
    error: todosError,
  } = useGetAllTodosQuery();
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsersQuery();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<TBasicTrip>({
    mode: "onSubmit",
    defaultValues: {
      [ETripForm.TITLE]: "",
      [ETripForm.DESCRIPTION]: "",
      [ETripForm.START_DATE]: "",
      [ETripForm.END_DATE]: "",
      [ETripForm.NOTES]: [],
      [ETripForm.TODOS]: [],
      [ETripForm.USERS]: [],
    },
  });

  const {
    trips: { tripsForm },
  } = text;

  useEffect(() => {
    if (!trip || isNew) {
      reset();
      return;
    } else {
      setValue(ETripForm.TITLE, trip?.title || "");
      setValue(ETripForm.DESCRIPTION, trip?.description || "");
      setValue(
        ETripForm.START_DATE,
        trip?.startDate
          ? new Date(trip.startDate).toISOString().split("T")[0]
          : "",
      );
      setValue(
        ETripForm.END_DATE,
        trip?.endDate ? new Date(trip.endDate).toISOString().split("T")[0] : "",
      );
      setValue(
        ETripForm.NOTES,
        trip?.notes.map((n) => (typeof n === "string" ? n : n._id)) || [],
      );
      setValue(
        ETripForm.TODOS,
        trip?.todos.map((t) => (typeof t === "string" ? t : t._id)) || [],
      );
      setValue(
        ETripForm.USERS,
        trip?.users.map((u) => (typeof u === "string" ? u : u._id)) || [],
      );
    }
  }, [trip, isNew]);

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
          startDate: data[ETripForm.START_DATE]
            ? new Date(data[ETripForm.START_DATE])
            : undefined,
          endDate: data[ETripForm.END_DATE]
            ? new Date(data[ETripForm.END_DATE])
            : undefined,
          notes:
            data[ETripForm.NOTES]?.map((n) =>
              typeof n === "string" ? n : n._id,
            ) || [],
          todos:
            data[ETripForm.TODOS]?.map((t) =>
              typeof t === "string" ? t : t._id,
            ) || [],
          users:
            data[ETripForm.USERS]?.map((u) =>
              typeof u === "string" ? u : u._id,
            ) || [],
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
          startDate: data[ETripForm.START_DATE]
            ? new Date(data[ETripForm.START_DATE])
            : undefined,
          endDate: data[ETripForm.END_DATE]
            ? new Date(data[ETripForm.END_DATE])
            : undefined,
          notes:
            data[ETripForm.NOTES]?.map((n) =>
              typeof n === "string" ? n : n._id,
            ) || [],
          todos:
            data[ETripForm.TODOS]?.map((t) =>
              typeof t === "string" ? t : t._id,
            ) || [],
          users:
            data[ETripForm.USERS]?.map((u) =>
              typeof u === "string" ? u : u._id,
            ) || [],
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
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      style={{ width: "100%" }}
    >
      <FormGroup sx={{ width: "100%", px: 0, pb: 0, pt: 1 }}>
        {(notesError || todosError || usersError) && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {notesError && "Failed to load notes. "}
            {todosError && "Failed to load todos. "}
            {usersError && "Failed to load users. "}
            Some options may be unavailable.
          </Alert>
        )}
        <Controller
          name={ETripForm.TITLE}
          control={control}
          rules={{ required: tripsForm.helperText.titleRequired }}
          render={({ field }) => (
            <TextField
              id={ETripForm.TITLE}
              label="Title"
              variant="outlined"
              {...field}
              error={!!errors[ETripForm.TITLE]}
              helperText={
                errors[ETripForm.TITLE]
                  ? tripsForm.helperText.titleRequired
                  : ""
              }
              margin="normal"
              fullWidth
              sx={{ mt: 0 }}
              inputRef={titleRef}
            />
          )}
        />
        <Controller
          name={ETripForm.DESCRIPTION}
          control={control}
          render={({ field }) => (
            <TextField
              id={ETripForm.DESCRIPTION}
              label="Description"
              variant="outlined"
              multiline
              minRows={2}
              {...field}
              error={!!errors[ETripForm.DESCRIPTION]}
              margin="normal"
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
        />
        <Controller
          name={ETripForm.START_DATE}
          control={control}
          render={({ field }) => (
            <TextField
              id={ETripForm.START_DATE}
              label="Start Date"
              type="date"
              variant="outlined"
              {...field}
              InputLabelProps={{ shrink: true }}
              error={!!errors[ETripForm.START_DATE]}
              margin="normal"
              fullWidth
            />
          )}
        />
        <Controller
          name={ETripForm.END_DATE}
          control={control}
          render={({ field }) => (
            <TextField
              id={ETripForm.END_DATE}
              label="End Date"
              type="date"
              variant="outlined"
              {...field}
              InputLabelProps={{ shrink: true }}
              error={!!errors[ETripForm.END_DATE]}
              margin="normal"
              fullWidth
            />
          )}
        />
        <FormControl fullWidth margin="normal" disabled={notesLoading}>
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
                {notesLoading && (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                )}
                {notes?.map((note) => (
                  <MenuItem key={note._id} value={note._id}>
                    {note.title}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        <FormControl fullWidth margin="normal" disabled={todosLoading}>
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
                {todosLoading && (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                )}
                {todos?.map((todo) => (
                  <MenuItem key={todo._id} value={todo._id}>
                    {todo.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
        <FormControl fullWidth margin="normal" disabled={usersLoading}>
          <InputLabel>{text.user.header}</InputLabel>
          <Controller
            name={ETripForm.USERS}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                multiple
                label="Users"
                value={field.value || []}
              >
                {usersLoading && (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                )}
                {users?.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName} (@${user.username})`
                      : user.username}
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
