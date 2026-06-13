import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
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
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  password: string;
}

export const ProfilePage = () => {
  const {
    data: currentUserResponse,
    isLoading: isLoadingCurrentUser,
    error: currentUserError,
    isFetching: isFetchingCurrentUser,
  } = useGetCurrentUserQuery();
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

  const user = currentUserResponse?.user;
  const initials =
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .map((n) => n![0].toUpperCase())
      .join("") ||
    user?.username?.[0]?.toUpperCase() ||
    "?";

  return (
    <RtkQueryWrapper
      isLoading={isLoadingCurrentUser}
      error={currentUserError}
      isFetching={isFetchingCurrentUser}
      texts={{
        loading: profileText.loading,
        createMessage: profileText.edit,
        noData: profileText.noData,
        fetchError: profileText.fetchError,
      }}
    >
      <Box sx={{ maxWidth: 480, mx: "auto", mt: 2 }}>
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

        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            p: 3,
            boxShadow: 1,
          }}
        >
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                fontSize: "1.5rem",
                bgcolor: "primary.main",
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="h2" fontWeight={700}>
              {user?.username ? `@${user.username}` : "—"}
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {!isEditMode ? (
            <Stack spacing={2}>
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {profileText.firstName}
                </Typography>
                <Typography variant="body1">
                  {user?.firstName || "—"}
                </Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  {profileText.lastName}
                </Typography>
                <Typography variant="body1">{user?.lastName || "—"}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}>
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
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={1}
                  sx={{ pt: 1 }}
                >
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
      </Box>
    </RtkQueryWrapper>
  );
};
