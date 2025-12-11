import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import { getPreloadedState } from "./preloadedState";
import { EStoreKeys } from "../../models/enum/EStoreKeys";
import { notesSlice } from "../reducers/notes/notesSlice";
import { storeMiddleware } from "../storeMiddlewate";
import { noteApiSlice } from "../reducers/api/apiSlice";

const rootReducer = combineReducers({
  [EStoreKeys.NOTES]: notesSlice.reducer,
  [noteApiSlice.reducerPath]: noteApiSlice.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(storeMiddleware)
        .concat(noteApiSlice.middleware),
    // preloadedState: getPreloadedState(),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
