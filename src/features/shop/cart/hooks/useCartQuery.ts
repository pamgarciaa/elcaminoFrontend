import { useQuery } from "@tanstack/react-query";
import client from "../../../../api/axios.client";
import { API_ROUTES } from "../../../../config/constants";
import type { Cart, CartItem } from "../types/cartTypes";
import { useAuth } from "../../../auth/context/AuthContext";

const fetchCart = async (): Promise<Cart> => {
  const { data } = await client.get(API_ROUTES.CART);

  return data.data.cart;
};

export const useCartQuery = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<Cart, Error>({
    queryKey: ["cart"],
    queryFn: fetchCart,
    retry: false,
    enabled: isAuthenticated,
  });
};

export const useCartCount = () => {
  const { data: cart, isLoading } = useCartQuery();

  const count =
    cart?.items?.reduce(
      (acc: number, item: CartItem) => acc + item.quantity,
      0
    ) || 0;

  return { count, isLoading };
};
