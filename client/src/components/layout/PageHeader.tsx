import { Chip, Stack, Typography } from "@mui/material";
import { fontSize16 } from "../utils/FontSize";
import { FC } from "react";

export const PageHeader: FC<{
  title: string;
  subtitle?: string;
  amount?: number;
}> = ({ title, subtitle, amount = 0 }) => {
  return (
    <Stack
      direction="row"
      justifyContent={"space-between"}
      alignItems={"end"}
      spacing={0.5}
    >
      <Stack spacing={0.5}>
        <Typography
          variant="h2"
          fontSize={fontSize16}
          fontWeight="bold"
          sx={{ px: 1 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="subtitle1"
            fontSize={fontSize16}
            color="text.secondary"
            sx={{ px: 2 }}
          >
            {subtitle}
          </Typography>
        )}
      </Stack>
      <Chip size="small" color="primary" variant="outlined" label={amount} />
    </Stack>
  );
};
