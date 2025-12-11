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
import {
  createBlogSchema,
  type CreateBlogFields,
} from "../validators/blogSchema";
import { useCreateBlogMutation } from "../hooks/useBlogMutations";

const CreateBlogPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState("");

  const { mutate, isPending } = useCreateBlogMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBlogFields>({
    resolver: zodResolver(createBlogSchema),
  });

  const onSubmit = (data: CreateBlogFields) => {
    setLocalError("");

    if (!file) {
      setLocalError("Debes subir una imagen para el post.");
      return;
    }

    mutate({ data, file });
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

        {localError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Título del Blog"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

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

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Imagen Principal (Blog Image)
            </Typography>
            <Input
              type="file"
              fullWidth
              disableUnderline
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
            disabled={isPending}
            sx={{ mt: 3, py: 1.5 }}
          >
            {isPending ? "Publicando..." : "Publicar Post"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateBlogPage;
