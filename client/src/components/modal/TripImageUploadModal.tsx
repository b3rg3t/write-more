import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useUploadTripImageMutation } from "../../store/reducers/api/apiSlice";
import { text } from "../../localization/eng";

type TripImageUploadModalProps = {
  open: boolean;
  onClose: () => void;
  tripId: string;
};

export const TripImageUploadModal = ({
  open,
  onClose,
  tripId,
}: TripImageUploadModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [uploadTripImage, { isLoading }] = useUploadTripImageMutation();
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { title, helperText, buttons, errors } = text.trips.imageUpload;

  const handleClose = () => {
    setFile(null);
    setErrorMessage("");
    onClose();
  };

  const getUploadErrorMessage = (error: unknown): string => {
    if (typeof error !== "object" || !error || !("status" in error)) {
      return errors.uploadFailed;
    }

    const status = (error as { status?: unknown }).status;

    if (typeof status !== "number") {
      return errors.uploadFailed;
    }

    switch (status) {
      case 400:
        return errors.badRequest;
      case 401:
        return errors.unauthorized;
      case 403:
        return errors.forbidden;
      case 404:
        return errors.notFound;
      case 413:
        return errors.tooLarge;
      case 500:
        return errors.server;
      default:
        return errors.uploadFailed;
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setErrorMessage(errors.noFile);
      return;
    }

    try {
      setErrorMessage("");
      await uploadTripImage({ tripId, file }).unwrap();
      handleClose();
    } catch (err) {
      setErrorMessage(getUploadErrorMessage(err));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      aria-labelledby="trip-image-upload-dialog-title"
    >
      <DialogTitle
        id="trip-image-upload-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 1, sm: 3 },
          py: { xs: 1, sm: 2 },
        }}
      >
        {title}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 2 } }}>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {helperText}
          </Typography>

          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            {buttons.chooseFile}
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] || null;
                setErrorMessage("");
                setFile(selectedFile);
              }}
            />
          </Button>

          <Typography variant="body2" color="text.secondary">
            {file ? file.name : buttons.noFileSelected}
          </Typography>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
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
        <Button
          onClick={handleClose}
          color="inherit"
          disabled={isLoading}
          fullWidth={isMobile}
        >
          {buttons.cancel}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          fullWidth={isMobile}
        >
          {isLoading ? buttons.uploading : buttons.upload}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
