import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { EStoreKeys } from "../../../models/enum/EStoreKeys";
import { TNote } from "../../../models/type/TNote";

const notesAdapter = createEntityAdapter({
  selectId: (note: TNote) => note.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = notesAdapter.getInitialState();
export const filledNotesState = notesAdapter.upsertMany(initialState, []);

export const notesSlice = createSlice({
  name: EStoreKeys.NOTES,
  initialState: filledNotesState,
  reducers: {
    addOneNote: notesAdapter.addOne,
    updateOneNote: notesAdapter.updateOne,
    removeOneNote: notesAdapter.removeOne,
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

export const { addOneNote, removeOneNote, updateOneNote } = notesSlice.actions;
export { selectAllNotes as selectAllPlayers, selectAllEntities };
