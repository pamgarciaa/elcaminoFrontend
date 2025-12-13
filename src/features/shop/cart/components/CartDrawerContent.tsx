import {
  Box,
  Typography,
  Button,
  CircularProgress,
  List,
  ListItem,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  LOGO_COLOR,
  PRIMARY_ACCENT,
  DARK_TEXT_COLOR,
  IMAGE_URL,
} from "../../../../config/constants";
import type { CartItem } from "../types/cartTypes";
import { formatCurrency } from "../../../../utils/imageUtils"; // <-- Importar formatCurrency

interface CartDrawerContentProps {
  isLoading: boolean;
  validItems: CartItem[];
  cartCount: number;
  subtotal: number;
  onClose: () => void;
  onRemove: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string, qty: number) => void;
  isProcessing: boolean;
}

const CartDrawerContent = ({
  isLoading,
  validItems,
  cartCount,
  subtotal,
  onClose,
  onRemove,
  onIncrement,
  onDecrement,
  isProcessing,
}: CartDrawerContentProps) => {
  return (
    <Box
      sx={{
        width: { xs: "100vw", sm: 360 },
        maxWidth: { xs: "100%", sm: 360 },
      }}
      role="presentation"
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#f9f9f9",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: LOGO_COLOR }}>
          Tu Carrito ({cartCount || 0})
        </Typography>
        <Button onClick={onClose} sx={{ color: PRIMARY_ACCENT }}>
          Cerrar
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress size={30} sx={{ color: PRIMARY_ACCENT }} />
        </Box>
      )}

      {(!validItems || validItems.length === 0) && !isLoading && (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            El carrito está vacío.
          </Typography>
          <Button
            onClick={onClose}
            component={RouterLink}
            to="/tienda"
            sx={{ mt: 2 }}
          >
            Ir a comprar
          </Button>
        </Box>
      )}

      {validItems.length > 0 && (
        <List sx={{ px: 2, pb: 10 }}>
          {validItems.map((item) => (
            <ListItem
              key={item._id}
              alignItems="flex-start"
              sx={{
                py: 2,
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                gap: 2,
              }}
            >
              <Box
                component="img"
                src={`${IMAGE_URL}/uploads/products/${item.product.image}`}
                alt={item.product.name}
                sx={{
                  width: 70,
                  height: 70,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />

              <Box sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: "bold",
                      color: DARK_TEXT_COLOR,
                      lineHeight: 1.2,
                      mb: 0.5,
                      maxWidth: "160px",
                    }}
                  >
                    {item.product.name}
                  </Typography>

                  <IconButton
                    aria-label="delete"
                    onClick={() => onRemove(item.product._id)}
                    size="small"
                    sx={{ color: "#e57373", p: 0.5, mt: -0.5, mr: -1 }}
                    disabled={isProcessing}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ color: PRIMARY_ACCENT, mb: 1, fontWeight: 500 }}
                >
                  {formatCurrency(item.product.price)} {/* <-- CAMBIO $ a € */}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    width: "fit-content",
                    bgcolor: "white",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => onDecrement(item.product._id, item.quantity)}
                    disabled={isProcessing}
                    sx={{ p: 0.5 }}
                  >
                    <RemoveIcon fontSize="small" sx={{ fontSize: "1rem" }} />
                  </IconButton>

                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      fontWeight: "bold",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() => onIncrement(item.product._id)}
                    disabled={isProcessing}
                    sx={{ p: 0.5, color: PRIMARY_ACCENT }}
                  >
                    <AddIcon fontSize="small" sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {validItems.length > 0 && (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e0e0e0",
            bgcolor: "#fff",
            position: "absolute",
            bottom: 0,
            width: "100%",
            boxShadow: "0px -2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: LOGO_COLOR, fontWeight: "bold" }}
            >
              {formatCurrency(subtotal)} {/* <-- CAMBIO $ a € */}
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to="/cart"
            variant="contained"
            fullWidth
            onClick={onClose}
            sx={{
              backgroundColor: LOGO_COLOR,
              py: 1.2,
              "&:hover": { backgroundColor: PRIMARY_ACCENT },
            }}
          >
            Ver Carrito Completo
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CartDrawerContent;
