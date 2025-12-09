import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Input,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBlogSchema, type CreateBlogFields } from "./blog.schema";
import client from "../../api/axios.client";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const CreateBlogPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // 1. Inicializa React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateBlogFields>({
    resolver: zodResolver(createBlogSchema),
  });

  // 2. Función de envío (maneja la lógica de FormData)
  const onSubmit = async (data: CreateBlogFields) => {
    setError("");

    if (!file) {
      setError("Debes subir una imagen para el post.");
      return;
    }

    try {
      // Usar FormData para enviar datos multipart/form-data
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      // El nombre del campo 'blogImage' debe coincidir con el middleware multer de tu backend
      formData.append("blogImage", file);

      await client.post("/blogs", formData, {
        // Encabezado necesario para que el servidor reconozca los datos como un archivo
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      enqueueSnackbar("Post de blog creado con éxito!", { variant: "success" });
      navigate("/blog");
    } catch (err: any) {
      // Manejo de errores de backend (ej. 403 Forbidden si el rol no es Admin/Moderator)
      const errorMessage =
        err.response?.data?.message || "Error al conectar con el servidor.";
      setError(errorMessage);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          ➕ Crear Nuevo Post
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* CAMPO TÍTULO */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Título del Blog"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          {/* CAMPO CONTENIDO */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Contenido del Blog"
            multiline
            rows={6}
            {...register("content")}
            error={!!errors.content}
            helperText={errors.content?.message}
            sx={{ mb: 3 }}
          />

          {/* CAMPO IMAGEN (MANEJO DE ARCHIVOS) */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Imagen Principal (Blog Image)
            </Typography>
            <Input
              type="file"
              fullWidth
              disableUnderline
              // Guardar el archivo seleccionado en el estado local 'file'
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files.length > 0) {
                  setFile(target.files[0]);
                } else {
                  setFile(null);
                }
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 3, py: 1.5 }}
          >
            {isSubmitting ? "Publicando..." : "Publicar Post"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateBlogPage;
