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
          {trip && (
            <IconButton
              color="error"
              edge="end"
              aria-label="delete"
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
      <DialogContent sx={{ px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 } }}>
        <TripForm trip={trip.data}>
          <DialogActions sx={{ p: 0 }}>
            <Button onClick={onClose} color="inherit">
              {buttons.cancel}
            </Button>
            <Button type="submit" variant="contained">
              {buttons.submit}
            </Button>
          </DialogActions>
        </TripForm>
      </DialogContent>
    </Dialog>
  );
};
