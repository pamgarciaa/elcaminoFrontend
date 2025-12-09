import React, { useState, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  Container,
  Avatar,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/AuthContext";
import { IMAGE_URL } from "../../api/axios.client";
import { useCartCount, useCartQuery } from "../../hooks/useCartQuery";
import { useRemoveItemMutation } from "../../hooks/useCartMutations";
import type { CartItem } from "../../types";
import {
  LOGO_COLOR,
  PRIMARY_ACCENT,
  DARK_TEXT_COLOR,
} from "../../config/constants";

const LOGO_TEXT = "Mi pagina";

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hooks del carrito
  const { count: cartCount, isLoading: isCartCountLoading } = useCartCount();
  const { data: cart, isLoading: isCartLoading } = useCartQuery();
  const { mutate: removeItemMutate } = useRemoveItemMutation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsDrawerOpen(open);
    };

  const handleRemoveItem = (productId: string) => {
    removeItemMutate(productId);
  };

  // Cálculo del subtotal (solo items válidos)
  const validItems = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.filter(
      (item) => item.product !== null && item.product !== undefined
    );
  }, [cart]);

  const subtotal = useMemo(() => {
    return validItems.reduce((sum: number, item: CartItem) => {
      if (!item.product) return sum;
      return sum + item.product.price * item.quantity;
    }, 0);
  }, [validItems]);

  const getProfileImageUrl = (
    picturePath: string | undefined
  ): string | undefined => {
    if (!picturePath) return undefined;
    if (picturePath.startsWith("http")) {
      return picturePath;
    }
    return `${IMAGE_URL}/uploads/users/${picturePath}`;
  };

  const profileImageUrl = getProfileImageUrl(user?.profilePicture);

  // --- COMPONENTE DEL DRAWER (MINI CARRO) ---
  const cartDrawer = (
    <Box sx={{ width: 350 }} role="presentation">
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: LOGO_COLOR }}>
          Tu Carrito ({cartCount || 0})
        </Typography>
        <Button onClick={toggleDrawer(false)}>Cerrar</Button>
      </Box>
      <Divider />

      {isCartLoading && (
        <Box sx={{ p: 2 }}>
          <Typography>Cargando carrito...</Typography>
        </Box>
      )}

      {(!validItems || validItems.length === 0) && !isCartLoading && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body1">El carrito está vacío.</Typography>
        </Box>
      )}

      {validItems.length > 0 && (
        <List dense>
          {validItems.map((item) => (
            <ListItem
              key={item._id}
              sx={{
                pr: 8,
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={`${IMAGE_URL}/uploads/products/${item.product.image}`}
                alt={item.product.name}
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  mr: 2,
                  borderRadius: 1,
                }}
              />
              <ListItemText
                primary={item.product.name}
                secondary={`$${item.product.price.toFixed(2)} x ${
                  item.quantity
                }`}
                primaryTypographyProps={{
                  sx: { fontWeight: "bold", color: DARK_TEXT_COLOR },
                }}
                secondaryTypographyProps={{ sx: { color: PRIMARY_ACCENT } }}
              />

              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleRemoveItem(item.product._id)}
                size="small"
                sx={{
                  position: "absolute",
                  right: 5,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      <Divider />

      {validItems.length > 0 && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Subtotal:{" "}
            <Box
              component="span"
              sx={{ color: PRIMARY_ACCENT, fontWeight: "bold" }}
            >
              ${subtotal.toFixed(2)}
            </Box>
          </Typography>
          <Button
            component={RouterLink}
            to="/cart"
            variant="contained"
            fullWidth
            onClick={toggleDrawer(false)}
            sx={{
              mt: 1,
              backgroundColor: LOGO_COLOR,
              "&:hover": { backgroundColor: PRIMARY_ACCENT },
            }}
          >
            Ver Carrito Completo
          </Button>
        </Box>
      )}
    </Box>
  );
  // --- FIN DEL COMPONENTE DEL DRAWER ---

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid #e0e0e0" }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* PARTE IZQUIERDA: LOGO/NOMBRE DE LA PÁGINA */}
          <Typography
            variant="h5"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: LOGO_COLOR,
              fontWeight: 900,
              letterSpacing: "1px",
              fontStyle: "italic",
            }}
          >
            {LOGO_TEXT}
          </Typography>

          {/* PARTE DERECHA: ENLACES Y ACCIONES */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* ENLACES DE NAVEGACIÓN PÚBLICOS */}
            <Button component={RouterLink} to="/" color="inherit">
              Home
            </Button>
            <Button component={RouterLink} to="/blog" color="inherit">
              Blog
            </Button>

            {/* ⬅️ CAMBIO: Apunta a /tienda ⬅️ */}
            <Button component={RouterLink} to="/tienda" color="inherit">
              Tienda
            </Button>

            <Button component={RouterLink} to="/contacto" color="inherit">
              Contacto
            </Button>

            {isAuthenticated ? (
              /* BLOQUE DE USUARIO AUTENTICADO */
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}
              >
                {/* 1. AVATAR Y NOMBRE DEL USUARIO */}
                <Box
                  component={RouterLink}
                  to="/profile"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: LOGO_COLOR,
                    gap: 1,
                    p: 0.5,
                    borderRadius: 1,
                    "&:hover": { backgroundColor: PRIMARY_ACCENT + "10" },
                  }}
                >
                  <Avatar
                    src={profileImageUrl}
                    alt={user?.name || "Perfil"}
                    sx={{ width: 30, height: 30 }}
                  >
                    {user?.name ? user.name[0] : "U"}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.name}
                  </Typography>
                </Box>

                {/* 2. ICONO DEL CARRITO */}
                <IconButton
                  onClick={toggleDrawer(true)}
                  sx={{ color: PRIMARY_ACCENT }}
                  aria-label={`Carrito: ${cartCount} items`}
                  disabled={isCartCountLoading}
                >
                  <Badge
                    badgeContent={cartCount}
                    color="primary"
                    showZero={false}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                {/* 3. BOTÓN SALIR */}
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  size="small"
                  sx={{
                    ml: 1,
                    borderColor: PRIMARY_ACCENT,
                    color: PRIMARY_ACCENT,
                    "&:hover": {
                      borderColor: PRIMARY_ACCENT,
                      backgroundColor: PRIMARY_ACCENT + "10",
                    },
                  }}
                >
                  Salir
                </Button>
              </Box>
            ) : (
              /* BLOQUE DE USUARIO NO AUTENTICADO */
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}
              >
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="text"
                  sx={{ color: LOGO_COLOR }}
                >
                  Iniciar Sesión
                </Button>

                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  disableElevation
                  sx={{
                    backgroundColor: PRIMARY_ACCENT,
                    "&:hover": { backgroundColor: LOGO_COLOR },
                  }}
                >
                  Registrarse
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* COMPONENTE DRAWER */}
      <Drawer
        anchor={"right"}
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        {cartDrawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
