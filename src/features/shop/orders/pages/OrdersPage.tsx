import { Container, Typography, Paper, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import UserOrdersList from "./UserOrdersList";
import { LOGO_COLOR, PRIMARY_ACCENT } from "../../../../config/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const OrdersPage = () => {
  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <Button
          component={RouterLink}
          to="/profile"
          startIcon={<ArrowBackIcon />}
          sx={{ color: LOGO_COLOR }}
        >
          Volver
        </Button>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: LOGO_COLOR }}
        >
          Historial de Pedidos
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography
          variant="h6"
          sx={{
            borderBottom: `2px solid ${PRIMARY_ACCENT}`,
            pb: 2,
            mb: 3,
            color: LOGO_COLOR,
            fontWeight: "bold",
          }}
        >
          Mis Compras
        </Typography>

        <UserOrdersList />
      </Paper>
    </Container>
  );
};

export default OrdersPage;
