import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

//products api slice injects endpoints into main apislice
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //getUsers is an endpoint
    login: builder.mutation({
      //pass in data because we are sending data to auth endpoint
      //data entails name and email
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  userApiSlice;
