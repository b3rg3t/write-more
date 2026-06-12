import { IComment } from "../../../models/interface/IComment";
import { TEndpointBuilderType } from "../../../models/type/TEndpointBuilderType";

export const commentsEndpoints = (builder: TEndpointBuilderType) => ({
  getComments: builder.query<IComment[], string>({
    query: (noteId) => `comments?noteId=${noteId}`,
    providesTags: ["Comments"],
  }),
  createCommentForNote: builder.mutation<
    IComment,
    { noteId: string; content: string }
  >({
    query: ({ noteId, content }) => ({
      url: `notes/${noteId}/comments`,
      method: "POST",
      body: { content },
    }),
    invalidatesTags: (_result, _error, { noteId }) => [
      { type: "Notes", id: noteId },
      "Comments",
      "Trips",
    ],
  }),
  updateComment: builder.mutation<
    IComment,
    { id: string; content: string; noteId: string }
  >({
    query: ({ id, content }) => ({
      url: `comments/${id}`,
      method: "PUT",
      body: { content },
    }),
    invalidatesTags: (_result, _error, { noteId }) => [
      { type: "Notes", id: noteId },
      "Comments",
      "Trips",
    ],
  }),
  deleteComment: builder.mutation<
    { message: string },
    { id: string; noteId: string }
  >({
    query: ({ id }) => ({
      url: `comments/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: (_result, _error, { noteId }) => [
      { type: "Notes", id: noteId },
      "Comments",
      "Trips",
    ],
  }),
});
