import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { EStoreKeys } from "../../../models/enum/EStoreKeys";
import { INote } from "../../../models/interface/INote";
import { ITrip } from "../../../models/interface/ITrip";

interface INotesState {
  isEditing?: INote["_id"];
  isNew?: boolean;
  isDeleting?: INote["_id"];
  creatingNoteForTrip?: ITrip["_id"];
  creatingNoteForTripDate?: string;
}

const initialState: INotesState = {
  isEditing: undefined,
  isNew: false,
  isDeleting: undefined,
  creatingNoteForTripDate: undefined,
};

export const notesSlice = createSlice({
  name: EStoreKeys.NOTES,
  initialState: initialState,
  reducers: {
    setEditNote: (state, action: PayloadAction<INote["_id"] | undefined>) => {
      state.isEditing = action.payload;
    },
    createNewNote: (state) => {
      state.isNew = true;
    },
    cancelNote: (state) => {
      state.isNew = false;
      state.isEditing = undefined;
      state.creatingNoteForTrip = undefined;
      state.creatingNoteForTripDate = undefined;
    },
    deleteNote: (state, action: PayloadAction<INote["_id"] | undefined>) => {
      state.isDeleting = action.payload;
      if (action.payload === undefined) {
        state.isNew = false;
        state.isEditing = undefined;
      }
    },
    createNoteForTrip: (state, action: PayloadAction<ITrip["_id"]>) => {
      state.creatingNoteForTrip = action.payload;
    },
    createNoteForTripOnDate: (
      state,
      action: PayloadAction<{ tripId: ITrip["_id"]; date: string }>,
    ) => {
      state.creatingNoteForTrip = action.payload.tripId;
      state.creatingNoteForTripDate = action.payload.date;
    },
  },
});

const selectIsNew = (state: RootState) => state.notes.isNew;
const selectIsEditing = (state: RootState) => state.notes.isEditing;
const selectIsDeleting = (state: RootState) => state.notes.isDeleting;
const selectCreatingNoteForTrip = (state: RootState) =>
  state.notes.creatingNoteForTrip;
const selectCreatingNoteForTripDate = (state: RootState) =>
  state.notes.creatingNoteForTripDate;

export {
  selectIsNew,
  selectIsEditing,
  selectIsDeleting,
  selectCreatingNoteForTrip,
  selectCreatingNoteForTripDate,
};

export const {
  cancelNote,
  createNewNote,
  setEditNote,
  deleteNote,
  createNoteForTrip,
  createNoteForTripOnDate,
} = notesSlice.actions;
