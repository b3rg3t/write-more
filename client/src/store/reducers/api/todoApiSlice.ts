import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ITodo } from "../../../models/interface/ITodo";
import { API_BASE_URL } from "./util";

export const todoApiSlice = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getAllTodos: builder.query<ITodo[], void>({
      query: () => "todos",
      providesTags: ["Todos"],
    }),
    getTodo: builder.query<ITodo, string>({
      query: (id) => `todos/${id}`,
      providesTags: ["Todos"],
    }),
    addTodo: builder.mutation<ITodo, Partial<ITodo>>({
      query: (body) => ({
        url: `todos`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Todos"],
    }),
    updateTodo: builder.mutation<ITodo, Partial<ITodo>>({
      query: (body) => ({
        url: `todos/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Todos"],
    }),
    reorderTodos: builder.mutation<ITodo[], Pick<ITodo, "_id" | "order">[]>({
      query: (body) => ({
        url: `todos/order`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: builder.mutation<ITodo[], Pick<ITodo, "_id">>({
      query: (body) => ({
        url: `todos/${body._id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todos"],
    }),
  }),
});

export const {
  useGetAllTodosQuery,
  useGetTodoQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useReorderTodosMutation,
  useUpdateTodoMutation,
} = todoApiSlice;
