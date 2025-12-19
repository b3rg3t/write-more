import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { EStoreKeys } from "../../../models/enum/EStoreKeys";
import { ITrip } from "../../../models/interface/ITrip";

interface ITripsState {
  isEditing?: ITrip["_id"];
  isNew?: boolean;
  isDeleting?: ITrip["_id"];
}

const initialState: ITripsState = {
  isEditing: undefined,
  isNew: false,
  isDeleting: undefined,
};

export const tripsSlice = createSlice({
  name: EStoreKeys.TRIPS,
  initialState: initialState,
  reducers: {
    setEditTrip: (state, action: PayloadAction<ITrip["_id"] | undefined>) => {
      state.isEditing = action.payload;
    },
    createNewTrip: (state) => {
      state.isNew = true;
    },
    cancelTrip: (state) => {
      state.isNew = false;
      state.isEditing = undefined;
    },
    deleteTrip: (state, action: PayloadAction<ITrip["_id"] | undefined>) => {
      state.isDeleting = action.payload;
      if (action.payload === undefined) {
        state.isNew = false;
        state.isEditing = undefined;
      }
    },
  },
});

const selectIsNew = (state: RootState) => state.trips.isNew;
const selectIsEditing = (state: RootState) => state.trips.isEditing;
const selectIsDeleting = (state: RootState) => state.trips.isDeleting;

export { selectIsNew, selectIsEditing, selectIsDeleting };

export const { cancelTrip, createNewTrip, setEditTrip, deleteTrip } =
  tripsSlice.actions;
