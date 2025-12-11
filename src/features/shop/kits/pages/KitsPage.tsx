import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  PRIMARY_ACCENT,
  LOGO_COLOR,
  IMAGE_URL,
} from "../../../../config/constants";
import Loader from "../../../../components/common/Loader";

import { useKitsQuery } from "../hooks/useKitsQuery";

const KitsPage = () => {
  const { data: kits, isLoading, isError } = useKitsQuery();

  if (isLoading) return <Loader message="Cargando nuestros kits..." />;

  if (isError)
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Error al cargar los kits.</Alert>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: "bold", color: LOGO_COLOR, mb: 2 }}
        >
          Kits del Peregrino
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: "800px", mx: "auto" }}
        >
          Hemos preparado estos paquetes especiales con todo lo necesario para
          tu viaje. Ahorra tiempo y dinero llevando lo esencial en un solo pack.
        </Typography>
      </Box>

      {!kits || kits.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Aún no hay kits configurados. ¡Vuelve pronto! (Nota para el Admin:
          Crea productos en la ruta de kits)
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {kits.map((kit) => (
            <Grid key={kit._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={`${IMAGE_URL}/uploads/products/${kit.image}`}
                  alt={kit.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: "bold", color: LOGO_COLOR }}
                  >
                    {kit.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: PRIMARY_ACCENT, my: 1 }}
                  >
                    ${kit.price.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {kit.description.substring(0, 100)}...
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/products/${kit._id}`}
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: LOGO_COLOR,
                      "&:hover": { backgroundColor: PRIMARY_ACCENT },
                    }}
                  >
                    Ver Detalles del Kit
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

export default KitsPage;
