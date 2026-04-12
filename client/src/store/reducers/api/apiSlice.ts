import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "./util";
import { notesEndpoints } from "./notesApi";
import { commentsEndpoints } from "./commentsApi";
import { todosEndpoints } from "./todosApi";
import { tripsEndpoints } from "./tripsApi";
import { usersEndpoints } from "./usersApi";
import { authEndpoints } from "./authApi";
import {
  clearCredentials,
  TOKEN_STORAGE_KEY,
} from "../../../util/authCredentials";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuthHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    clearCredentials();
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthHandling,
  tagTypes: ["Notes", "Comments", "Todos", "Trips", "Users", "Auth"],
  endpoints: (builder) => ({
    ...notesEndpoints(builder as any),
    ...commentsEndpoints(builder as any),
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
  useGetCommentsQuery,
  useCreateCommentForNoteMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,

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
  useAddUserToTripMutation,

  // Users hooks
  useAddUserMutation,
  useGetAllUsersQuery,

  // Auth hooks
  useSignupMutation,
  useSigninMutation,
  useGetCurrentUserQuery,
} = apiSlice;
