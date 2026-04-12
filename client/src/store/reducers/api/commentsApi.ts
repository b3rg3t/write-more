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
    invalidatesTags: ["Comments", "Trips"],
  }),
  updateComment: builder.mutation<IComment, { id: string; content: string }>({
    query: ({ id, content }) => ({
      url: `comments/${id}`,
      method: "PUT",
      body: { content },
    }),
    invalidatesTags: ["Comments", "Trips"],
  }),
  deleteComment: builder.mutation<{ message: string }, { id: string }>({
    query: ({ id }) => ({
      url: `comments/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Comments", "Trips"],
  }),
});
