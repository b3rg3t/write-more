import { Actions } from "../settings/Actions";
import { NoteList } from "./NoteList";

export const Notes = () => {
  return (
    <div>
      Hello note
      <Actions />
      <NoteList />
    </div>
  );
};
