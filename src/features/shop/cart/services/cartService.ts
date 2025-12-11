import { useMemo } from "react";
import { useCartQuery } from "../hooks/useCartQuery";
import {
  useUpdateCartMutation,
  useRemoveItemMutation,
} from "../hooks/useCartMutations";
import type { CartItem } from "../types/cartTypes"; // <--- Importar el tipo correcto

export const useCartService = () => {
  const { data: cart, isLoading, isError } = useCartQuery();
  const { mutate: updateCart, isPending: isUpdating } = useUpdateCartMutation();
  const { mutate: removeItem, isPending: isDeleting } = useRemoveItemMutation();

  // Uso de CartItem en lugar de any
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

  const handleCheckout = () => {
    alert("¡Funcionalidad de pago próximamente!");
  };

  return {
    cart,
    validItems,
    isLoading,
    isError,
    isProcessing: isUpdating || isDeleting,
    subtotal,
    totalItems,
    isEmpty: !validItems || validItems.length === 0,
    incrementItem: handleIncrement,
    decrementItem: handleDecrement,
    removeItem: handleRemove,
    checkout: handleCheckout,
  };
};
