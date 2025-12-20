import { TripList } from "./TripList";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { Action } from "../utils/Action";
import { createNewTrip } from "../../store/reducers/trips/tripsSlice";
import { text } from "../../localization/eng";
import { useAppDispatch } from "../../store/redux/hooks";
import { useMemo } from "react";
import { useGetAllTripsQuery } from "../../store/reducers/api/apiSlice";
import { PageHeader } from "../layout/PageHeader";

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
      <PageHeader title={header} amount={data ? data.length : 0} />
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
