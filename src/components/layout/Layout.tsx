import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Box } from "@mui/material";

const Layout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* 1. La Barra de Navegación siempre visible */}
      <Header />

      {/* 2. El contenido de las páginas cambiará aquí gracias a Outlet */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default" }}>
        <Outlet />
      </Box>

      {/* 3. Footer */}
      <Box
        component="footer"
        sx={{ py: 3, textAlign: "center", bgcolor: "#f5f5f5", mt: "auto" }}
      >
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#666" }}>
          &copy; {new Date().getFullYear()} El Camino Backend Project
        </p>
      </Box>
    </Box>
  );
};

export default Layout;
