import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../../api/axios.client';
import { useAuth } from '../../context/AuthContext';
import { API_ROUTES } from '../../config/constants';
import { useSnackbar } from 'notistack';

type ProfileUpdateData = FormData; 

const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { updateUser } = useAuth(); 
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
            console.log("Respuesta del Backend al actualizar:", data); // 👁️ OJO AQUÍ EN CONSOLA

            // Invalida cache
            queryClient.invalidateQueries({ queryKey: ['userProfile'] }); 
            
            // 1. Detectar dónde está el usuario en la respuesta
            // Tu backend updateUserController devuelve: res.status(200).json(updatedUser);
            // Por tanto, 'data' ES el usuario directamente.
            let userDataToUpdate = data;

            // Si por casualidad el backend cambia y devuelve { user: ... }
            if (data.user) {
                userDataToUpdate = data.user;
            }

            // 2. Validación de seguridad antes de actualizar
            if (!userDataToUpdate || typeof userDataToUpdate !== 'object') {
                console.error("Respuesta inválida del servidor:", data);
                return; // No tocamos el contexto si la data es rara
            }

            // 3. Actualizar contexto (Mezcla segura gracias al nuevo AuthContext)
            updateUser(userDataToUpdate); 
            
            enqueueSnackbar('Perfil actualizado con éxito.', { variant: 'success' });
        },
        
        onError: (error: any) => {
            console.error("Error en la mutación:", error);
            const errorMessage = error.response?.data?.message || 'Error al actualizar el perfil.';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        },
    });
};

export default useUpdateProfile;