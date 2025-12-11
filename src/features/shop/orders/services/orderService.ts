import client from "../../../../api/axios.client";
import { API_ROUTES } from "../../../../config/constants";
import { type Order } from "../types/orderTypes";

export const orderService = {
  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await client.get(`${API_ROUTES.ORDERS}/myorders`);
    return data.data.orders;
  },
  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await client.get(`${API_ROUTES.ORDERS}/${id}`);
    return data.data.order;
  },
};
