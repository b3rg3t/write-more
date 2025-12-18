import { useParams } from "react-router-dom";
import { useGetTripQuery } from "../../store/reducers/api/tripApiSlice";
import { TripItem } from "./TripItem";
import { Container, Typography } from "@mui/material";

export const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: trip, isLoading, error } = useGetTripQuery(id!);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error || !trip) {
    return <Typography>Trip not found</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <TripItem trip={trip} />
    </Container>
  );
};
