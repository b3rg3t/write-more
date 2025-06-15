import { EntityState } from "@reduxjs/toolkit";
import { EStoreKeys } from "../../models/enum/EStoreKeys";
import { getLocalStorage } from "../../util/localStorage";

import { RootState } from "./store";
import { TNote } from "../../models/type/TNote";
import { filledNotesState } from "../reducers/notes/notesSlice";

export const getPreloadedState = () => {
  const notes = getLocalStorage<EntityState<TNote, string>>(
    EStoreKeys.NOTES
  );

  let preloadedState: RootState = {
    notes: filledNotesState,
  };

  if (notes) {
    preloadedState.notes = notes;
  }

  return preloadedState;
};
