import { Box, Container, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PRIMARY_ACCENT } from "../../config/constants";

const HERO_IMAGE = "./public/licensed-image.jpg";

const HomePage = () => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        width: "100%",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${HERO_IMAGE}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 900,
            mb: 2,
            textShadow: "2px 2px 8px rgba(0,0,0,0.8)", // Aumenté la sombra para mejor lectura
            fontStyle: "italic",
            letterSpacing: 2,
          }}
        >
          Mi Pagina
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mb: 4,
            fontWeight: 300,
            textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          Bienvenido a mi pagina
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            component={RouterLink}
            to="/tienda"
            variant="contained"
            size="large"
            sx={{
              bgcolor: PRIMARY_ACCENT,
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              "&:hover": { bgcolor: "#fff", color: PRIMARY_ACCENT },
            }}
          >
            Visitar Tienda
          </Button>

          <Button
            component={RouterLink}
            to="/blog"
            variant="outlined"
            size="large"
            sx={{
              color: "#fff",
              borderColor: "#fff",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
                borderColor: "#fff",
              },
            }}
          >
            Leer Blog
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
