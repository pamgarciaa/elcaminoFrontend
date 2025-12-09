import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Input,
  Grid,
  Alert,
} from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  type CreateProductFields,
} from "../../features/shop/product.schema";
import client from "../../api/axios.client";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { PRIMARY_ACCENT, LOGO_COLOR } from "../../config/constants";

const CreateProductPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFields>({
    // ⬅️ SOLUCIÓN: 'as any' elimina el conflicto estricto entre string/number
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      category: "",
      // Inicializamos como string vacío para que el input HTML no se queje
      // Zod lo convertirá a número al validar.
      price: "" as unknown as number,
      stock: "" as unknown as number,
    },
  });

  const onSubmit: SubmitHandler<CreateProductFields> = async (data) => {
    setError("");

    if (!file) {
      setError("La imagen del producto es obligatoria.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("stock", String(data.stock));
      formData.append("category", data.category);
      formData.append("productImage", file);

      await client.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      enqueueSnackbar("Producto creado exitosamente.", { variant: "success" });
      navigate("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error al crear el producto.";
      setError(errorMessage);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold", color: LOGO_COLOR }}
        >
          📦 Nuevo Producto
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* NOMBRE */}
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Nombre del Producto"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            {/* DESCRIPCIÓN */}
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            {/* PRECIO Y STOCK */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Precio ($)"
                {...register("price")}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Stock Disponible"
                {...register("stock")}
                error={!!errors.stock}
                helperText={errors.stock?.message}
              />
            </Grid>

            {/* CATEGORÍA */}
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Categoría (Ej: Ropa, Electrónica)"
                {...register("category")}
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            </Grid>

            {/* IMAGEN */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Imagen del Producto *
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
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mt: 4,
              py: 1.5,
              backgroundColor: PRIMARY_ACCENT,
              "&:hover": { backgroundColor: LOGO_COLOR },
            }}
          >
            {isSubmitting ? "Guardando..." : "Publicar Producto"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateProductPage;
