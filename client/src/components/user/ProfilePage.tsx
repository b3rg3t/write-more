import {
  Alert,
  Box,
  Button,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { text } from "../../localization/eng";
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from "../../store/reducers/api/apiSlice";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  password: string;
}

export const ProfilePage = () => {
  const { data: currentUserResponse, isLoading: isLoadingCurrentUser } =
    useGetCurrentUserQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  useEffect(() => {
    if (currentUserResponse?.user) {
      reset({
        firstName: currentUserResponse.user.firstName || "",
        lastName: currentUserResponse.user.lastName || "",
        password: "",
      });
    }
  }, [currentUserResponse, reset]);

  const onSubmit = async (values: ProfileFormData) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      await updateProfile({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        password: values.password.trim() || undefined,
      }).unwrap();

      setSuccessMessage(text.user.profile.success);
      reset({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        password: "",
      });
      setIsEditMode(false);
    } catch (error: any) {
      setErrorMessage(error?.data?.message || text.user.profile.error);
    }
  };

  const handleStartEdit = () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (currentUserResponse?.user) {
      reset({
        firstName: currentUserResponse.user.firstName || "",
        lastName: currentUserResponse.user.lastName || "",
        password: "",
      });
    }
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    if (currentUserResponse?.user) {
      reset({
        firstName: currentUserResponse.user.firstName || "",
        lastName: currentUserResponse.user.lastName || "",
        password: "",
      });
    }
    setErrorMessage("");
    setIsEditMode(false);
  };

  const profileText = text.user.profile;

  return (
    <Box sx={{ maxWidth: 520, mx: "auto", mt: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {profileText.title}
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {!isEditMode ? (
        <Stack spacing={1.5}>
          <Typography variant="body1">
            <strong>{profileText.username}:</strong>{" "}
            {currentUserResponse?.user?.username || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>{profileText.firstName}:</strong>{" "}
            {currentUserResponse?.user?.firstName || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>{profileText.lastName}:</strong>{" "}
            {currentUserResponse?.user?.lastName || "-"}
          </Typography>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              type="button"
              variant="contained"
              onClick={handleStartEdit}
              disabled={isLoadingCurrentUser}
            >
              {profileText.edit}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup sx={{ width: "100%", gap: 2 }}>
            <TextField
              label={profileText.firstName}
              fullWidth
              disabled={isLoadingCurrentUser || isSaving}
              {...register("firstName")}
            />

            <TextField
              label={profileText.lastName}
              fullWidth
              disabled={isLoadingCurrentUser || isSaving}
              {...register("lastName")}
            />

            <TextField
              label={profileText.password}
              type="password"
              fullWidth
              disabled={isLoadingCurrentUser || isSaving}
              helperText={
                errors.password ? profileText.helperText.passwordMin : ""
              }
              {...register("password", {
                validate: (value) =>
                  !value ||
                  value.length >= 6 ||
                  profileText.helperText.passwordMin,
              })}
            />

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                {profileText.cancelEdit}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoadingCurrentUser || isSaving}
              >
                {isSaving ? profileText.saving : profileText.submit}
              </Button>
            </Stack>
          </FormGroup>
        </form>
      )}
    </Box>
  );
};
