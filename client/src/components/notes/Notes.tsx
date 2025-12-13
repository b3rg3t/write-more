import Container from "@mui/material/Container";
import { Actions } from "../settings/Actions";
import { NoteList } from "./NoteList";
import { text } from "../../localization/eng";
import Typography from "@mui/material/Typography";
import { fontSize16 } from "../utils/FontSize";
import { DeleteNoteModal } from "../modal/DeleteNoteModal";
import { NoteFormModal } from "../modal/NoteFormModal";

export const Notes = () => (
  <>
    <DeleteNoteModal />
    <NoteFormModal />
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <Container sx={{ px: 2 }}>
        <Typography variant="h1" fontSize={fontSize16} fontWeight="bold">
          {text.appName}
        </Typography>
      </Container>
      <NoteList />
      <Actions />
    </Container>
  </>
);
