import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";
import { updateProfileService } from "../services/authService";
import { type ProfileFields } from "../validators/authSchema";
import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

type UpdateProfileParams = {
  data: ProfileFields;
  file: File | null;
};

const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation<any, AxiosError<ErrorResponse>, UpdateProfileParams>({
    mutationFn: ({ data, file }) => updateProfileService(data, file),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      login(data.user);

      enqueueSnackbar("Perfil actualizado con éxito.", { variant: "success" });
    },

    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Error al actualizar el perfil.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    },
  });
};

export default useUpdateProfile;
