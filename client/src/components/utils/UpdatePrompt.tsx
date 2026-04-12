import { useRegisterSW } from "virtual:pwa-register/react";
import { Button, Snackbar, SnackbarContent } from "@mui/material";
import { text } from "../../localization/eng";

export const UpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const handleReload = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
  };

  return (
    <Snackbar
      open={needRefresh}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <SnackbarContent
        message={text.updatePrompt.message}
        action={
          <>
            <Button size="small" color="inherit" onClick={handleReload}>
              {text.updatePrompt.reload}
            </Button>
            <Button size="small" color="inherit" onClick={handleDismiss}>
              {text.updatePrompt.dismiss}
            </Button>
          </>
        }
      />
    </Snackbar>
  );
};
