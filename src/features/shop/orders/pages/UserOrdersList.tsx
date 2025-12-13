import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import { useMyOrdersQuery } from "../hooks/useOrdersQuery";
import Loader from "../../../../components/common/Loader";
import { LOGO_COLOR } from "../../../../config/constants";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { formatCurrency } from "../../../../utils/imageUtils"; // <-- Importar formatCurrency

type ChipColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

const UserOrdersList = () => {
  const { data: orders, isLoading, isError } = useMyOrdersQuery();

  if (isLoading)
    return (
      <Box sx={{ p: 2 }}>
        <Loader message="Cargando pedidos..." />
      </Box>
    );

  if (isError)
    return (
      <Alert severity="error">No se pudo cargar el historial de pedidos.</Alert>
    );

  if (!orders || orders.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <ShoppingBagIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
        <Typography color="text.secondary">
          No tienes pedidos realizados aún.
        </Typography>
      </Box>
    );
  }

  const getStatusColor = (status: string): ChipColor => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "shipped":
        return "info";
      case "delivered":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <List disablePadding>
        {orders.map((order, index) => (
          <React.Fragment key={order._id}>
            <ListItem
              alignItems="flex-start"
              sx={{ px: 0, py: 2 }}
              secondaryAction={
                <Typography
                  variant="h6"
                  sx={{ color: LOGO_COLOR, fontWeight: "bold" }}
                >
                  {formatCurrency(order.totalAmount)} {/* <-- CAMBIO $ a € */}
                </Typography>
              }
            >
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Pedido #{order._id.slice(-6).toUpperCase()}
                    </Typography>
                    <Chip
                      label={order.status}
                      size="small"
                      color={getStatusColor(order.status)}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                    {" — " +
                      order.items.length +
                      (order.items.length === 1 ? " producto" : " productos")}
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < orders.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default UserOrdersList;
