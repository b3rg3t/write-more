import { Fab, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch } from "../../store/redux/hooks";
import { createNewNote } from "../../store/reducers/notes/notesSlice";
// import { addOneNote } from "../../store/reducers/notes/notesSlice";

export const Actions = () => {
  const dispatch = useAppDispatch();

  const handleAddNote = () => {
    dispatch(createNewNote());
  };

  return (
    <Box
      position="fixed"
      left={0}
      right={0}
      bottom={24}
      display="flex"
      justifyContent="center"
      zIndex={1300}
      sx={{ pointerEvents: "none" }}
    >
      <Fab
        size="large"
        color="primary"
        aria-label="Add note"
        onClick={handleAddNote}
        sx={{ pointerEvents: "auto" }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};
