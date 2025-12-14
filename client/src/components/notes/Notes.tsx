import Container from "@mui/material/Container";
import { Actions } from "../settings/Actions";
import { NoteList } from "./NoteList";
import { DeleteNoteModal } from "../modal/DeleteNoteModal";
import { NoteFormModal } from "../modal/NoteFormModal";

export const Notes = () => (
  <>
    <DeleteNoteModal />
    <NoteFormModal />
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <NoteList />
      <Actions />
    </Container>
  </>
);
