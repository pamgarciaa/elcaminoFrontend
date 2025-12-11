import { useQuery } from "@tanstack/react-query";
import { orderService } from "../services/orderService";
import type { Order } from "../types/orderTypes";

export const useMyOrdersQuery = () => {
  return useQuery<Order[], Error>({
    queryKey: ["myOrders"],
    queryFn: orderService.getMyOrders,
    staleTime: 1000 * 60 * 2,
  });
};
