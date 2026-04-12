import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EStoreKeys } from "../../../models/enum/EStoreKeys";
import { ITrip } from "../../../models/interface/ITrip";
import { RootState } from "../../redux/store";

interface ITripUsersState {
  isAddingUser?: ITrip["_id"];
}

const initialState: ITripUsersState = {
  isAddingUser: undefined,
};

export const tripUsersSlice = createSlice({
  name: EStoreKeys.TRIP_USERS,
  initialState,
  reducers: {
    setAddUserToTrip: (state, action: PayloadAction<ITrip["_id"]>) => {
      state.isAddingUser = action.payload;
    },
    cancelAddUserToTrip: (state) => {
      state.isAddingUser = undefined;
    },
  },
});

export const selectIsAddingUser = (state: RootState) =>
  state.tripUsers.isAddingUser;

export const { setAddUserToTrip, cancelAddUserToTrip } = tripUsersSlice.actions;
