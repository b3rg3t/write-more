import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { EStoreKeys } from "../../../models/enum/EStoreKeys";
import { ITodo } from "../../../models/interface/ITodo";

interface ITodssState {
  isEditing?: ITodo["_id"];
  isNew?: boolean;
  isDeleting?: ITodo["_id"];
}

const initialState: ITodssState = {
  isEditing: undefined,
  isNew: false,
  isDeleting: undefined,
};

export const todosSlice = createSlice({
  name: EStoreKeys.TODOS,
  initialState: initialState,
  reducers: {
    setEditTodo: (state, action: PayloadAction<ITodo["_id"] | undefined>) => {
      state.isEditing = action.payload;
    },
    createNewTodo: (state) => {
      state.isNew = true;
    },
    cancelTodo: (state) => {
      state.isNew = false;
      state.isEditing = undefined;
    },
    deleteTodo: (state, action: PayloadAction<ITodo["_id"] | undefined>) => {
      state.isDeleting = action.payload;
      if (action.payload === undefined) {
        state.isNew = false;
        state.isEditing = undefined;
      }
    },
  },
});

const selectIsNew = (state: RootState) => state.todos.isNew;
const selectIsEditing = (state: RootState) => state.todos.isEditing;
const selectIsDeleting = (state: RootState) => state.todos.isDeleting;

export { selectIsNew, selectIsEditing, selectIsDeleting };

export const { cancelTodo, createNewTodo, setEditTodo, deleteTodo } =
  todosSlice.actions;
