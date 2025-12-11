import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFields,
} from "../validators/authSchema";
import { useForgotPasswordMutation } from "../hooks/usePasswordRecovery";
import { LOGO_COLOR, PRIMARY_ACCENT } from "../../../config/constants";

const ForgotPasswordPage = () => {
  const { mutate, isPending } = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFields>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFields) => {
    mutate(data);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold", color: LOGO_COLOR }}
        >
          Recuperar Contraseña
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Ingresa tu email y te enviaremos un PIN de seguridad.
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Correo Electrónico"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
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
            {isPending ? "Enviando..." : "Enviar PIN"}
          </Button>

          <Link
            component={RouterLink}
            to="/login"
            variant="body2"
            sx={{ color: LOGO_COLOR }}
          >
            Volver a Iniciar Sesión
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
