import { useAppSelector, useAppDispatch } from "../../store/redux/hooks";
import {
  selectAll,
  updateAllNotes,
  updateOneNote,
} from "../../store/reducers/notes/notesSlice";
import { NoteItem } from "./NoteItem";
import List from "@mui/material/List";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { reorderNotes } from "../../store/reducers/notes/reorderNotes";
import { ListItem } from "@mui/material";

export const NoteList = () => {
  const dispatch = useAppDispatch();
  const notes = useAppSelector(selectAll);
  const [items, setItems] = useState(notes);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = reorderNotes(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(reordered);
    // Prepare updates for all notes with new order
    reordered.forEach((note, idx) => {
      dispatch(
        updateOneNote({
          id: note.id,
          changes: { order: idx },
        })
      );
    });
  };

  useEffect(() => {
    setItems(notes);
  }, [notes]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="note-list">
        {(provided) => (
          <List dense ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((note, index) => (
              <Draggable key={note.id} draggableId={note.id} index={index}>
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
