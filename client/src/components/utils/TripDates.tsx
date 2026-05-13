import { FC } from "react";
import { ITrip } from "../../models/interface/ITrip";
import { Chip, Stack, StackProps } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { INote } from "../../models/interface/INote";

export const TripDates: FC<{
  startDate?: ITrip["startDate"] | INote["startDate"];
  endDate?: ITrip["endDate"] | INote["endDate"];
  onClick?: () => void;
  styles?: StackProps;
}> = ({ startDate, endDate, onClick, styles }) => {
  if (!startDate && !endDate) {
    return null;
  }
  return (
    (startDate || endDate) && (
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        mt={1}
        mb={0}
        onClick={onClick}
        sx={{ cursor: onClick ? "pointer" : undefined }}
        {...styles}
      >
        {startDate && (
          <Chip
            icon={<CalendarMonthIcon fontSize="small" />}
            label={`${new Date(startDate).toLocaleDateString()}`}
          />
        )}
        {startDate && endDate && <ArrowForwardIcon fontSize="small" />}
        {endDate && (
          <Chip
            icon={<CalendarMonthIcon fontSize="small" />}
            label={`${new Date(endDate).toLocaleDateString()}`}
          />
        )}
      </Stack>
    )
  );
};
