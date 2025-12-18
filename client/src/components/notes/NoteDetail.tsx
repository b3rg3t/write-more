import { useParams } from "react-router-dom";
import { useGetAllNotesQuery } from "../../store/reducers/api/noteApiSlice";
import { NoteItem } from "./NoteItem";
import { Container, Typography } from "@mui/material";

export const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: notes } = useGetAllNotesQuery();

  const note = notes?.find((n) => n._id === id);

  if (!note) {
    return <Typography>Note not found</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <NoteItem note={note} />
    </Container>
  );
};
