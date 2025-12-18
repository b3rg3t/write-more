import { useParams } from "react-router-dom";
import { useGetTripQuery } from "../../store/reducers/api/tripApiSlice";
import { TripItem } from "./TripItem";
import { Container } from "@mui/material";
import { text } from "../../localization/eng";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";

export const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: trip,
    isLoading,
    error,
    isUninitialized,
    isFetching,
  } = useGetTripQuery(id!);

  return (
    <RtkQueryWrapper
      isLoading={isLoading || isUninitialized || isFetching}
      data={trip ? [trip] : []}
      error={error}
      texts={{
        loading: text.trips.tripDetail.loading,
        createMessage: "",
        noData: text.trips.tripDetail.notFound,
        fetchError: text.trips.tripDetail.notFound,
      }}
    >
      <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
        <TripItem trip={trip!} />
      </Container>
    </RtkQueryWrapper>
  );
};
