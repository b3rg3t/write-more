import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { fontSize16 } from "../utils/FontSize";

type TripSectionAccordionProps = {
  title: string;
  count: number | string;
  badgeColor: "info" | "secondary";
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children: ReactNode;
  headerExtra?: ReactNode;
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
  defaultExpanded = true,
  onExpandedChange,
  children,
  headerExtra,
  addAction,
}: TripSectionAccordionProps) => {
  const [expanded, setExpanded] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (expanded === undefined) {
      setExpanded(defaultExpanded);
    }
  }, [defaultExpanded]);

  const handleChange = (_e: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
    onExpandedChange?.(isExpanded);
  };

  return (
    <Accordion
      expanded={expanded ?? defaultExpanded}
      disableGutters
      onChange={handleChange}
    >
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
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {headerExtra ?? null}
            {addAction ? (
              <IconButton
                component="span"
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
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0, px: { xs: 0.5, sm: 1 } }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
