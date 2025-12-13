import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  Divider,
  Alert,
  Card,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

import {
  IMAGE_URL,
  PRIMARY_ACCENT,
  LOGO_COLOR,
} from "../../../../config/constants";
import Loader from "../../../../components/common/Loader";
import { useCartService } from "../services/cartService";
import { formatCurrency } from "../../../../utils/imageUtils";
import { useCheckoutMutation } from "../hooks/useCartMutations";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const CartPage = () => {
  const {
    validItems,
    isLoading,
    isError,
    isProcessing,
    subtotal,
    totalItems,
    isEmpty,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCartService();

  const checkoutMutation = useCheckoutMutation();
  const [shippingAddress, setShippingAddress] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const isCurrentlyProcessing = isProcessing || checkoutMutation.isPending;

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      checkoutMutation.reset();
      checkoutMutation.mutate({ shippingAddress: "" });
      return;
    }

    try {
      await checkoutMutation.mutateAsync({ shippingAddress });
      setShowSuccess(true);
    } catch (error) {
      console.error("Fallo al procesar la compra", error);
    }
  };

  if (isLoading) return <Loader message="Cargando tu carrito..." />;
  if (isError)
    return <Alert severity="error">Error al cargar el carrito.</Alert>;

  if (showSuccess) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 80, color: PRIMARY_ACCENT, mb: 3 }}
          />
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: LOGO_COLOR, fontWeight: "bold" }}
          >
            ¡Gracias por tu compra!
          </Typography>
          <Typography color="text.secondary" paragraph>
            Tu pedido ha sido procesado con éxito. Pronto recibirás un email con
            la confirmación y los detalles del pedido.
          </Typography>
          <Button
            component={RouterLink}
            to="/orders"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              bgcolor: PRIMARY_ACCENT,
              "&:hover": { bgcolor: LOGO_COLOR },
            }}
          >
            Ver mis Pedidos
          </Button>
        </Paper>
      </Container>
    );
  }

  // BLOQUE DE RENDERIZADO
  if (isEmpty) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: LOGO_COLOR, fontWeight: "bold" }}
          >
            Tu carrito está vacío
          </Typography>
          <Typography color="text.secondary" paragraph>
            Parece que aún no has añadido nada. ¡Explora nuestra tienda!
          </Typography>
          <Button
            component={RouterLink}
            to="/tienda"
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              bgcolor: PRIMARY_ACCENT,
              "&:hover": { bgcolor: LOGO_COLOR },
            }}
          >
            Ir a la Tienda
          </Button>
        </Paper>
      </Container>
    );
  }

  // BLOQUE DE RENDERIZADO: CARRITO CON PRODUCTOS
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 4, fontWeight: "bold", color: LOGO_COLOR }}
      >
        Tu Carrito de Compras
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {validItems.map((item: any) => (
              <Card
                key={item._id}
                elevation={2}
                sx={{ display: "flex", p: 2, alignItems: "center" }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                  image={`${IMAGE_URL}/uploads/products/${item.product.image}`}
                  alt={item.product.name}
                />

                <CardContent sx={{ flexGrow: 1, px: 2, py: 0 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={LOGO_COLOR}
                    sx={{ lineHeight: 1.2, mb: 0.5 }}
                  >
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categoría: {item.product.category}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color={PRIMARY_ACCENT}
                    fontWeight="bold"
                    sx={{ mt: 0.5 }}
                  >
                    {formatCurrency(item.product.price)}
                  </Typography>
                </CardContent>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}
                >
                  <IconButton
                    onClick={() =>
                      decrementItem(item.product._id, item.quantity)
                    }
                    disabled={isCurrentlyProcessing}
                    color="primary"
                    size="small"
                    sx={{ border: "1px solid #ccc" }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography
                    fontWeight="bold"
                    sx={{ minWidth: "24px", textAlign: "center" }}
                  >
                    {item.quantity}
                  </Typography>

                  <IconButton
                    onClick={() => incrementItem(item.product._id)}
                    disabled={isCurrentlyProcessing}
                    color="primary"
                    size="small"
                    sx={{
                      border: "1px solid #ccc",
                      bgcolor: PRIMARY_ACCENT,
                      color: "white",
                      "&:hover": { bgcolor: LOGO_COLOR },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    textAlign: "right",
                    minWidth: "80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {formatCurrency(item.product.price * item.quantity)}
                  </Typography>
                  <IconButton
                    onClick={() => removeItem(item.product._id)}
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                    disabled={isCurrentlyProcessing}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ p: 3, position: "sticky", top: 80 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color={LOGO_COLOR}
            >
              Resumen del Pedido
            </Typography>
            <Divider sx={{ my: 2 }} />

            {/* Campo de dirección de envío */}
            <TextField
              label="Dirección de Envío Requerida"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              fullWidth
              margin="normal"
              required
              size="small"
              error={checkoutMutation.isError && shippingAddress.trim() === ""}
              helperText={
                checkoutMutation.isError && shippingAddress.trim() === ""
                  ? "La dirección de envío es obligatoria para el checkout."
                  : ""
              }
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>Artículos ({totalItems})</Typography>
              <Typography fontWeight="bold">
                {formatCurrency(subtotal)}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography>Envío</Typography>
              <Typography color="text.secondary">Gratis</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}
            >
              <Typography variant="h6" fontWeight="bold">
                Total
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={PRIMARY_ACCENT}>
                {formatCurrency(subtotal)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handleCheckout}
              disabled={isCurrentlyProcessing || isEmpty}
              sx={{
                bgcolor: LOGO_COLOR,
                py: 1.5,
                mb: 2,
                "&:hover": { bgcolor: PRIMARY_ACCENT },
              }}
            >
              {checkoutMutation.isPending ? "Tramitando..." : "Tramitar Pedido"}
            </Button>

            <Button
              component={RouterLink}
              to="/tienda"
              fullWidth
              startIcon={<ArrowBackIcon />}
              sx={{ color: "text.secondary" }}
            >
              Seguir Comprando
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
