import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ITrip } from "../../../models/interface/ITrip";
import { API_BASE_URL } from "./util";

export const tripApiSlice = createApi({
  reducerPath: "tripApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Trips"],
  endpoints: (builder) => ({
    getAllTrips: builder.query<ITrip[], void>({
      query: () => "trips",
      providesTags: ["Trips"],
    }),
    addTrip: builder.mutation<
      ITrip,
      Partial<
        Pick<ITrip, "title" | "description"> & {
          notes: string[];
          todos: string[];
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
          notes: string[];
          todos: string[];
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
  }),
});

export const {
  useGetAllTripsQuery,
  useAddTripMutation,
  useUpdateTripMutation,
  useReorderTripsMutation,
  useDeleteTripMutation,
} = tripApiSlice;
