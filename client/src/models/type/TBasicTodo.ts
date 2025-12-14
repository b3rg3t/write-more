import { ITodo } from "../interface/ITodo";

export type TBasicTodo = Partial<Omit<ITodo, "createdAt" | "updatedAt">>;
