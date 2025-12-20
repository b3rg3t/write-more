import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { EStoreKeys } from "../../models/enum/EStoreKeys";
import { storeMiddleware } from "../storeMiddlewate";

import { notesSlice } from "../reducers/notes/notesSlice";
import { apiSlice } from "../reducers/api/apiSlice";
import { todosSlice } from "../reducers/todos/todosSlice";
import { tripsSlice } from "../reducers/trips/tripsSlice";

const rootReducer = combineReducers({
  [EStoreKeys.NOTES]: notesSlice.reducer,
  [EStoreKeys.TODOS]: todosSlice.reducer,
  [EStoreKeys.TRIPS]: tripsSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

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
