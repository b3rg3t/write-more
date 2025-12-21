import { IUser } from "../../../models/interface/IUser";
import { TEndpointBuilderType } from "../../../models/type/TEndpointBuilderType";
import { TUser } from "../../../models/type/TUser";

export const usersEndpoints = (builder: TEndpointBuilderType) => ({
  getAllUsers: builder.query<TUser[], void>({
    query: () => ({
      url: "users",
      method: "GET",
    }),
  }),
  addUser: builder.mutation<any, Partial<IUser>>({
    query: (body: Partial<IUser>) => ({
      url: "users",
      method: "POST",
      body,
    }),
    invalidatesTags: ["Users"],
  }),
});
