// src/features/shop/hooks/useCartQuery.ts
import { useQuery } from '@tanstack/react-query';
import client from '../api/axios.client';
import type { Cart } from '../types';
import { useAuth } from '../context/AuthContext';
import { API_ROUTES } from '../config/constants';

const fetchCart = async (): Promise<Cart> => {
    const { data } = await client.get(`${API_ROUTES.CART}/`);
    return data.data.cart; 
};

export const useCartQuery = () => {
    const { isAuthenticated } = useAuth();

    return useQuery<Cart, Error>({
        queryKey: ['userCart'],
        queryFn: fetchCart,
        enabled: isAuthenticated, 
        staleTime: 1000 * 60 * 5 
    });
};

export const useCartCount = () => {
    const { data: cart, isLoading } = useCartQuery();
    
    const count = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
    
    return { count, isLoading };
};