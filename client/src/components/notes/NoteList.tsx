import { NoteItem } from "./NoteItem";
import List from "@mui/material/List";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { reorderNotesHelper } from "../../store/reducers/notes/reorderNotes";
import { ListItem } from "@mui/material";
import {
  useGetAllNotesQuery,
  useReorderNotesMutation,
} from "../../store/reducers/api/apiSlice";
import { INote } from "../../models/interface/INote";

export const NoteList = () => {
  const { data, isLoading, isFetching, isUninitialized } = useGetAllNotesQuery(
    undefined,
    {
      selectFromResult: ({ data, isLoading, isFetching, isUninitialized }) => ({
        data: data ? [...data].sort((a, b) => a.order - b.order) : [],
        isLoading,
        isFetching,
        isUninitialized,
      }),
    }
  );
  const [reorderNotes] = useReorderNotesMutation();

  const handleReorderNotes = async (notes: Pick<INote, "_id" | "order">[]) => {
    try {
      const response = await reorderNotes(notes);
      console.log("Reordered notes response:", response);
    } catch (error) {
      console.error("Error reordering notes:", error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = reorderNotesHelper(
      data!,
      result.source.index,
      result.destination.index
    );

    handleReorderNotes(reordered);
  };

  if (isLoading || isFetching || isUninitialized) {
    return <div>Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="note-list">
        {(provided) => (
          <List dense ref={provided.innerRef} {...provided.droppableProps}>
            {data!.map((note, index) => (
              <Draggable key={note._id} draggableId={note._id} index={index}>
                {(provided) => (
                  <ListItem
                    ref={provided.innerRef}
                    sx={{ width: "100%" }}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <NoteItem note={note} />
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
