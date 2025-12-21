import { Button, FormGroup, TextField } from "@mui/material";
import { FC } from "react";

import { text } from "../../localization/eng";
import { useAddUserMutation } from "../../store/reducers/api/apiSlice";
import { useForm } from "react-hook-form";
import { TBasicUser } from "../../models/type/TBasicUser";
import { EUserForm } from "../../models/enum/EUserForm";

interface UserFormProps {
  children?: React.ReactNode;
}

export const UserForm: FC<UserFormProps> = ({}) => {
  const [addUser] = useAddUserMutation();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<TBasicUser>({
    mode: "onSubmit",
    defaultValues: {
      [EUserForm.USERNAME]: "",
      [EUserForm.EMAIL]: "",
      [EUserForm.PASSWORD]: "",
    },
  });

  const handlePostUser = async (data: TBasicUser) => {
    try {
      await addUser(data).unwrap();
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  const onSubmit = (data: TBasicUser) => {
    console.log("Form submitted");
    handlePostUser(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup sx={{ width: "100%", px: 0, pb: 0, pt: 1 }}>
        <TextField
          label={text.user.form.username}
          variant="outlined"
          id={EUserForm.USERNAME}
          autoFocus
          helperText={
            errors[EUserForm.USERNAME]
              ? text.user.form.helperText.usernameRequired
              : ""
          }
          {...register(EUserForm.USERNAME, { required: true })}
          fullWidth
        />
        <TextField
          label={text.user.form.email}
          id={EUserForm.EMAIL}
          type="email"
          helperText={
            errors[EUserForm.EMAIL]
              ? text.user.form.helperText.emailRequired
              : ""
          }
          {...register(EUserForm.EMAIL, { required: true })}
          fullWidth
        />
        <TextField
          label={text.user.form.password}
          id={EUserForm.PASSWORD}
          type="password"
          helperText={
            errors[EUserForm.PASSWORD]
              ? text.user.form.helperText.passwordRequired
              : ""
          }
          {...register(EUserForm.PASSWORD, { required: true })}
          fullWidth
        />
        <Button type="submit" variant="outlined" color="primary" sx={{ mt: 2 }}>
          {text.user.form.buttons.submit}
        </Button>
      </FormGroup>
    </form>
  );
};
