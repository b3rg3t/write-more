import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { TNote } from "../../models/type/TNote";
import { TBasicNote } from "../../models/type/TBasicNote";
import { ENoteForm } from "../../models/enum/ENoteForm";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { text } from "../../localization/eng";
import { useAppDispatch } from "../../store/redux/hooks";
import { stopEditNote } from "../../store/reducers/notes/notesSlice";

export const NoteForm: FC<{ note: TNote }> = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<TBasicNote>();
  const disspatch = useAppDispatch();

  const {
    notes: { notesForm },
  } = text;

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const onCancel = () => {
    reset();
    disspatch(stopEditNote());
  };

  return (
    <FormGroup onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        error={!!errors[ENoteForm["NAME"]]}
        helperText={errors[ENoteForm["NAME"]] ? "Name is required" : ""}
        {...register(ENoteForm["NAME"], { required: true })}
      />
      <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="standard-basic" label="Standard" variant="standard" />
      <ButtonGroup aria-label="Form action button group">
        <Button type="submit">{notesForm.buttons.submit}</Button>
        <Button onClick={() => onCancel()}>{notesForm.buttons.cancel}</Button>
      </ButtonGroup>
    </FormGroup>
  );
};
