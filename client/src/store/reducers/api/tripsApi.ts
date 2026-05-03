import { ITrip } from "../../../models/interface/ITrip";
import { ITripImage } from "../../../models/interface/ITripImage";
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
      Pick<
        ITrip,
        "title" | "description" | "startDate" | "endDate" | "users"
      > & {
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
    invalidatesTags: ["Trips", "Notes", "Todos"],
  }),
  updateTrip: builder.mutation<
    ITrip,
    Partial<
      Pick<
        ITrip,
        | "_id"
        | "title"
        | "description"
        | "startDate"
        | "endDate"
        | "users"
        | "notesSection"
        | "todosSection"
        | "imagesSection"
      > & {
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
    invalidatesTags: ["Trips", "Notes", "Todos"],
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
    invalidatesTags: ["Trips", "Notes", "Todos"],
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
    invalidatesTags: ["Trips", "Notes", "Todos"],
  }),

  // Add user to trip
  addUserToTrip: builder.mutation<ITrip, { tripId: string; userId: string }>({
    query: ({ tripId, userId }) => ({
      url: `trips/${tripId}/users`,
      method: "POST",
      body: { userId },
    }),
    invalidatesTags: ["Trips", "Notes", "Todos"],
  }),

  // Get trip images metadata (snapshot-focused)
  getTripImages: builder.query<
    { tripId: string; images: ITripImage[] },
    string
  >({
    query: (tripId) => `trips/${tripId}/images`,
    providesTags: ["Trips"],
  }),

  // Upload trip image
  uploadTripImage: builder.mutation<
    {
      message: string;
      tripId: string;
      image: {
        id: string;
        originalName: string;
        uploadedAt: string;
      };
    },
    { tripId: string; file: File }
  >({
    query: ({ tripId, file }) => {
      const formData = new FormData();
      formData.append("image", file);

      return {
        url: `trips/${tripId}/image`,
        method: "POST",
        body: formData,
      };
    },
    invalidatesTags: ["Trips", "Notes", "Todos"],
  }),

  // Delete a trip image
  deleteTripImage: builder.mutation<
    { message: string },
    { tripId: string; imageId: string }
  >({
    query: ({ tripId, imageId }) => ({
      url: `trips/${tripId}/images/${imageId}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Trips"],
  }),
});
