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
        url: `${USERS_URL} / auth`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation } = userApiSlice;
