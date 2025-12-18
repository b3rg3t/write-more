import { useParams } from "react-router-dom";
import { useGetTripQuery } from "../../store/reducers/api/tripApiSlice";
import { Card, Container, Divider, Stack, Typography } from "@mui/material";
import { text } from "../../localization/eng";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { TodoList } from "../todos/TodoList";
import { NoteList } from "../notes/NoteList";
import { fontSize16 } from "../utils/FontSize";

export const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: trip,
    isLoading,
    error,
    isUninitialized,
  } = useGetTripQuery(id!);

  return (
    <RtkQueryWrapper
      isLoading={isLoading || isUninitialized}
      data={trip ? [trip] : []}
      error={error}
      texts={{
        loading: text.trips.tripDetail.loading,
        createMessage: "",
        noData: text.trips.tripDetail.notFound,
        fetchError: text.trips.tripDetail.notFound,
      }}
    >
      <Container maxWidth="md" sx={{ px: 0 }}>
        <Stack direction="row" justifyContent="end" spacing={2} sx={{ px: 2 }}>
          <Typography fontSize={"small"}>
            {trip?.createdAt &&
              `Created at: ${new Date(trip.createdAt).toLocaleDateString()}`}
          </Typography>
        </Stack>
        <Container disableGutters sx={{ px: 1 }}>
          <Card
            variant="outlined"
            sx={{
              boxShadow: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              p: 2,
            }}
          >
            <Typography
              variant="h2"
              fontSize={fontSize16}
              sx={{ fontWeight: 600 }}
            >
              {trip?.title}
            </Typography>
            <Typography sx={{ mt: 1 }}>{trip?.description}</Typography>
          </Card>
        </Container>
        <Divider sx={{ my: 2 }} />
        <Typography
          variant="h3"
          fontSize={fontSize16}
          fontWeight="bold"
          sx={{ px: 2 }}
        >
          {text.todos.header}
        </Typography>
        <TodoList todos={trip?.todos ?? []} headingLevel="h3" />
        <Divider sx={{ my: 2 }} />
        <Typography
          variant="h3"
          fontSize={fontSize16}
          fontWeight="bold"
          sx={{ px: 2 }}
        >
          {text.notes.header}
        </Typography>
        <NoteList notes={trip?.notes ?? []} headingLevel="h3" />
      </Container>
    </RtkQueryWrapper>
  );
};
