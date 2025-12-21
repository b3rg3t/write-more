import { ITrip } from "../../../models/interface/ITrip";
import { INote } from "../../../models/interface/INote";
import { ITodo } from "../../../models/interface/ITodo";
import { TEndpointBuilderType } from "../../../models/type/TEndpointBuilderType";

export const tripsEndpoints = (builder: TEndpointBuilderType) => ({
  getAllTrips: builder.query<ITrip[], void>({
    query: () => "trips",
    providesTags: ["Trips"],
  }),
  getTrip: builder.query<ITrip, string>({
    query: (id) => `trips/${id}`,
    providesTags: ["Trips"],
  }),
  addTrip: builder.mutation<
    ITrip,
    Partial<
      Pick<ITrip, "title" | "description" | "startDate" | "endDate"> & {
        notes: ITrip["_id"][];
        todos: ITrip["_id"][];
      }
    >
  >({
    query: (body) => ({
      url: `trips`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["Trips"],
  }),
  updateTrip: builder.mutation<
    ITrip,
    Partial<
      Pick<ITrip, "_id" | "title" | "description" | "startDate" | "endDate"> & {
        notes: ITrip["_id"][];
        todos: ITrip["_id"][];
      }
    >
  >({
    query: (body) => ({
      url: `trips/${body._id}`,
      method: "PUT",
      body,
    }),
    invalidatesTags: ["Trips"],
  }),
  reorderTrips: builder.mutation<ITrip[], Pick<ITrip, "_id" | "order">[]>({
    query: (body) => ({
      url: `trips/order`,
      method: "PATCH",
      body,
    }),
    invalidatesTags: ["Trips"],
  }),
  deleteTrip: builder.mutation<ITrip[], Pick<ITrip, "_id">>({
    query: (body) => ({
      url: `trips/${body._id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Trips"],
  }),

  // Create note for trip
  createNoteForTrip: builder.mutation<
    { note: INote; trip: ITrip },
    { tripId: string; title: string; content: string; links?: any[] }
  >({
    query: ({ tripId, ...body }) => ({
      url: `trips/${tripId}/notes`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["Trips"],
  }),

  // Create todo for trip
  createTodoForTrip: builder.mutation<
    { todo: ITodo; trip: ITrip },
    { tripId: string; name: string; isCompleted?: boolean }
  >({
    query: ({ tripId, ...body }) => ({
      url: `trips/${tripId}/todos`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["Trips"],
  }),
});
