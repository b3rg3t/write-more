import { useParams } from "react-router-dom";
import { useGetNoteQuery } from "../../store/reducers/api/noteApiSlice";
import { NoteItem } from "./NoteItem";
import { Container } from "@mui/material";
import { text } from "../../localization/eng";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";

export const NoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    isLoading,
    error,
    isUninitialized,
  } = useGetNoteQuery(id!);

  return (
    <RtkQueryWrapper
      isLoading={isLoading || isUninitialized}
      data={note ? [note] : []}
      error={error}
      texts={{
        loading: text.notes.noteDetail.loading,
        createMessage: "",
        noData: text.notes.noteDetail.notFound,
        fetchError: text.notes.noteDetail.notFound,
      }}
    >
      <Container maxWidth="md" sx={{ px: 0, py: 2 }}>
        <NoteItem note={note!} />
      </Container>
    </RtkQueryWrapper>
  );
};
