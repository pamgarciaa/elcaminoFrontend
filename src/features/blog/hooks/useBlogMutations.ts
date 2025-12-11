import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  createBlogService,
  deleteBlogService,
  updateBlogService,
} from "../services/blogServices";

interface ErrorResponse {
  message: string;
}

// --- HOOK PARA ELIMINAR ---
export const useDeleteBlogMutation = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: deleteBlogService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      enqueueSnackbar("Blog eliminado correctamente", { variant: "success" });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const msg =
        error.response?.data?.message || "No se pudo eliminar el blog";
      enqueueSnackbar(msg, { variant: "error" });
    },
  });
};

// --- HOOK PARA CREAR ---
export const useCreateBlogMutation = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, file }: { data: any; file: File }) =>
      createBlogService(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      enqueueSnackbar("Post creado con éxito!", { variant: "success" });
      navigate("/blog");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const msg = error.response?.data?.message || "Error al crear el post";
      enqueueSnackbar(msg, { variant: "error" });
    },
  });
};

// --- HOOK PARA EDITAR ---
export const useUpdateBlogMutation = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      file,
    }: {
      id: string;
      data: any;
      file: File | null;
    }) => updateBlogService(id, data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      enqueueSnackbar("Blog actualizado con éxito", { variant: "success" });
      navigate("/blog");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const msg = error.response?.data?.message || "Error al actualizar";
      enqueueSnackbar(msg, { variant: "error" });
    },
  });
};
