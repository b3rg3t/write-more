import Container from "@mui/material/Container";
import { Actions } from "../settings/Actions";
import { NoteList } from "./NoteList";
import { text } from "../../localization/eng";
import Typography from "@mui/material/Typography";
import { EditNote } from "./EditNote";
import { fontSize16 } from "../utils/FontSize";

export const Notes = () => {
  return (
    <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
      <Container sx={{ px: 2 }}>
        <Typography variant="h1" fontSize={fontSize16} fontWeight="bold">
          {text.appName}
        </Typography>
      </Container>
      <EditNote />
      <NoteList />
      <Actions />
    </Container>
  );
};
