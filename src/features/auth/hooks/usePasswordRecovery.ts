import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  forgotPasswordService,
  resetPasswordService,
} from "../services/authService";
import type {
  ForgotPasswordFields,
  ResetPasswordFields,
} from "../validators/authSchema";

interface ErrorResponse {
  message: string;
}

export const useForgotPasswordMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ForgotPasswordFields) => forgotPasswordService(data),
    onSuccess: (_, variables) => {
      enqueueSnackbar("PIN enviado a tu correo.", { variant: "success" });
      // Redirigimos a la página de resetear, pasando el email para facilitar al usuario
      navigate("/resetpassword", { state: { email: variables.email } });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const msg = error.response?.data?.message || "Error al enviar el correo.";
      enqueueSnackbar(msg, { variant: "error" });
    },
  });
};

export const useResetPasswordMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordFields) => resetPasswordService(data),
    onSuccess: () => {
      enqueueSnackbar("Contraseña actualizada correctamente. Inicia sesión.", {
        variant: "success",
      });
      navigate("/login");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const msg =
        error.response?.data?.message || "Error al resetear contraseña.";
      enqueueSnackbar(msg, { variant: "error" });
    },
  });
};
