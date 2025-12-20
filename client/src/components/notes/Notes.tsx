import { NoteList } from "./NoteList";
import { Typography } from "@mui/material";
import { fontSize16 } from "../utils/FontSize";
import { text } from "../../localization/eng";
import { useAppDispatch } from "../../store/redux/hooks";
import { useGetAllNotesQuery } from "../../store/reducers/api/apiSlice";
import { useMemo } from "react";
import { RtkQueryWrapper } from "../wrapper/RtkQueryWrapper";
import { createNewNote } from "../../store/reducers/notes/notesSlice";
import { Action } from "../utils/Action";

export const Notes = () => {
  const { data, isLoading, isUninitialized, isFetching, error } =
    useGetAllNotesQuery();
  const dispatch = useAppDispatch();
  const sortedData = useMemo(() => {
    return data ? [...data].sort((a, b) => a.order - b.order) : [];
  }, [data]);

  const { header } = text.notes;
  const { loading, createNote, noNotes, fetchError } = text.notes.notesList;

  return (
    <>
      <Typography
        variant="h2"
        fontSize={fontSize16}
        fontWeight="bold"
        sx={{ px: 2 }}
      >
        {header}
      </Typography>
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
        <NoteList notes={sortedData} />
        <Action
          onClick={() => dispatch(createNewNote())}
          text={createNote}
          variant="contained"
        />
      </RtkQueryWrapper>
    </>
  );
};
