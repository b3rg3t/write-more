import { ButtonProps, Box, Fab } from "@mui/material";
import { FC } from "react";
import AddIcon from "@mui/icons-material/Add";

interface ActionProps extends Omit<ButtonProps, "onClick"> {
  onClick: () => void;
  text: string;
  centered?: boolean;
}

export const Action: FC<ActionProps> = ({ onClick }) => {
  return (
    <Box
      position="fixed"
      left={0}
      right={0}
      bottom={46}
      display="flex"
      justifyContent="center"
      zIndex={1300}
      sx={{ pointerEvents: "none" }}
    >
      <Fab
        size="medium"
        color="primary"
        aria-label="Add note"
        onClick={onClick}
        sx={{ pointerEvents: "auto" }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};
