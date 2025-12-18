import { NoteList } from "./NoteList";
import { DeleteNoteModal } from "../modal/DeleteNoteModal";
import { NoteFormModal } from "../modal/NoteFormModal";
import { Container } from "@mui/material";

export const Notes = () => (
  <>
    <DeleteNoteModal />
    <NoteFormModal />
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <NoteList />
    </Container>
  </>
);
