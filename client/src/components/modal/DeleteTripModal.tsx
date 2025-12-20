import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { text } from "../../localization/eng";
import {
  useDeleteTripMutation,
  useGetAllTripsQuery,
} from "../../store/reducers/api/apiSlice";
import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
import {
  deleteTrip,
  selectIsDeleting,
} from "../../store/reducers/trips/tripsSlice";

export const DeleteTripModal = () => {
  const isDeleting = useAppSelector(selectIsDeleting);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { trip } = useGetAllTripsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      trip: isDeleting
        ? data?.find((trip) => trip._id === isDeleting)
        : undefined,
    }),
  });
  const [deleteTripApi] = useDeleteTripMutation();

  const onClose = () => {
    dispatch(deleteTrip(undefined));
  };
  const handleConfirm = async () => {
    if (trip) {
      try {
        const payload = await deleteTripApi({ _id: trip._id }).unwrap();
        console.log("fulfilled", payload);
        dispatch(deleteTrip(undefined));
      } catch (error) {
        console.error("rejected", error);
      }
    }
  };

  const open = !!isDeleting;

  const { title, titleUnknown, confirmation, buttons } =
    text.trips.deleteTrip || text.notes.deleteNote; // Assuming similar structure

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      transitionDuration={0}
      aria-labelledby="delete-trip-dialog-title"
      aria-describedby="delete-trip-dialog-description"
    >
      <DialogTitle
        id="delete-trip-dialog-title"
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
        <DialogContentText id="delete-trip-dialog-description" sx={{ mb: 2 }}>
          {confirmation.replace("{title}", trip?.title || titleUnknown)}
        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {buttons.cancel}
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            {buttons.confirm}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
