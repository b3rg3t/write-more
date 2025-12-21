import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "./util";
import { notesEndpoints } from "./notesApi";
import { todosEndpoints } from "./todosApi";
import { tripsEndpoints } from "./tripsApi";
import { usersEndpoints } from "./usersApi";
import { authEndpoints } from "./authApi";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Notes", "Todos", "Trips", "Users", "Auth"],
  endpoints: (builder) => ({
    ...notesEndpoints(builder as any),
    ...todosEndpoints(builder as any),
    ...tripsEndpoints(builder as any),
    ...usersEndpoints(builder as any),
    ...authEndpoints(builder as any),
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
  useCreateNoteForTripMutation,
  useCreateTodoForTripMutation,

  // Users hooks
  useAddUserMutation,
  useGetAllUsersQuery,

  // Auth hooks
  useSignupMutation,
  useSigninMutation,
  useGetCurrentUserQuery,
} = apiSlice;
