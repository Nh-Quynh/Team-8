import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id) => `users/${id}`,
    }),
  }),
});

export const { useGetUserByIdQuery } = api; // Đảm bảo rằng hook này được xuất khẩu
