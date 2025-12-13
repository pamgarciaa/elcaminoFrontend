import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useAddToCartMutation } from "../../cart/hooks/useCartMutations";
import { useProductsQuery } from "../hooks/useProductsQuery";
import {
  PRIMARY_ACCENT,
  LOGO_COLOR,
  USER_ROLES,
} from "../../../../config/constants";
import { Link as RouterLink } from "react-router-dom";
import Loader from "../../../../components/common/Loader";
import { useAuth } from "../../../auth/context/AuthContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getImageUrl, formatCurrency } from "../../../../utils/imageUtils"; // <-- Importar formatCurrency

const ProductsPage = () => {
  const { data: products, isLoading, isError, error } = useProductsQuery();
  const { mutate: addToCartMutate, isPending } = useAddToCartMutation();

  const { user } = useAuth();
  const isAdmin =
    user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.MODERATOR;

  const handleAddToCart = (productId: string) => {
    addToCartMutate({ productId, quantity: 1 });
  };

  if (isLoading) return <Loader message="Buscando productos de la tienda..." />;

  if (isError) {
    const errorMessage = error.message || "Error desconocido.";
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{errorMessage}</Alert>
      </Container>
    );
  }

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
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Colección
        </Typography>

        {isAdmin && (
          <Button
            component={RouterLink}
            to="/products/new"
            variant="contained"
            startIcon={<AddCircleIcon />}
            sx={{
              backgroundColor: LOGO_COLOR,
              "&:hover": { backgroundColor: PRIMARY_ACCENT },
            }}
          >
            Nuevo Producto
          </Button>
        )}
      </Box>

      {!products || products.length === 0 ? (
        <Alert severity="info">No hay productos disponibles.</Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "none",
                  bgcolor: "transparent",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                <Box
                  component={RouterLink}
                  to={`/products/${product._id}`}
                  sx={{ textDecoration: "none" }}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={getImageUrl(`uploads/products/${product.image}`)}
                    alt={product.name}
                    sx={{ borderRadius: 2, objectFit: "cover" }}
                  />
                </Box>

                <CardContent sx={{ px: 0, flexGrow: 1 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Typography
                      variant="h6"
                      component={RouterLink}
                      to={`/products/${product._id}`}
                      sx={{
                        fontWeight: 600,
                        textDecoration: "none",
                        color: LOGO_COLOR,
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: PRIMARY_ACCENT }}>
                      {formatCurrency(product.price)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, mb: 2 }}
                  >
                    {product.description.substring(0, 80)}...
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: PRIMARY_ACCENT,
                      "&:hover": { backgroundColor: LOGO_COLOR },
                    }}
                    onClick={() => handleAddToCart(product._id)}
                    disabled={isPending}
                  >
                    {isPending ? "Añadiendo..." : "Añadir al Carrito"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProductsPage;
