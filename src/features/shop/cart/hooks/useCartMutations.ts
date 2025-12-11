import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../../../api/axios.client";
import { useSnackbar } from "notistack";
import { API_ROUTES } from "../../../../config/constants";
import { AxiosError } from "axios";

const CART_QUERY_KEY = ["cart"];

type UpdateCartData = { productId: string; quantity: number };

interface ErrorResponse {
  message: string;
}

const updateCart = async (data: UpdateCartData) => {
  const response = await client.post(`${API_ROUTES.CART}/add`, data);
  return response.data;
};

const removeItemFromCart = async (productId: string) => {
  const response = await client.delete(`${API_ROUTES.CART}/${productId}`);
  return response.data;
};

export const useAddToCartMutation = () => {
  return useUpdateCartMutation();
};

export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: updateCart,

    onSuccess: (_, variables) => {
      const message =
        variables.quantity > 0
          ? "Carrito actualizado."
          : "Item eliminado del carrito.";
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      enqueueSnackbar(message, { variant: "success" });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar el carrito.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });
};

export const useRemoveItemMutation = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: removeItemFromCart,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      enqueueSnackbar("Producto eliminado del carrito.", { variant: "info" });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage =
        error.response?.data?.message || "Error al eliminar el producto.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });
};
