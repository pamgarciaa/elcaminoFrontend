import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

// Contexto y Validadores
import { useAuth } from "../context/AuthContext";
import { loginSchema, type LoginFormFields } from "../validators/authSchema";

// Servicios
import { loginUserService } from "../services/authService";

const LoginPage = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // React Hook Form con Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginSchema),
  });

  // Función que maneja el envío del formulario
  const onSubmit = async (data: LoginFormFields) => {
    setError("");
    try {
      // Usamos el servicio
      const response = await loginUserService(data);

      const userData = response.user;

      // Actualizar el estado global con el usuario logueado
      login(userData);

      enqueueSnackbar(`¡Bienvenido, ${userData.name}!`, { variant: "success" });

      // Redirigir a la página principal
      navigate("/");
    } catch (err: any) {
      // Manejo de errores
      const errorMessage =
        err.response?.data?.message || "Error al conectar con el servidor.";
      setError(errorMessage);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Iniciar Sesión
        </Typography>

        {/* Mostrar mensaje de error general si existe */}
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          {/* Campo de Email */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            autoComplete="email"
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
          />

          {/* Campo de Contraseña */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2 }}
          >
            {isSubmitting ? "Cargando..." : "Entrar"}
          </Button>

          {/* Enlaces de registro/olvido de contraseña */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ¿No tienes cuenta? Regístrate aquí.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
