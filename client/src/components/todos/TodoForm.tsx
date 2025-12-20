import { FC, useEffect, useRef } from "react";
import { ITodo } from "../../models/interface/ITodo";
import { ETodoForm } from "../../models/enum/ETodoForm";
import { TBasicTodo } from "../../models/type/TBasicTodo";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  useAddTodoMutation,
  useUpdateTodoMutation,
  useCreateTodoForTripMutation,
} from "../../store/reducers/api/apiSlice";
import {
  cancelTodo,
  selectCreatingTodoForTrip,
  selectIsNew,
} from "../../store/reducers/todos/todosSlice";
import { FormGroup, TextField } from "@mui/material";
import { text } from "../../localization/eng";

export const TodoForm: FC<{
  todo?: ITodo;
  children: React.ReactNode;
}> = ({ todo, children }) => {
  const isNew = useAppSelector(selectIsNew);
  const creatingTodoForTrip = useAppSelector(selectCreatingTodoForTrip);
  const [createNote] = useAddTodoMutation();
  const [updateNote] = useUpdateTodoMutation();
  const [createTodoForTrip] = useCreateTodoForTripMutation();
  const dispatch = useAppDispatch();
  const titleRef = useRef<HTMLInputElement>(null);
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue,
  } = useForm<TBasicTodo>({
    defaultValues: {
      [ETodoForm.NAME]: todo?.name || "",
      [ETodoForm.IS_COMPLETED]: todo?.isCompleted || false,
    },
  });

  const {
    todos: { todosForm },
  } = text;

  useEffect(() => {
    setValue(ETodoForm.NAME, todo?.name || "");
    setValue(ETodoForm.IS_COMPLETED, todo?.isCompleted || false);
  }, [todo, setValue]);

  const handlePostNote = async (data: TBasicTodo) => {
    if (creatingTodoForTrip) {
      try {
        await createTodoForTrip({
          tripId: creatingTodoForTrip,
          name: data[ETodoForm.NAME] || "",
          isCompleted: data[ETodoForm.IS_COMPLETED] || false,
        });
      } catch (error) {
        console.error("Error creating todo for trip:", error);
      }
    } else if (isNew) {
      try {
        createNote({
          name: data[ETodoForm.NAME] || "",
          isCompleted: data[ETodoForm.IS_COMPLETED] || false,
        });
      } catch (error) {
        console.error("Error creating note:", error);
      }
    } else if (todo) {
      try {
        updateNote({
          _id: todo._id,
          name: data[ETodoForm.NAME] || "",
          isCompleted: data[ETodoForm.IS_COMPLETED] || false,
        });
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }
  };

  const onSubmit = (data: TBasicTodo) => {
    handlePostNote(data);
    reset();
    dispatch(cancelTodo());
  };

  useEffect(() => {
    // Focus the title field when the form opens
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <FormGroup sx={{ width: "100%", px: 0, pb: 0, pt: 1 }}>
        <TextField
          id={ETodoForm.NAME}
          label="Name"
          variant="outlined"
          error={!!errors[ETodoForm.NAME]}
          helperText={
            errors[ETodoForm.NAME] ? todosForm.helperText.nameRequired : ""
          }
          {...register(ETodoForm.NAME, { required: true })}
          defaultValue={todo?.name}
          margin="normal"
          fullWidth
          sx={{ mt: 0, mb: 4 }}
          inputRef={titleRef}
        />
        {children}
      </FormGroup>
    </form>
  );
};
