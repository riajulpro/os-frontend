import { api } from "@/redux/api/appSlice";
import { IOrder } from "@/types/sell";

const sellAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllSells: builder.query<
      {
        data: any;
        sales: IOrder[];
        total: number;
      },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `sell?page=${page}&limit=${limit}`,
      providesTags: ["Sell"],
    }),
    createOrder: builder.mutation({
      query: (payload) => ({
        url: `/sell`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Sell"],
    }),
    getUserOrderHistroy: builder.query({
      query: ({ page = 1 }: { page?: number }) =>
        `/sell/my/orders?page=${page}&limit=${10}`,
      providesTags: ["Sell"],
    }),
    trackUserOrder: builder.query({
      query: (orderId: string) => `/sell/my/order/${orderId}`,
      providesTags: ["Sell"],
    }),
    getEarning: builder.query({
      query: () => `/sell/earning/get`,
      providesTags: ["Sell"],
    }),
    updateSellStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/sell/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Sell"],
    }),
  }),
});

export const {
  useGetAllSellsQuery,
  useGetUserOrderHistroyQuery,
  useTrackUserOrderQuery,
  useGetEarningQuery,
  useUpdateSellStatusMutation,
  useCreateOrderMutation,
} = sellAPI;
