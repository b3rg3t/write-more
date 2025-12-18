import { Button, Container, List, ListItem, Typography } from "@mui/material";
import { createNewTrip } from "../../store/reducers/trips/tripsSlice";
import { useAppDispatch } from "../../store/redux/hooks";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import {
  useGetAllTripsQuery,
  useReorderTripsMutation,
} from "../../store/reducers/api/tripApiSlice";
import { useEffect, useMemo, useState } from "react";
import { ITrip } from "../../models/interface/ITrip";
import { text } from "../../localization/eng";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { fontSize16 } from "../utils/FontSize";
import { reordersHelper } from "../../store/reducers/utils/reorderHelper";
import { TripItem } from "./TripItem";

export const TripList = () => {
  const { data, isLoading, isUninitialized, isFetching, error } =
    useGetAllTripsQuery();
  const dispatch = useAppDispatch();
  const sortedData = useMemo(() => {
    return data ? [...data].sort((a, b) => a.order - b.order) : [];
  }, [data]);
  const [reorderTrips, {}] = useReorderTripsMutation();
  const [trips, setTrips] = useState<ITrip[]>([]);

  const { header, loading, createTrip, noTrips, fetchError } =
    text.trips.tripsList;

  const handleReorderTrips = async (trips: Pick<ITrip, "_id" | "order">[]) => {
    try {
      const response = await reorderTrips(trips);
      console.log("Reordered trips response:", response);
    } catch (error) {
      console.error("Error reordering trips:", error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = reordersHelper(
      trips,
      result.source.index,
      result.destination.index
    );
    handleReorderTrips(reordered);
    setTrips(reordered);
  };

  useEffect(() => {
    setTrips(sortedData);
  }, [sortedData]);

  return (
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
      <Typography
        variant="h2"
        fontSize={fontSize16}
        fontWeight="bold"
        sx={{ px: 2 }}
      >
        {header}
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="trip-list">
          {(provided) => (
            <List
              dense
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ pt: 1 }}
            >
              {trips.map((trip, index) => (
                <Draggable key={trip._id} draggableId={trip._id} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      sx={{ width: "100%", px: 1, py: 0 }}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TripItem trip={trip} />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Container sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <Button variant="contained" onClick={() => dispatch(createNewTrip())}>
          {createTrip}
        </Button>
      </Container>
    </RtkQueryWrapper>
  );
};
