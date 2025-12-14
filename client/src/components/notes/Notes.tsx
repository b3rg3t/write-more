import { Actions } from "../settings/Actions";
import { NoteList } from "./NoteList";
import { DeleteNoteModal } from "../modal/DeleteNoteModal";
import { NoteFormModal } from "../modal/NoteFormModal";

export const Notes = () => (
  <>
    <DeleteNoteModal />
    <NoteFormModal />
    <NoteList />
    <Actions />
  </>
);
