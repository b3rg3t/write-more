import { EndpointBuilder } from "@reduxjs/toolkit/query";
import { ITrip } from "../../../models/interface/ITrip";

export const tripsEndpoints = (
  builder: EndpointBuilder<any, "Notes" | "Todos" | "Trips", "api">
) => ({
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
      Pick<ITrip, "title" | "description"> & {
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
      Pick<ITrip, "_id" | "title" | "description"> & {
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
});
