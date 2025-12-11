import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import App from "./App";
import { theme } from "./theme/theme";
import { AuthProvider } from "./features/auth/context/AuthContext";

const queryClient = new QueryClient();

// Asegúrate que 'root' coincide con el id del index.html
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento root en el HTML");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Esto resetea los estilos del navegador */}
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            {/* AuthProvider DEBE estar dentro de BrowserRouter si usa navegación interna */}
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
