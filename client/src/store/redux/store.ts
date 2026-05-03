import { tripUsersSlice } from "../reducers/trips/tripUsersSlice";
import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { EStoreKeys } from "../../models/enum/EStoreKeys";
import { storeMiddleware } from "../storeMiddlewate";

import { notesSlice } from "../reducers/notes/notesSlice";
import { apiSlice, AUTH_LOGOUT } from "../reducers/api/apiSlice";
import { todosSlice } from "../reducers/todos/todosSlice";
import { tripsSlice } from "../reducers/trips/tripsSlice";

const appReducer = combineReducers({
  [EStoreKeys.NOTES]: notesSlice.reducer,
  [EStoreKeys.TODOS]: todosSlice.reducer,
  [EStoreKeys.TRIPS]: tripsSlice.reducer,
  [EStoreKeys.TRIP_USERS]: tripUsersSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: AnyAction) => {
  if (action.type === AUTH_LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(storeMiddleware)
        .concat(apiSlice.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
