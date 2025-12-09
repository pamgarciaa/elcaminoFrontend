// src/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../api/axios.client';
import { useAuth } from '../context/AuthContext';
import { API_ROUTES } from '../config/constants';
import { useSnackbar } from 'notistack';

type ProfileUpdateData = FormData; 

const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { login } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    return useMutation<any, Error, ProfileUpdateData>({
        mutationFn: async (data) => {
            const response = await client.patch(
                `${API_ROUTES.USERS}/update/`, 
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return response.data;
        },
        
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] }); 
            login(data.user); 
            enqueueSnackbar('Perfil actualizado con éxito.', { variant: 'success' });
        },
        
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Error al actualizar el perfil.';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        },
    });
};

export default useUpdateProfile;