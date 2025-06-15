import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { useAppDispatch } from "../../store/redux/hooks";
import { addOneNote } from "../../store/reducers/notes/notesSlice";

export const Actions = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <Fab
        size="small"
        color="primary"
        aria-label="Add note"
        onClick={() =>
          dispatch(
            addOneNote({
              id: crypto.randomUUID(),
              name: "New Note",
              content: "",
            })
          )
        }
      >
        <AddIcon />
      </Fab>
    </>
  );
};
