import { NoteItem } from "./NoteItem";
import List from "@mui/material/List";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { reordersHelper } from "../../store/reducers/utils/reorderHelper";
import { ListItem, TypographyVariant } from "@mui/material";
import { INote } from "../../models/interface/INote";
import { useEffect, useState, FC } from "react";
import {
  useReorderNotesMutation,
  useUpdateTripMutation,
} from "../../store/reducers/api/apiSlice";
import { ITrip } from "../../models/interface/ITrip";

interface NoteListProps {
  notes: INote[];
  headingLevel?: TypographyVariant;
  trip?: ITrip;
}

export const NoteList: FC<NoteListProps> = ({ notes, headingLevel, trip }) => {
  const [reorderNotes, {}] = useReorderNotesMutation();
  const [updateTrip, {}] = useUpdateTripMutation();
  const [notesState, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    setNotes(notes);
  }, [notes]);

  const handleReorderNotes = async (updatedNotes: INote[]) => {
    if (!!trip) {
      try {
        const response = await updateTrip({
          ...trip,
          notes: updatedNotes.map((n) => n._id) || [],
          todos:
            trip?.todos?.map((t) => (typeof t === "string" ? t : t._id)) || [],
        });
        console.log("Reordered todos response:", response);
      } catch (error) {
        console.error("Error reordering todos:", error);
      }
    } else {
      try {
        const response = await reorderNotes(notes);
        console.log("Reordered notes response:", response);
      } catch (error) {
        console.error("Error reordering notes:", error);
      }
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = reordersHelper(
      notes,
      result.source.index,
      result.destination.index
    );
    handleReorderNotes(reordered);
    setNotes(reordered);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="note-list">
        {(provided) => (
          <List dense ref={provided.innerRef} {...provided.droppableProps}>
            {notesState.map((note, index) => (
              <Draggable key={note._id} draggableId={note._id} index={index}>
                {(provided) => (
                  <ListItem
                    ref={provided.innerRef}
                    sx={{ width: "100%", px: 0 }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <NoteItem note={note} headingLevel={headingLevel} />
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
