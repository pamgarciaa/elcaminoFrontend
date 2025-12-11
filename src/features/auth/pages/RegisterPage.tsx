import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Avatar,
  Input,
  Alert,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFields } from "../validators/authSchema";
import { useSnackbar } from "notistack";
import { LOGO_COLOR, PRIMARY_ACCENT } from "../../../config/constants";
import { registerUserService } from "../services/authService";

const RegisterPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: RegisterFields) => {
    setServerError("");

    try {
      await registerUserService(data, file);

      enqueueSnackbar("¡Cuenta creada con éxito! Por favor inicia sesión.", {
        variant: "success",
      });
      navigate("/login");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Error al registrarse. Inténtalo de nuevo.";
      setServerError(errorMessage);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
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
          variant="h4"
          sx={{ mb: 1, fontWeight: "bold", color: LOGO_COLOR }}
        >
          Crear Cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Únete a nuestra comunidad de peregrinos
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ width: "100%" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              src={previewUrl || undefined}
              sx={{ width: 80, height: 80, mb: 2, bgcolor: PRIMARY_ACCENT }}
            />
            <Typography variant="caption" gutterBottom>
              Foto de Perfil (Opcional)
            </Typography>
            <Input
              type="file"
              disableUnderline
              onChange={handleFileChange}
              inputProps={{ accept: "image/*" }}
              sx={{ width: "200px" }}
            />
          </Box>

          <Grid container spacing={2}>
            {/* Usuario */}
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Nombre de Usuario"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid>

            {/* Nombre y Apellido */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                label="Nombre"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                label="Apellido"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                type="email"
                label="Correo Electrónico"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            {/* Contraseña */}
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                type="password"
                label="Contraseña"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mt: 4,
              mb: 2,
              py: 1.5,
              backgroundColor: PRIMARY_ACCENT,
              "&:hover": { backgroundColor: LOGO_COLOR },
            }}
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid size="auto">
              <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                sx={{ color: LOGO_COLOR }}
              >
                ¿Ya tienes una cuenta? Inicia Sesión
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
