import { IUser } from "../../../models/interface/IUser";
import { TEndpointBuilderType } from "../../../models/type/TEndpointBuilderType";

export const usersEndpoints = (builder: TEndpointBuilderType) => ({
  addUser: builder.mutation<any, Partial<IUser>>({
    query: (body: Partial<IUser>) => ({
      url: "users",
      method: "POST",
      body,
    }),
  }),
});
