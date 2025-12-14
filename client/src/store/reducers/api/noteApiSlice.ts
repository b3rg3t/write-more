import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { INote } from "../../../models/interface/INote";
import { API_BASE_URL } from "./util";

export const noteApiSlice = createApi({
  reducerPath: "noteApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Notes"],
  endpoints: (builder) => ({
    getAllNotes: builder.query<INote[], void>({
      query: () => "notes",
      providesTags: ["Notes"],
    }),
    addNote: builder.mutation<INote, Partial<INote>>({
      query: (body) => ({
        url: `notes`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),
    updateNote: builder.mutation<INote, Partial<INote>>({
      query: (body) => ({
        url: `notes/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),
    reorderNotes: builder.mutation<INote[], Pick<INote, "_id" | "order">[]>({
      query: (body) => ({
        url: `notes/order`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),
    deleteNote: builder.mutation<INote[], Pick<INote, "_id">>({
      query: (body) => ({
        url: `notes/${body._id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  useGetAllNotesQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useReorderNotesMutation,
  useDeleteNoteMutation,
} = noteApiSlice;
