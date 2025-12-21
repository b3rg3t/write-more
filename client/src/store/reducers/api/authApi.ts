import { TEndpointBuilderType } from "../../../models/type/TEndpointBuilderType";

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    _id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

export interface CurrentUserResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

export const authEndpoints = (builder: TEndpointBuilderType) => ({
  signup: builder.mutation<AuthResponse, SignupRequest>({
    query: (body: SignupRequest) => ({
      url: "auth/signup",
      method: "POST",
      body,
    }),
  }),
  signin: builder.mutation<AuthResponse, SigninRequest>({
    query: (body: SigninRequest) => ({
      url: "auth/signin",
      method: "POST",
      body,
    }),
  }),
  getCurrentUser: builder.query<CurrentUserResponse, void>({
    query: () => ({
      url: "auth/me",
      method: "GET",
    }),
  }),
});
