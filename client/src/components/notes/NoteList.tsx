import { NoteItem } from "./NoteItem";
import List from "@mui/material/List";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { reordersHelper } from "../../store/reducers/utils/reorderHelper";
import { Container, ListItem, TypographyVariant } from "@mui/material";
import { useReorderNotesMutation } from "../../store/reducers/api/noteApiSlice";
import { INote } from "../../models/interface/INote";
import { useEffect, useState, FC } from "react";
import {
  useGetTripQuery,
  useUpdateTripMutation,
} from "../../store/reducers/api/tripApiSlice";
import { useParams } from "react-router-dom";
import { DeleteNoteModal } from "../modal/DeleteNoteModal";
import { NoteFormModal } from "../modal/NoteFormModal";

interface NoteListProps {
  notes: INote[];
  headingLevel?: TypographyVariant;
}

export const NoteList: FC<NoteListProps> = ({ notes, headingLevel }) => {
  const { id } = useParams<{ id: string }>();
  const [reorderNotes, {}] = useReorderNotesMutation();
  const [updateTrip, {}] = useUpdateTripMutation();
  const { data: trip } = useGetTripQuery(id || "");
  const [notesState, setNotes] = useState<INote[]>([]);

  useEffect(() => {
    setNotes(notes);
  }, [notes]);

  const handleReorderNotes = async (notes: INote[]) => {
    if (id) {
      try {
        const response = await updateTrip({
          ...trip,
          notes: notes.map((n) => n._id) || [],
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
    <>
      <DeleteNoteModal />
      <NoteFormModal />
      <Container disableGutters maxWidth="md" sx={{ px: 0 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="note-list">
            {(provided) => (
              <List dense ref={provided.innerRef} {...provided.droppableProps}>
                {notesState.map((note, index) => (
                  <Draggable
                    key={note._id}
                    draggableId={note._id}
                    index={index}
                  >
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        sx={{ width: "100%", px: 1 }}
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
      </Container>
    </>
  );
};
