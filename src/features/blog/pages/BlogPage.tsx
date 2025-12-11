import { useState } from "react";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import {
  USER_ROLES,
  PRIMARY_ACCENT,
  LOGO_COLOR,
} from "../../../config/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDeleteBlogMutation } from "../hooks/useBlogMutations";
import { useBlogsQuery } from "../hooks/useBlogsQuery";
import Loader from "../../../components/common/Loader";
import { getImageUrl } from "../../../utils/imageUtils";

const BlogPage = () => {
  const { user } = useAuth();
  const { data: blogs, isLoading, isError } = useBlogsQuery();
  const { mutate: deleteBlog } = useDeleteBlogMutation();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isAdminOrModerator =
    user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.MODERATOR;

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteBlog(deleteId);
      setDeleteId(null);
    }
  };

  if (isLoading) return <Loader message="Cargando noticias..." />;

  if (isError)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Error al cargar las noticias.</Alert>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: LOGO_COLOR }}
        >
          Blog & Noticias
        </Typography>

        {isAdminOrModerator && (
          <Button
            component={RouterLink}
            to="/blog/new"
            variant="contained"
            startIcon={<AddCircleIcon />}
            sx={{
              backgroundColor: PRIMARY_ACCENT,
              "&:hover": { backgroundColor: LOGO_COLOR },
            }}
          >
            Nuevo Post
          </Button>
        )}
      </Box>

      {!blogs || blogs.length === 0 ? (
        <Alert severity="info">No hay publicaciones disponibles aún.</Alert>
      ) : (
        <Grid container spacing={4}>
          {blogs.map((blog) => (
            /* CORRECCIÓN AQUÍ: Se eliminó 'item' y se usa 'size={{...}}' */
            <Grid key={blog._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={getImageUrl(blog.image)}
                  alt={blog.title}
                  sx={{ objectFit: "cover" }}
                />

                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography
                    component={RouterLink}
                    to={`/blog/${blog._id}`}
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      textDecoration: "none",
                      color: LOGO_COLOR,
                      mb: 1,
                      lineHeight: 1.2,
                      "&:hover": { color: PRIMARY_ACCENT },
                    }}
                  >
                    {blog.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 2, display: "block" }}
                  >
                    Por{" "}
                    {blog.author?.name || blog.author?.username || "Anónimo"} •{" "}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {blog.content.substring(0, 120)}...
                  </Typography>

                  <Box sx={{ mt: "auto" }}>
                    <Button
                      component={RouterLink}
                      to={`/blog/${blog._id}`}
                      size="small"
                      sx={{ color: PRIMARY_ACCENT }}
                    >
                      Leer más →
                    </Button>
                  </Box>
                </CardContent>

                {isAdminOrModerator && (
                  <CardActions
                    sx={{
                      justifyContent: "flex-end",
                      borderTop: "1px solid #eee",
                      px: 2,
                    }}
                  >
                    <Tooltip title="Editar">
                      <IconButton
                        component={RouterLink}
                        to={`/blog/edit/${blog._id}`}
                        size="small"
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleDeleteClick(blog._id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Eliminar publicación?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que quieres eliminar este post? Esta acción no se
            puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BlogPage;
