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
} from "../../store/reducers/api/noteApiSlice";
import { INote } from "../../models/interface/INote";
import { useEffect, useState, useMemo } from "react";
import { text } from "../../localization/eng";
import { useAppDispatch } from "../../store/redux/hooks";
import { createNewNote } from "../../store/reducers/notes/notesSlice";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";

export const NoteList = () => {
  const { data, isLoading, isUninitialized, isFetching, error } =
    useGetAllNotesQuery();
  const dispatch = useAppDispatch();
  const sortedData = useMemo(() => {
    return data ? [...data].sort((a, b) => a.order - b.order) : [];
  }, [data]);
  const [notes, setNotes] = useState<INote[]>([]);
  const [reorderNotes, {}] = useReorderNotesMutation();

  useEffect(() => {
    setNotes(sortedData);
  }, [sortedData]);

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
      notes,
      result.source.index,
      result.destination.index
    );
    handleReorderNotes(reordered);
    setNotes(reordered);
  };

  const { loading, createNote, noNotes, fetchError } = text.notes.notesList;

  return (
    <RtkQueryWrapper
      isLoading={isLoading || isUninitialized}
      data={data}
      error={error}
      isFetching={isFetching}
      texts={{
        loading,
        createMessage: createNote,
        noData: noNotes,
        fetchError,
      }}
      onCreate={() => dispatch(createNewNote())}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="note-list">
          {(provided) => (
            <List dense ref={provided.innerRef} {...provided.droppableProps}>
              {notes.map((note, index) => (
                <Draggable key={note._id} draggableId={note._id} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      sx={{ width: "100%", px: 1 }}
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
    </RtkQueryWrapper>
  );
};
