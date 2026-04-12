import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  cancelTrip,
  deleteTrip,
  selectIsEditing,
  selectIsNew,
} from "../../store/reducers/trips/tripsSlice";
import { useGetTripQuery } from "../../store/reducers/api/apiSlice";
import { TripForm } from "../trips/TripForm";
import { text } from "../../localization/eng";
import { skipToken } from "@reduxjs/toolkit/query";

export const TripFormModal = () => {
  const isNew = useAppSelector(selectIsNew);
  const isEditing = useAppSelector(selectIsEditing);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const trip = useGetTripQuery(isEditing ?? skipToken);

  const onClose = () => {
    dispatch(cancelTrip());
  };

  const handleDeleteTrip = async () => {
    if (trip.data) {
      dispatch(deleteTrip(trip.data._id));
    }
  };

  const isButtonDisabled = !!(
    trip.error ||
    (isEditing && (trip.isLoading || trip.isFetching || trip.isUninitialized))
  );

  const open = !!isNew || !!isEditing;

  const { titleNew, titleEdit, buttons } = text.trips.tripsForm;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      transitionDuration={0}
      aria-labelledby="trip-form-dialog-title"
    >
      <DialogTitle
        id="trip-form-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1, sm: 3 },
          py: { xs: 1, sm: 2 },
        }}
      >
        {isNew ? titleNew : titleEdit}
        <Stack direction="row" spacing={1}>
          {trip.data && (
            <IconButton
              color="error"
              edge="end"
              aria-label="delete"
              disabled={isButtonDisabled}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTrip();
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{ px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 }, overflow: "auto" }}
      >
        {trip.error ? (
          <Alert severity="error">Failed to load trip. Please try again.</Alert>
        ) : !isNew &&
          (trip.isLoading || trip.isFetching || trip.isUninitialized) ? (
          <Stack
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Stack>
        ) : (
          <TripForm trip={trip.data} formId="trip-form" />
        )}
      </DialogContent>
      <DialogActions
        disableSpacing
        sx={{
          flexDirection: isMobile ? "column-reverse" : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap: 1,
          px: { xs: 1, sm: 3 },
          py: { xs: 1, sm: 2 },
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Button onClick={onClose} color="inherit" fullWidth={isMobile}>
          {buttons.cancel}
        </Button>
        <Button
          type="submit"
          variant="contained"
          fullWidth={isMobile}
          form="trip-form"
          disabled={isButtonDisabled}
        >
          {buttons.submit}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
