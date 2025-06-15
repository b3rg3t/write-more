import Container from "@mui/material/Container";
import { Actions } from "../settings/Actions";
import { NoteList } from "./NoteList";
import { text } from "../../localization/eng";
import Typography from "@mui/material/Typography";
import { EditNote } from "./EditNote";

export const Notes = () => {
  return (
    <Container maxWidth="md" sx={{ padding: 2 }}>
      <Typography variant="h1" fontSize={16} fontWeight="bold">
        {text.appName}
      </Typography>
      <EditNote />
      <NoteList />
      <Actions />
    </Container>
  );
};
