import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  cancelTrip,
  selectIsEditing,
  selectIsNew,
} from "../../store/reducers/trips/tripsSlice";
import { useGetAllTripsQuery } from "../../store/reducers/api/tripApiSlice";
import { TripForm } from "../trips/TripForm";
import { text } from "../../localization/eng";

export const TripFormModal = () => {
  const isNew = useAppSelector(selectIsNew);
  const isEditing = useAppSelector(selectIsEditing);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { trip } = useGetAllTripsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      trip: isEditing
        ? data?.find((trip) => trip._id === isEditing)
        : undefined,
    }),
  });

  const onClose = () => {
    dispatch(cancelTrip());
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
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 } }}>
        <TripForm trip={trip}>
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
