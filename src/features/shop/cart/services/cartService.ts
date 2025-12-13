import { useMemo } from "react";
import { useCartQuery } from "../hooks/useCartQuery";
import {
  useUpdateCartMutation,
  useRemoveItemMutation,
  useCheckoutMutation, // <-- Importado
} from "../hooks/useCartMutations";
import type { CartItem } from "../types/cartTypes";
import axiosClient from "../../../../api/axios.client"; // <-- Importar cliente axios

// Nuevo Servicio: Llamada a la API para checkout
interface CheckoutResponse {
  status: "success";
  data: { order: any };
}
export const checkoutService = async (
  shippingAddress: string
): Promise<CheckoutResponse> => {
  const response = await axiosClient.post("/cart/checkout", {
    shippingAddress,
  });
  return response.data;
};

export const useCartService = () => {
  const { data: cart, isLoading, isError } = useCartQuery();
  const { mutate: updateCart, isPending: isUpdating } = useUpdateCartMutation();
  const { mutate: removeItem, isPending: isDeleting } = useRemoveItemMutation();
  // <-- Mutación de Checkout
  const {
    mutateAsync: checkoutMutate,
    isPending: isCheckingOut,
    isError: isCheckoutError,
    reset: resetCheckoutError,
  } = useCheckoutMutation();

  const validItems = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.filter((item: CartItem) => item.product != null);
  }, [cart]);

  const { subtotal, totalItems } = useMemo(() => {
    const sub = validItems.reduce(
      (acc: number, item: CartItem) => acc + item.product.price * item.quantity,
      0
    );
    const count = validItems.reduce(
      (acc: number, item: CartItem) => acc + item.quantity,
      0
    );
    return { subtotal: sub, totalItems: count };
  }, [validItems]);

  const handleIncrement = (productId: string) => {
    updateCart({ productId, quantity: 1 });
  };

  const handleDecrement = (productId: string, currentQuantity: number) => {
    if (currentQuantity === 1) {
      if (window.confirm("¿Quieres eliminar este producto del carrito?")) {
        removeItem(productId);
      }
    } else {
      updateCart({ productId, quantity: -1 });
    }
  };

  const handleRemove = (productId: string) => {
    if (window.confirm("¿Seguro que quieres eliminar este producto?")) {
      removeItem(productId);
    }
  };

  // La lógica de checkout se traslada a CartPage.tsx para manejar el estado local
  // La función handleCheckout anterior ha sido eliminada.

  return {
    cart,
    validItems,
    isLoading,
    isError,
    isProcessing: isUpdating || isDeleting || isCheckingOut, // <-- Nuevo estado de procesamiento
    subtotal,
    totalItems,
    isEmpty: !validItems || validItems.length === 0,
    incrementItem: handleIncrement,
    decrementItem: handleDecrement,
    removeItem: handleRemove,
    checkoutMutate, // <-- Función de mutación expuesta
    isCheckingOut, // <-- Estado de carga expuesto
    isCheckoutError, // <-- Estado de error expuesto
    resetCheckoutError, // <-- Función para resetear error
  };
};
