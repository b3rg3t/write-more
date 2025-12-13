import { NoteItem } from "./NoteItem";
import List from "@mui/material/List";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { reorderNotesHelper } from "../../store/reducers/notes/reorderNotes";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  ListItem,
  Typography,
} from "@mui/material";
import {
  useGetAllNotesQuery,
  useReorderNotesMutation,
} from "../../store/reducers/api/apiSlice";
import { INote } from "../../models/interface/INote";
import { useEffect, useState, useMemo } from "react";
import { text } from "../../localization/eng";
import { useAppDispatch } from "../../store/redux/hooks";
import { createNewNote } from "../../store/reducers/notes/notesSlice";

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

    console.log("Reordered notes:", reordered);
    handleReorderNotes(reordered);
    setNotes(reordered);
  };

  const { loading, createNote, noNotes, fetchError } = text.notes.notesList;

  if (isLoading || isUninitialized || isFetching) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {loading}
          </Typography>
        </Container>
      </Container>
    );
  } else if (error) {
    return <Alert severity="error">{fetchError}</Alert>;
  } else if (data?.length === 0) {
    return (
      <Alert
        severity="info"
        action={
          <Button onClick={() => dispatch(createNewNote())}>
            {createNote}
          </Button>
        }
      >
        {noNotes}
      </Alert>
    );
  }
  return (
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
  );
};
