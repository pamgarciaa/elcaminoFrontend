import { useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import {
  resetPasswordSchema,
  type ResetPasswordFields,
} from "../validators/authSchema";
import { useResetPasswordMutation } from "../hooks/usePasswordRecovery";
import { LOGO_COLOR, PRIMARY_ACCENT } from "../../../config/constants";

const ResetPasswordPage = () => {
  const { mutate, isPending } = useResetPasswordMutation();
  const location = useLocation();

  // Intentamos obtener el email si venimos de la pagina anterior
  const emailFromState = location.state?.email || "";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromState,
      pin: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (emailFromState) {
      setValue("email", emailFromState);
    }
  }, [emailFromState, setValue]);

  const onSubmit = (data: ResetPasswordFields) => {
    mutate(data);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold", color: LOGO_COLOR }}
        >
          Nueva Contraseña
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Ingresa el PIN que recibiste y tu nueva contraseña.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Campo Email */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Correo Electrónico"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Campo PIN */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="PIN de Seguridad"
            {...register("pin")}
            error={!!errors.pin}
            helperText={errors.pin?.message}
          />

          {/* Campo Password - CON AUTOCOMPLETE AGREGADO */}
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="Nueva Contraseña"
            autoComplete="new-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {/* Campo Confirmar Password - CON AUTOCOMPLETE AGREGADO */}
          <TextField
            margin="normal"
            required
            fullWidth
            type="password"
            label="Confirmar Contraseña"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isPending}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: PRIMARY_ACCENT,
              "&:hover": { bgcolor: LOGO_COLOR },
            }}
          >
            {isPending ? "Actualizando..." : "Cambiar Contraseña"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;
