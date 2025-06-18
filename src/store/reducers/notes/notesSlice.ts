import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { EStoreKeys } from "../../../models/enum/EStoreKeys";
import { TNote } from "../../../models/type/TNote";
import { INote } from "../../../models/interface/INote";

const notesAdapter = createEntityAdapter({
  selectId: (note: TNote) => note.id,
  sortComparer: (a, b) => a.order - b.order,
});

const initialState: INote = {
  ...notesAdapter.getInitialState(),
};

export const filledNotesState = {
  ...notesAdapter.upsertMany(initialState, []),
};

export const notesSlice = createSlice({
  name: EStoreKeys.NOTES,
  initialState: filledNotesState,
  reducers: {
    addOneNote: (state, action: PayloadAction<TNote>) => {
      notesAdapter.addOne(state, action);
      state.isEditing = action.payload.id;
      state.editingNote = action.payload;
    },
    updateOneNote: notesAdapter.updateOne,
    updateAllNotes: notesAdapter.updateMany,
    removeOneNote: notesAdapter.removeOne,
    editNote: (state, action: PayloadAction<TNote>) => {
      state.isEditing = action.payload.id;
      state.editingNote = action.payload;
    },
    stopEditNote: (state) => {
      state.isEditing = undefined;
      state.editingNote = undefined;
    },
    // // TODO: not in use
    // roundsReceived(state, action) {
    //   // Or, call them as "mutating" helpers in a case reducer
    //   notesAdapter.setAll(state, action.payload.round);
    // },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(createGameAction, (state, action) => {
  //     if (action.payload.players) {
  //       notesAdapter.addMany(state, action.payload.players);
  //     }
  //   });
  // },
});

const selectAllNotes = notesAdapter.getSelectors<RootState>(
  (state) => state.notes
);

const selectAllEntities = selectAllNotes.selectEntities;

export const { selectAll, selectById, selectTotal, selectIds } = selectAllNotes;

export const {
  addOneNote,
  removeOneNote,
  updateOneNote,
  editNote,
  stopEditNote,
  updateAllNotes,
} = notesSlice.actions;
export { selectAllNotes as selectAllPlayers, selectAllEntities };
