import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { EStoreKeys } from "../../models/enum/EStoreKeys";
import { storeMiddleware } from "../storeMiddlewate";

import { notesSlice } from "../reducers/notes/notesSlice";
import { noteApiSlice } from "../reducers/api/noteApiSlice";
import { todoApiSlice } from "../reducers/api/todoApiSlice";
import { todosSlice } from "../reducers/todos/todosSlice";
import { tripApiSlice } from "../reducers/api/tripApiSlice";
import { tripsSlice } from "../reducers/trips/tripsSlice";

const rootReducer = combineReducers({
  [EStoreKeys.NOTES]: notesSlice.reducer,
  [EStoreKeys.TODOS]: todosSlice.reducer,
  [EStoreKeys.TRIPS]: tripsSlice.reducer,
  [noteApiSlice.reducerPath]: noteApiSlice.reducer,
  [todoApiSlice.reducerPath]: todoApiSlice.reducer,
  [tripApiSlice.reducerPath]: tripApiSlice.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(storeMiddleware)
        .concat(noteApiSlice.middleware)
        .concat(todoApiSlice.middleware)
        .concat(tripApiSlice.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
