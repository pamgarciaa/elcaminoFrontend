// src/features/auth/ProfileUpdatePage.tsx

import { useState, useEffect } from "react";
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
import type { ProfileFields } from "./auth.schema";
import { profileSchema } from "./auth.schema";
import { useAuth } from "../../context/AuthContext";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import { IMAGE_URL } from "../../api/axios.client";
import Loader from "../../components/common/Loader";
import React from "react";
import { useNavigate } from "react-router-dom";
import { PRIMARY_ACCENT, LOGO_COLOR } from "../../config/constants";

const ProfileUpdatePage = () => {
  const { user, loading } = useAuth();
  const { mutate, isPending } = useUpdateProfile();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username ?? "",
      name: user?.name ?? "",
      lastName: user?.lastName ?? "",
      address: user?.address ?? "",
      phone: user?.phone ?? "",
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
      });

      const picturePath = user.profilePicture;

      const finalUrl =
        (picturePath
          ? !picturePath.startsWith("http")
            ? `${IMAGE_URL}/uploads/users/${picturePath}`
            : picturePath
          : null) ?? null;

      setPreviewUrl(finalUrl);
    }
  }, [user, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else if (user?.profilePicture) {
      const picturePath = user.profilePicture;
      const finalUrl =
        (picturePath
          ? !picturePath.startsWith("http")
            ? `${IMAGE_URL}/uploads/users/${picturePath}`
            : picturePath
          : null) ?? null;
      setPreviewUrl(finalUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: ProfileFields) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof ProfileFields];

      if (value !== undefined && value !== null && key !== "profilePicture") {
        formData.append(key, String(value));
      }
    });

    if (file) {
      formData.append("profilePicture", file);
    }

    mutate(formData, {
      onSuccess: () => {
        navigate("/profile");
      },
    });
  };

  if (loading) return <Loader message="Cargando perfil..." />;

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          👤 Editar Perfil
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Contenedor Grid Principal */}
          <Grid container spacing={3}>
            {/* IMAGEN DE PERFIL */}
            {/* CORRECCIÓN: Usamos size={{ xs: 12 }} en lugar de item xs={12} */}
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
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <Input
                type="file"
                disableUnderline
                onChange={handleFileChange}
                fullWidth={false}
              />
            </Grid>

            {/* CAMPOS DE TEXTO */}
            {/* CORRECCIÓN: Usamos size={{ xs: 12, sm: 6 }} en todos los campos */}

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
              mt: 3,
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
