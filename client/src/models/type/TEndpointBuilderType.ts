import { EndpointBuilder } from "@reduxjs/toolkit/query";

export type TEndpointBuilderType = EndpointBuilder<
  any,
  "Notes" | "Todos" | "Trips" | "Users",
  "api"
>;
