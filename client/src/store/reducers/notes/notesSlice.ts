import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { EStoreKeys } from "../../../models/enum/EStoreKeys";
import { INote } from "../../../models/interface/INote";

interface INotesState {
  isEditing?: INote["_id"];
  isNew?: boolean;
  isDeleting?: INote["_id"];
}

const initialState: INotesState = {
  isEditing: undefined,
  isNew: false,
  isDeleting: undefined,
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
    },
    deleteNote: (state, action: PayloadAction<INote["_id"] | undefined>) => {
      state.isDeleting = action.payload;
      if (action.payload === undefined) {
        state.isNew = false;
        state.isEditing = undefined;
      }
    },
  },
});

const selectIsNew = (state: RootState) => state.notes.isNew;
const selectIsEditing = (state: RootState) => state.notes.isEditing;
const selectIsDeleting = (state: RootState) => state.notes.isDeleting;

export { selectIsNew, selectIsEditing, selectIsDeleting };

export const { cancelNote, createNewNote, setEditNote, deleteNote } =
  notesSlice.actions;
