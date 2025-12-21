import {
  Button,
  FormGroup,
  TextField,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useSignupMutation } from "../../store/reducers/api/apiSlice";
import { text } from "../../localization/eng";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToSignin?: () => void;
}

export const SignupForm: FC<SignupFormProps> = ({
  onSuccess,
  onSwitchToSignin,
}) => {
  const [signup, { isLoading }] = useSignupMutation();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SignupFormData>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setErrorMessage("");
      const response = await signup(data).unwrap();

      // Store token in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      console.log("Signup successful:", response);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrorMessage(error?.data?.message || text.user.signup.error);
    }
  };

  const { signup: signupText } = text.user;

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {signupText.title}
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup sx={{ width: "100%", gap: 2 }}>
          <TextField
            label={signupText.username}
            variant="outlined"
            fullWidth
            error={!!errors.username}
            helperText={
              errors.username ? signupText.helperText.usernameRequired : ""
            }
            {...register("username", { required: true })}
          />

          <TextField
            label={signupText.email}
            type="email"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email ? signupText.helperText.emailRequired : ""}
            {...register("email", { required: true })}
          />

          <TextField
            label={signupText.password}
            type="password"
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={
              errors.password ? signupText.helperText.passwordRequired : ""
            }
            {...register("password", { required: true, minLength: 6 })}
          />

          <TextField
            label={signupText.firstName}
            variant="outlined"
            fullWidth
            {...register("firstName")}
          />

          <TextField
            label={signupText.lastName}
            variant="outlined"
            fullWidth
            {...register("lastName")}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? signupText.submitting : signupText.submit}
          </Button>

          {onSwitchToSignin && (
            <Button variant="text" onClick={onSwitchToSignin} fullWidth>
              {signupText.switchToSignin}
            </Button>
          )}
        </FormGroup>
      </form>
    </Box>
  );
};
