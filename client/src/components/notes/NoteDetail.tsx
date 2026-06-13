import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGetNoteQuery } from "../../store/reducers/api/apiSlice";
import { NoteItem } from "./NoteItem";
import { Container } from "@mui/material";
import { text } from "../../localization/eng";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { BackButton } from "../utils/BackButton";
import { ERoutes } from "../../models/enum/ERoutes";

export const NoteDetail = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { tripId?: string; fromCalendar?: boolean } | null;
  const tripId = state?.tripId;
  const fromCalendar = state?.fromCalendar;
  const {
    data: note,
    isLoading,
    error,
    isUninitialized,
    isFetching,
  } = useGetNoteQuery(noteId!);

  return (
    <RtkQueryWrapper
      isLoading={isLoading || isUninitialized || isFetching}
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
        {tripId && (
          <BackButton
            label={
              fromCalendar
                ? text.notes.noteDetail.backToCalendar
                : text.notes.noteDetail.backToTrip
            }
            onClick={() =>
              navigate(
                fromCalendar
                  ? ERoutes.TRIP_CALENDAR.replace(":tripId", tripId)
                  : ERoutes.TRIP_DETAIL.replace(":tripId", tripId),
              )
            }
            sx={{ mb: 2 }}
          />
        )}
        <NoteItem note={note!} />
      </Container>
    </RtkQueryWrapper>
  );
};
