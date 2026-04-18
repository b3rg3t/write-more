import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { fontSize16 } from "../utils/FontSize";

type TripSectionAccordionProps = {
  title: string;
  count: number;
  badgeColor: "info" | "secondary";
  children: ReactNode;
  addAction?: {
    ariaLabel: string;
    color: "info" | "secondary";
    icon: ReactNode;
    onClick: () => void;
  };
};

export const TripSectionAccordion = ({
  title,
  count,
  badgeColor,
  children,
  addAction,
}: TripSectionAccordionProps) => {
  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h3" fontSize={fontSize16} fontWeight="bold">
              {title}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: 999,
                backgroundColor: `${badgeColor}.light`,
                color: `${badgeColor}.contrastText`,
                fontWeight: 700,
                lineHeight: 1.5,
                minWidth: 24,
                textAlign: "center",
              }}
            >
              {count}
            </Typography>
          </Stack>
          {addAction ? (
            <IconButton
              color={addAction.color}
              edge="end"
              aria-label={addAction.ariaLabel}
              onClick={(e) => {
                e.stopPropagation();
                addAction.onClick();
              }}
              sx={{ mr: 0.5 }}
            >
              {addAction.icon}
            </IconButton>
          ) : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0, px: { xs: 0.5, sm: 1 } }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
