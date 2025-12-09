// src/features/blog/hooks/useBlogMutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../api/axios.client';
import { useSnackbar } from 'notistack';
import { API_ROUTES } from '../config/constants';

const deleteBlog = async (id: string) => {
    await client.delete(`${API_ROUTES.BLOGS}/${id}`);
};

export const useDeleteBlogMutation = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: deleteBlog,
        onSuccess: () => {
            // Recargar la lista de blogs automáticamente
            queryClient.invalidateQueries({ queryKey: ['blogs'] });
            enqueueSnackbar('Blog eliminado correctamente', { variant: 'success' });
        },
        onError: (error: any) => {
            const msg = error.response?.data?.message || 'No se pudo eliminar el blog';
            enqueueSnackbar(msg, { variant: 'error' });
        }
    });
};