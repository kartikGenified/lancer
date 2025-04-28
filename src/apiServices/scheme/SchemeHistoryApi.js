import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const SchemeHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchemeHistory: builder.mutation({
      query: (params) => {
        return {
          method: "POST",
          url: `/api/app/scheme/history?scheme_id=${params.id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + params.token,
            slug: slug,
            
         
          },
        };
      },
    }),
  }),
});

export const { useGetSchemeHistoryMutation } = SchemeHistoryApi;
