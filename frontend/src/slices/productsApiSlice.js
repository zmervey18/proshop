import { PRODUCTS_URL } from "../constants";

import { apiSlice } from "./apiSlice";

//products api slice injects endpoints into main apislice
export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //getProducts is an endpoint
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      //keeps data cached till last component unsubscribes, in seconds
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } =
  productsApiSlice;
