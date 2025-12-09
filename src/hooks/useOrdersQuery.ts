// src/features/orders/hooks/useOrdersQuery.ts
import { useQuery } from '@tanstack/react-query';
import client from '../api/axios.client';
import { API_ROUTES } from '../config/constants';
import type { Order } from '../types';

const fetchMyOrders = async (): Promise<Order[]> => {
    const { data } = await client.get(`${API_ROUTES.ORDERS}/myorders`);
    // Tu backend devuelve { status: "success", data: { orders: [...] } }
    return data.data.orders;
};

export const useMyOrdersQuery = () => {
    return useQuery<Order[], Error>({
        queryKey: ['myOrders'],
        queryFn: fetchMyOrders,
        staleTime: 1000 * 60 * 2, // 2 minutos de caché
    });
};