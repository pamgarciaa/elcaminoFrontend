import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Input,
  Avatar,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import type { ProfileFields } from "../validators/authSchema";
import { profileSchema } from "../validators/authSchema";
import { useAuth } from "../context/AuthContext";
import useUpdateProfile from "../hooks/useUpdateProfile";
import Loader from "../../../components/common/Loader";
import { PRIMARY_ACCENT, LOGO_COLOR } from "../../../config/constants";
import { getUserProfileUrl } from "../utils/userUtils";

const ProfileUpdatePage = () => {
  const { user, loading } = useAuth();
  const { mutate, isPending } = useUpdateProfile();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      name: "",
      lastName: "",
      address: "",
      phone: "",
      password: "", // Inicializamos vacío
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.username ?? "",
        name: user.name ?? "",
        lastName: user.lastName ?? "",
        address: user.address ?? "",
        phone: user.phone ?? "",
        password: "", // Resetamos password a vacío siempre
      });

      const initialUrl = getUserProfileUrl(user.profilePicture);
      if (initialUrl) setPreviewUrl(initialUrl);
    }
  }, [user, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      const originalUrl = getUserProfileUrl(user?.profilePicture);
      setPreviewUrl(originalUrl || null);
    }
  };

  const onSubmit = (data: ProfileFields) => {
    // Si el campo password está vacío, lo eliminamos para no enviar string vacío al backend
    if (!data.password || data.password.trim() === "") {
      delete data.password;
    }

    mutate(
      { data, file },
      {
        onSuccess: () => {
          navigate("/profile");
        },
      }
    );
  };

  if (loading) return <Loader message="Cargando perfil..." />;

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold", color: LOGO_COLOR }}
        >
          Editar Perfil
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Contenedor Grid Principal */}
          <Grid container spacing={3}>
            {/* IMAGEN DE PERFIL */}
            <Grid
              size={{ xs: 12 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                src={previewUrl || undefined}
                alt={user?.username}
                sx={{ width: 100, height: 100, mb: 2, bgcolor: PRIMARY_ACCENT }}
              />
              <Input
                type="file"
                disableUnderline
                onChange={handleFileChange}
                inputProps={{ accept: "image/*" }}
                fullWidth={false}
              />
            </Grid>

            {/* SECCIÓN DATOS DE CUENTA */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h6"
                sx={{
                  color: PRIMARY_ACCENT,
                  mt: 1,
                  borderBottom: `1px solid ${PRIMARY_ACCENT}`,
                }}
              >
                Datos de Cuenta
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Username"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email (No editable)"
                value={user?.email || ""}
                disabled
              />
            </Grid>

            {/* CAMPO DE NUEVA CONTRASEÑA */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="password"
                label="Nueva Contraseña (Opcional)"
                placeholder="Escribe solo si deseas cambiarla"
                {...register("password")}
                error={!!errors.password}
                helperText={
                  errors.password?.message ||
                  "Deja en blanco para mantener la actual."
                }
                autoComplete="new-password"
              />
            </Grid>

            {/* SECCIÓN DATOS PERSONALES */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h6"
                sx={{
                  color: PRIMARY_ACCENT,
                  mt: 2,
                  borderBottom: `1px solid ${PRIMARY_ACCENT}`,
                }}
              >
                Información Personal
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Nombre"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Apellido"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Teléfono"
                {...register("phone")}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Dirección"
                {...register("address")}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isPending}
            sx={{
              mt: 4,
              py: 1.5,
              backgroundColor: PRIMARY_ACCENT,
              "&:hover": { backgroundColor: LOGO_COLOR },
            }}
          >
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfileUpdatePage;
