import { TEndpointBuilderType } from "../../../models/type/TEndpointBuilderType";
import { INote } from "../../../models/interface/INote";

export const notesEndpoints = (builder: TEndpointBuilderType) => ({
  getAllNotes: builder.query<INote[], void>({
    query: () => "notes",
    providesTags: ["Notes"],
  }),
  getNote: builder.query<INote, string>({
    query: (id) => `notes/${id}`,
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
    invalidatesTags: ["Notes", "Trips"],
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
    invalidatesTags: ["Notes", "Trips"],
  }),
});
