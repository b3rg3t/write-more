import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "./util";
import { notesEndpoints } from "./notesApi";
import { todosEndpoints } from "./todosApi";
import { tripsEndpoints } from "./tripsApi";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Notes", "Todos", "Trips"],
  endpoints: (builder) => ({
    ...notesEndpoints(builder),
    ...todosEndpoints(builder),
    ...tripsEndpoints(builder),
  }),
});

export const {
  // Notes hooks
  useGetAllNotesQuery,
  useGetNoteQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useReorderNotesMutation,
  useDeleteNoteMutation,

  // Todos hooks
  useGetAllTodosQuery,
  useGetTodoQuery,
  useAddTodoMutation,
  useUpdateTodoMutation,
  useReorderTodosMutation,
  useDeleteTodoMutation,

  // Trips hooks
  useGetAllTripsQuery,
  useGetTripQuery,
  useAddTripMutation,
  useUpdateTripMutation,
  useReorderTripsMutation,
  useDeleteTripMutation,
} = apiSlice;
