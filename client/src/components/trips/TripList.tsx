import { List, ListItem } from "@mui/material";
import { useReorderTripsMutation } from "../../store/reducers/api/apiSlice";
import { FC, useEffect, useState } from "react";
import { ITrip } from "../../models/interface/ITrip";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { reordersHelper } from "../../store/reducers/utils/reorderHelper";
import { TripItem } from "./TripItem";

interface TripListProps {
  trips: ITrip[];
}

export const TripList: FC<TripListProps> = ({ trips }) => {
  const [reorderTrips, {}] = useReorderTripsMutation();
  const [tripsState, setTrips] = useState<ITrip[]>(trips);

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
    setTrips(trips);
  }, [trips]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="trip-list">
        {(provided) => (
          <List
            dense
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ pt: 1 }}
          >
            {tripsState.map((trip, index) => (
              <Draggable key={trip._id} draggableId={trip._id} index={index}>
                {(provided) => (
                  <ListItem
                    ref={provided.innerRef}
                    sx={{ width: "100%", px: 0 }}
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
  );
};
