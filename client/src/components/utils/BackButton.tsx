import { Box, SxProps, Theme, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FC } from "react";

interface BackButtonProps {
  label: string;
  onClick: () => void;
  sx?: SxProps<Theme>;
}

export const BackButton: FC<BackButtonProps> = ({ label, onClick, sx }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      cursor: "pointer",
      color: "primary.main",
      ...sx,
    }}
    onClick={onClick}
  >
    <ArrowBackIcon />
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {label}
    </Typography>
  </Box>
);
