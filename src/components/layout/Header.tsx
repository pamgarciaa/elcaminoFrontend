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
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useAuth } from "../../features/auth/context/AuthContext";
import { IMAGE_URL, LOGO_COLOR, PRIMARY_ACCENT } from "../../config/constants";
import {
  useCartQuery,
  useCartCount,
} from "../../features/shop/cart/hooks/useCartQuery";
import {
  useRemoveItemMutation,
  useUpdateCartMutation,
} from "../../features/shop/cart/hooks/useCartMutations";
import type { CartItem } from "../../features/shop/cart/types/cartTypes";

// IMPORTAMOS EL NUEVO COMPONENTE
import CartDrawerContent from "../../features/shop/cart/components/CartDrawerContent";

const LOGO_TEXT = "Mi pagina";

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Lógica del carrito
  const { count: cartCount } = useCartCount();
  const { data: cart, isLoading: isCartLoading } = useCartQuery();
  const { mutate: removeItemMutate, isPending: isDeleting } =
    useRemoveItemMutation();
  const { mutate: updateCartMutate, isPending: isUpdating } =
    useUpdateCartMutation();

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

  // Handlers para el drawer
  const handleRemoveItem = (productId: string) => removeItemMutate(productId);
  const handleIncrement = (productId: string) =>
    updateCartMutate({ productId, quantity: 1 });
  const handleDecrement = (productId: string, currentQuantity: number) => {
    if (currentQuantity === 1) {
      if (window.confirm("¿Eliminar del carrito?")) removeItemMutate(productId);
    } else {
      updateCartMutate({ productId, quantity: -1 });
    }
  };

  const validItems = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.filter((item) => item.product != null);
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
    if (picturePath.startsWith("http")) return picturePath;
    return `${IMAGE_URL}/uploads/users/${picturePath}`;
  };

  const profileImageUrl = getProfileImageUrl(user?.profilePicture);

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid #e0e0e0" }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* LOGO */}
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

          {/* MENU */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button component={RouterLink} to="/" color="inherit">
              Home
            </Button>
            <Button component={RouterLink} to="/blog" color="inherit">
              Blog
            </Button>
            <Button component={RouterLink} to="/tienda" color="inherit">
              Tienda
            </Button>
            <Button component={RouterLink} to="/kits" color="inherit">
              Kits
            </Button>
            <Button component={RouterLink} to="/contacto" color="inherit">
              Contacto
            </Button>

            {isAuthenticated ? (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}
              >
                {/* Perfil */}
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
                    alt={user?.name}
                    sx={{ width: 30, height: 30 }}
                  >
                    {user?.name ? user.name[0] : "U"}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user?.name}
                  </Typography>
                </Box>

                {/* Icono Carrito */}
                <IconButton
                  onClick={toggleDrawer(true)}
                  sx={{ color: PRIMARY_ACCENT }}
                >
                  <Badge
                    badgeContent={cartCount}
                    color="primary"
                    showZero={false}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                {/* Botón Salir */}
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

      {/* DRAWER IMPLEMENTADO CON EL COMPONENTE NUEVO */}
      <Drawer
        anchor={"right"}
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <CartDrawerContent
          isLoading={isCartLoading}
          validItems={validItems}
          cartCount={cartCount}
          subtotal={subtotal}
          onClose={() => setIsDrawerOpen(false)}
          onRemove={handleRemoveItem}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          isProcessing={isDeleting || isUpdating}
        />
      </Drawer>
    </AppBar>
  );
};

export default Header;
