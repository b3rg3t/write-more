import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckIcon from "@mui/icons-material/Check";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useAddUserToTripMutation,
  useGetAllUsersQuery,
  useGetTripQuery,
} from "../../store/reducers/api/apiSlice";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  cancelAddUserToTrip,
  selectIsAddingUser,
} from "../../store/reducers/trips/tripUsersSlice";
import { text } from "../../localization/eng";

export const AddUserToTripModal = () => {
  const dispatch = useAppDispatch();
  const tripId = useAppSelector(selectIsAddingUser);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const trip = useGetTripQuery(tripId ?? skipToken);
  const { data: users, isLoading, error } = useGetAllUsersQuery();
  const [addUser] = useAddUserToTripMutation();

  const onClose = () => dispatch(cancelAddUserToTrip());

  const handleAdd = (userId: string) => {
    if (!tripId) return;
    addUser({ tripId, userId });
  };

  const existingUserIds = new Set(
    (trip.data?.users ?? []).map((u) => (typeof u === "string" ? u : u._id)),
  );

  const { title, loading, noUsers, fetchError } = text.trips.addUser;

  return (
    <Dialog
      open={!!tripId}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      transitionDuration={0}
      aria-labelledby="add-user-dialog-title"
    >
      <DialogTitle
        id="add-user-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1, sm: 3 },
          py: { xs: 1, sm: 2 },
        }}
      >
        {title}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 } }}>
        {isLoading && (
          <Stack alignItems="center" py={2} spacing={1}>
            <CircularProgress size={24} />
            <Typography variant="body2">{loading}</Typography>
          </Stack>
        )}
        {error && <Typography color="error">{fetchError}</Typography>}
        {!isLoading && !error && users?.length === 0 && (
          <Typography>{noUsers}</Typography>
        )}
        {!isLoading && !error && users && users.length > 0 && (
          <List dense disablePadding>
            {users.map((user) => {
              const isAlreadyMember = existingUserIds.has(user._id);
              const displayName =
                user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : undefined;
              return (
                <ListItem
                  key={user._id}
                  divider
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color={isAlreadyMember ? "success" : "primary"}
                      disabled={isAlreadyMember}
                      onClick={() => handleAdd(user._id)}
                      aria-label={`add ${user.username}`}
                      size="small"
                    >
                      {isAlreadyMember ? <CheckIcon /> : <PersonAddIcon />}
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`@${user.username}`}
                    secondary={displayName}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};
