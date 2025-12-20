import { Typography } from "@mui/material";
import { TripList } from "./TripList";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { Action } from "../utils/Action";
import { createNewTrip } from "../../store/reducers/trips/tripsSlice";
import { text } from "../../localization/eng";
import { useAppDispatch } from "../../store/redux/hooks";
import { useMemo } from "react";
import { useGetAllTripsQuery } from "../../store/reducers/api/apiSlice";
import { fontSize16 } from "../utils/FontSize";

export const Trips = () => {
  const { data, isLoading, isUninitialized, isFetching, error } =
    useGetAllTripsQuery();
  const dispatch = useAppDispatch();
  const sortedTrips = useMemo(() => {
    return data ? [...data].sort((a, b) => a.order - b.order) : [];
  }, [data]);

  const { header } = text.trips;
  const { loading, createTrip, noTrips, fetchError } = text.trips.tripsList;
  return (
    <>
      <Typography
        variant="h2"
        fontSize={fontSize16}
        fontWeight="bold"
        sx={{ px: 2 }}
      >
        {header}
      </Typography>
      <RtkQueryWrapper
        isLoading={isLoading || isUninitialized}
        data={data}
        error={error}
        isFetching={isFetching}
        texts={{
          loading,
          createMessage: createTrip,
          noData: noTrips,
          fetchError,
        }}
        onCreate={() => dispatch(createNewTrip())}
      >
        <TripList trips={sortedTrips} />
        <Action
          onClick={() => dispatch(createNewTrip())}
          text={createTrip}
          variant="contained"
        />
      </RtkQueryWrapper>
    </>
  );
};
