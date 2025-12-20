import { EndpointBuilder } from "@reduxjs/toolkit/query";
import { ITodo } from "../../../models/interface/ITodo";

export const todosEndpoints = (
  builder: EndpointBuilder<any, "Notes" | "Todos" | "Trips", "api">
) => ({
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
    invalidatesTags: ["Todos", "Trips"],
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
    invalidatesTags: ["Trips"],
  }),
});
