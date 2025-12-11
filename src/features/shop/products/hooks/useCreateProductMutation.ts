import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

export const useCreateProductMutation = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      enqueueSnackbar("Producto creado exitosamente.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
      navigate("/");
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const errorMessage =
        err.response?.data?.message || "Error al crear el producto.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });
};
