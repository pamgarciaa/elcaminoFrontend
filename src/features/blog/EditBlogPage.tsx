// src/features/blog/EditBlogPage.tsx

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Input,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBlogSchema, type CreateBlogFields } from "./blog.schema"; // Reutilizamos el schema
import client, { IMAGE_URL } from "../../api/axios.client";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { PRIMARY_ACCENT, LOGO_COLOR } from "../../config/constants";
import Loader from "../../components/common/Loader";

const EditBlogPage = () => {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateBlogFields>({
    resolver: zodResolver(createBlogSchema),
  });

  // Cargar datos del blog existente
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await client.get(`/blogs/${id}`);
        const blog = data.data.blog;

        setValue("title", blog.title);
        setValue("content", blog.content);
        setCurrentImage(blog.image);
      } catch (err) {
        setError("No se pudo cargar el blog");
      } finally {
        setLoadingData(false);
      }
    };
    fetchBlog();
  }, [id, setValue]);

  const onSubmit = async (data: CreateBlogFields) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);

      if (file) {
        formData.append("blogImage", file);
      }

      await client.patch(`/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      enqueueSnackbar("Blog actualizado con éxito", { variant: "success" });
      navigate("/blog");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al actualizar");
    }
  };

  if (loadingData) return <Loader message="Cargando blog..." />;

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold", color: LOGO_COLOR }}
        >
          ✏️ Editar Blog
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Título"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Contenido"
            multiline
            rows={6}
            {...register("content")}
            error={!!errors.content}
            helperText={errors.content?.message}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Imagen Actual:
            </Typography>
            {currentImage && (
              <Box
                component="img"
                src={`${IMAGE_URL}/${currentImage.replace(/\\/g, "/")}`}
                sx={{ width: 100, borderRadius: 1, mb: 2 }}
              />
            )}

            <Typography variant="subtitle2">
              Cambiar Imagen (Opcional)
            </Typography>
            <Input
              type="file"
              fullWidth
              disableUnderline
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files.length > 0)
                  setFile(target.files[0]);
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mt: 3,
              py: 1.5,
              backgroundColor: PRIMARY_ACCENT,
              "&:hover": { backgroundColor: LOGO_COLOR },
            }}
          >
            {isSubmitting ? "Guardando..." : "Actualizar Post"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditBlogPage;
