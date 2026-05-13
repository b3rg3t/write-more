import { useParams } from "react-router-dom";
import { useGetTripQuery } from "../../store/reducers/api/apiSlice";
import {
  Card,
  Paper,
  Stack,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import { text } from "../../localization/eng";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { TripDates } from "../utils/TripDates";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "../../models/enum/ERoutes";
import { fontSize16 } from "../utils/FontSize";
import { useState, useEffect } from "react";
import { INote } from "../../models/interface/INote";

const getCalendarRows = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
  const lastDay = new Date(year, month + 1, 0);
  const endDay = (lastDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
  const firstDate = new Date(year, month, 1 - startDay);
  const lastDate = new Date(year, month + 1, 0);
  lastDate.setDate(lastDate.getDate() + (6 - endDay));

  const weeks: Array<Array<Date>> = [];
  const currentDate = new Date(firstDate);

  while (currentDate <= lastDate) {
    const week: Array<Date> = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
};

const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const getWeekMonday = (date: Date) => {
  const normalized = normalizeDate(date);
  const day = (normalized.getDay() + 6) % 7;
  normalized.setDate(normalized.getDate() - day);
  return normalized;
};

const getWeekNumber = (date: Date) => {
  const monday = getWeekMonday(date);
  const yearStart = new Date(monday.getFullYear(), 0, 4);
  const yearStartMonday = getWeekMonday(yearStart);
  const diff = monday.getTime() - yearStartMonday.getTime();
  return Math.round(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
};

const isDateInRange = (date: Date, start: Date, end: Date) =>
  date.getTime() >= start.getTime() && date.getTime() <= end.getTime();

const getNotesForDate = (date: Date, notes: INote[]) => {
  return notes.filter((note) => {
    if (!note.startDate || !note.endDate) return false;
    const start = normalizeDate(new Date(note.startDate));
    const end = normalizeDate(new Date(note.endDate));
    return isDateInRange(date, start, end);
  });
};

const noteColors = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Light Purple
  "#85C1E9", // Light Blue
  "#F8C471", // Orange
  "#82E0AA", // Light Green
];

export const TripCalendar = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const {
    data: trip,
    isLoading,
    error,
    isUninitialized,
    isFetching,
  } = useGetTripQuery(tripId!);

  const tripStart = trip?.startDate
    ? normalizeDate(new Date(trip.startDate))
    : null;
  const tripEnd = trip?.endDate ? normalizeDate(new Date(trip.endDate)) : null;

  const [currentMonth, setCurrentMonth] = useState(
    tripStart ? tripStart.getMonth() : new Date().getMonth(),
  );
  const [currentYear, setCurrentYear] = useState(
    tripStart ? tripStart.getFullYear() : new Date().getFullYear(),
  );

  useEffect(() => {
    if (trip?.startDate) {
      const startDate = new Date(trip.startDate);
      setCurrentMonth(startDate.getMonth());
      setCurrentYear(startDate.getFullYear());
    }
  }, [trip?.startDate]);

  const handleBackClick = () => {
    navigate(ERoutes.TRIP_DETAIL.replace(":tripId", tripId!));
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long" },
  );
  const calendarRows = getCalendarRows(currentYear, currentMonth);
  const weekDays = text.trips.tripCalendar.weekDays;

  const notesWithDates = trip?.notes.filter((note) => {
    if (!note.startDate || !note.endDate) return false;
    return note;
  });

  return (
    <RtkQueryWrapper
      isLoading={isLoading || isUninitialized}
      isFetching={isFetching}
      error={error}
      texts={{
        loading: text.trips.tripCalendar.loading,
        createMessage: "",
        noData: "",
        fetchError: text.trips.tripCalendar.fetchError,
      }}
    >
      {trip && (
        <>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                color: "primary.main",
              }}
              onClick={handleBackClick}
            >
              <ArrowBackIcon />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {text.trips.tripCalendar.backToTrip}
              </Typography>
            </Box>

            <Card>
              <Stack sx={{ p: 2 }} spacing={2}>
                <Typography variant="h1" fontSize={fontSize16}>
                  {trip.title}
                </Typography>
                <TripDates startDate={trip.startDate} endDate={trip.endDate} />
              </Stack>
            </Card>
          </Stack>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, mt: 2, pb: 2, overflowX: "auto" }}
          >
            <Stack sx={{ px: { xs: 1, sm: 2 } }}>
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="h2"
                  fontSize={fontSize16}
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  {text.trips.tripCalendar.title}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                  px: { xs: 1, sm: 2 },
                }}
              >
                <IconButton
                  onClick={handlePrevMonth}
                  size="small"
                  sx={{
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "text.secondary",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 600,
                  }}
                >
                  {monthName} {currentYear}
                </Typography>
                <IconButton
                  onClick={handleNextMonth}
                  size="small"
                  sx={{
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </Stack>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      py: { xs: 0.25, sm: 0.5 },
                      px: { xs: 0.25, sm: 0.5 },
                      fontWeight: 700,
                      width: 10,
                      minWidth: { xs: 32, sm: 40, md: 60 },
                      fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.875rem" },
                    }}
                  >
                    {text.trips.tripCalendar.weekLabel}
                  </TableCell>
                  {weekDays.map((day) => (
                    <TableCell
                      key={day}
                      align="center"
                      sx={{
                        py: { xs: 0.25, sm: 0.5 },
                        px: { xs: 0.25, sm: 0.5 },
                        fontWeight: 700,

                        fontSize: {
                          xs: "0.7rem",
                          sm: "0.75rem",
                          md: "0.875rem",
                        },
                        minWidth: { xs: 32, sm: 40 },
                      }}
                    >
                      {day}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {calendarRows.map((week, rowIndex) => {
                  const weekNumber = getWeekNumber(week[0]);
                  return (
                    <TableRow key={`week-${rowIndex}`}>
                      <TableCell
                        align="center"
                        sx={{
                          py: { xs: 0.25, sm: 0.5 },
                          px: { xs: 0.25, sm: 0.5 },
                          fontWeight: 700,
                          border: "1px solid lightgray",
                          width: { xs: 32, sm: 40, md: 60 },
                          minWidth: { xs: 32, sm: 40, md: 60 },
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.75rem",
                            md: "0.875rem",
                          },
                        }}
                      >
                        {weekNumber}
                      </TableCell>
                      {week.map((dayDate, cellIndex) => {
                        const day =
                          dayDate.getMonth() === currentMonth
                            ? dayDate.getDate()
                            : null;
                        const normalizedDayDate = normalizeDate(dayDate);
                        const isSelected = Boolean(
                          day &&
                          tripStart &&
                          tripEnd &&
                          isDateInRange(normalizedDayDate, tripStart, tripEnd),
                        );

                        return (
                          <TableCell
                            key={`cell-${rowIndex}-${cellIndex}`}
                            align="center"
                            sx={{
                              height: { xs: 36, sm: 42, md: 56, lg: 68 },
                              border: "1px solid #d3d3d3",
                              backgroundColor: isSelected
                                ? "primary.light"
                                : "inherit",
                              color: isSelected
                                ? "primary.contrastText"
                                : "text.primary",
                              py: { xs: 0.25, sm: 0.5 },
                              px: { xs: 0.25, sm: 0.5 },
                              minWidth: { xs: 32, sm: 40 },
                            }}
                          >
                            {day ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 0.25,
                                  height: "100%",
                                  justifyContent:
                                    trip?.notes &&
                                    getNotesForDate(
                                      normalizedDayDate,
                                      trip.notes,
                                    ).length > 0
                                      ? "flex-start"
                                      : "center",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: { xs: 20, sm: 24, md: 28, lg: 32 },
                                    height: { xs: 20, sm: 24, md: 28, lg: 32 },
                                    mx: "auto",
                                    borderRadius: "50%",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: isSelected ? 700 : 500,
                                    fontSize: {
                                      xs: "0.75rem",
                                      sm: "0.875rem",
                                      md: "1rem",
                                    },
                                  }}
                                >
                                  {day}
                                </Box>
                                {trip?.notes && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 0.5,
                                      width: "100%",
                                      alignItems: "stretch",
                                    }}
                                  >
                                    {getNotesForDate(
                                      normalizedDayDate,
                                      trip.notes,
                                    )
                                      .slice(0, 4) // Limit to 4 indicators to prevent overflow
                                      .map((note, noteIndex) => {
                                        const bgColor =
                                          notesWithDates?.findIndex(
                                            (n) => n._id === note._id,
                                          );
                                        if (bgColor === undefined) return null;
                                        return (
                                          <Box
                                            key={note._id || noteIndex}
                                            sx={{
                                              width: "100%",
                                              height: 2,
                                              backgroundColor:
                                                noteColors[
                                                  bgColor % noteColors.length
                                                ],
                                              flexShrink: 0,
                                            }}
                                            title={note.title}
                                          />
                                        );
                                      })}
                                  </Box>
                                )}
                              </Box>
                            ) : null}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {notesWithDates && notesWithDates.length > 0 && (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "start",
                  mt: 2,
                }}
              >
                <Stack sx={{ px: { xs: 1, sm: 2 } }} spacing={1}>
                  {notesWithDates.map((note, noteIndex) => (
                    <Stack
                      key={note._id}
                      sx={{ alignItems: "center", gap: 0.5 }}
                      direction="row"
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          backgroundColor:
                            noteColors[noteIndex % noteColors.length],
                          display: "inline-block",
                          borderRadius: "50%",
                          mr: 1,
                        }}
                      />
                      <Typography>{note.title}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}
          </TableContainer>
        </>
      )}
    </RtkQueryWrapper>
  );
};
