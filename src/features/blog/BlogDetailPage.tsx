import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  CardMedia,
  Alert,
} from "@mui/material";
import { IMAGE_URL } from "../../api/axios.client";
import Loader from "../../components/common/Loader";
import { useBlogByIdQuery } from "../../hooks/useBlogsQuery"; // ⬅️ NUEVO HOOK

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // 1. Usamos el hook específico por ID
  const { data: blog, isLoading, isError } = useBlogByIdQuery(id);

  if (isLoading) return <Loader message="Cargando artículo..." />;

  if (isError || !blog)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">No se encontró el artículo solicitado.</Alert>
      </Container>
    );

  const content = { __html: blog.content.replace(/\n/g, "<br />") };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          {blog.title}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Por {blog.author?.name || blog.author?.username || "Escritor Anónimo"}{" "}
          el {new Date(blog.createdAt).toLocaleDateString()}
        </Typography>

        <CardMedia
          component="img"
          image={`${IMAGE_URL}/${blog.image.replace(/\\/g, "/")}`}
          alt={blog.title}
          sx={{ maxHeight: 400, objectFit: "cover", borderRadius: 2, mb: 4 }}
        />

        <Box
          sx={{
            mt: 4,
            lineHeight: 1.8,
            fontSize: "1.1rem",
            color: "text.primary",
          }}
          dangerouslySetInnerHTML={content}
        />
      </Paper>
    </Container>
  );
};

export default BlogDetailPage;
