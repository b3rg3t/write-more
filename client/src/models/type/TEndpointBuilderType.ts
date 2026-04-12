import { EndpointBuilder } from "@reduxjs/toolkit/query";

export type TEndpointBuilderType = EndpointBuilder<
  any,
  "Notes" | "Comments" | "Todos" | "Trips" | "Users",
  "api"
>;
