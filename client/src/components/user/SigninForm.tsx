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
import { useSigninMutation } from "../../store/reducers/api/apiSlice";
import { text } from "../../localization/eng";

interface SigninFormData {
  email: string;
  password: string;
}

interface SigninFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export const SigninForm: FC<SigninFormProps> = ({
  onSuccess,
  onSwitchToSignup,
}) => {
  const [signin, { isLoading }] = useSigninMutation();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SigninFormData>({
    mode: "onSubmit",
  });

  const onSubmit = async (data: SigninFormData) => {
    try {
      setErrorMessage("");
      const response = await signin(data).unwrap();

      // Store token in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      console.log("Signin successful:", response);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Signin error:", error);
      setErrorMessage(error?.data?.message || text.user.signin.error);
    }
  };

  const { signin: signinText } = text.user;

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {signinText.title}
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup sx={{ width: "100%", gap: 2 }}>
          <TextField
            label={signinText.email}
            type="email"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email ? signinText.helperText.emailRequired : ""}
            {...register("email", { required: true })}
          />

          <TextField
            label={signinText.password}
            type="password"
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={
              errors.password ? signinText.helperText.passwordRequired : ""
            }
            {...register("password", { required: true })}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? signinText.submitting : signinText.submit}
          </Button>

          {onSwitchToSignup && (
            <Button variant="text" onClick={onSwitchToSignup} fullWidth>
              {signinText.switchToSignup}
            </Button>
          )}
        </FormGroup>
      </form>
    </Box>
  );
};
