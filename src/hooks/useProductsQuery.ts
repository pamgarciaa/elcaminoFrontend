// src/features/shop/hooks/useProductsQuery.ts
import { useQuery } from '@tanstack/react-query';
import client from '../api/axios.client';
import type { Product } from '../types';
import { API_ROUTES } from '../config/constants';

const fetchProducts = async (): Promise<Product[]> => {
    const { data } = await client.get(API_ROUTES.PRODUCTS);
    return data.data.products; 
};

export const useProductsQuery = () => {
    return useQuery<Product[], Error>({
        queryKey: ['allProducts'],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5
    });
};