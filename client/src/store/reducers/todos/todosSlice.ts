import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import { EStoreKeys } from "../../../models/enum/EStoreKeys";
import { ITodo } from "../../../models/interface/ITodo";
import { ITrip } from "../../../models/interface/ITrip";

interface ITodssState {
  isEditing?: ITodo["_id"];
  isNew?: boolean;
  isDeleting?: ITodo["_id"];
  creatingTodoForTrip?: ITrip["_id"];
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
      state.creatingTodoForTrip = undefined;
    },
    deleteTodo: (state, action: PayloadAction<ITodo["_id"] | undefined>) => {
      state.isDeleting = action.payload;
      if (action.payload === undefined) {
        state.isNew = false;
        state.isEditing = undefined;
      }
    },
    createTodoForTrip: (state, action: PayloadAction<ITrip["_id"]>) => {
      state.creatingTodoForTrip = action.payload;
    },
  },
});

const selectIsNew = (state: RootState) => state.todos.isNew;
const selectIsEditing = (state: RootState) => state.todos.isEditing;
const selectIsDeleting = (state: RootState) => state.todos.isDeleting;
const selectCreatingTodoForTrip = (state: RootState) =>
  state.todos.creatingTodoForTrip;

export {
  selectIsNew,
  selectIsEditing,
  selectIsDeleting,
  selectCreatingTodoForTrip,
};

export const {
  cancelTodo,
  createNewTodo,
  setEditTodo,
  deleteTodo,
  createTodoForTrip,
} = todosSlice.actions;
