import { EStoreKeys } from "../../models/enum/EStoreKeys";
import { getLocalStorage } from "../../util/localStorage";

import { RootState } from "./store";

import { filledNotesState } from "../reducers/notes/notesSlice";
import { INote } from "../../models/interface/INote";

export const getPreloadedState = () => {
  const notes = getLocalStorage<INote>(EStoreKeys.NOTES);

  let preloadedState: RootState = {
    notes: filledNotesState,
  };

  if (notes) {
    preloadedState.notes = {
      ...notes,
    };
  }

  return preloadedState;
};
