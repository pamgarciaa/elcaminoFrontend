import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import { IMAGE_URL } from "../../api/axios.client";
import {
  PRIMARY_ACCENT,
  LOGO_COLOR1,
  LOGO_COLOR,
  SECONDARY_TEXT_COLOR,
} from "../../config/constants";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag"; // Icono para el botón

const ProfilePage = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader message="Cargando datos del usuario..." />;

  if (!user) return null;

  let profileImageUrl = user.profilePicture;
  if (profileImageUrl && !profileImageUrl.startsWith("http")) {
    profileImageUrl = `${IMAGE_URL}/uploads/users/${profileImageUrl}`;
  }

  const displayName = user.name || user.username || "Usuario";
  const initial =
    user.name && user.name.length > 0
      ? user.name[0]
      : user.username
      ? user.username[0]
      : "U";

  const formattedRole =
    user.role && user.role.length > 0
      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
      : "N/A";

  const profileDetails = [
    { label: "Usuario", value: user.username },
    { label: "Email", value: user.email },
    { label: "Rol", value: formattedRole },
    { label: "Teléfono", value: user.phone || "Sin registrar" },
    { label: "Dirección", value: user.address || "Sin registrar" },
  ];

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: LOGO_COLOR1,
          textAlign: "center",
        }}
      >
        Mi Cuenta
      </Typography>

      <Paper elevation={3} sx={{ p: 5 }}>
        {/* CABECERA Y AVATAR */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Avatar
            src={profileImageUrl}
            alt={user.name}
            sx={{
              width: 120,
              height: 120,
              bgcolor: PRIMARY_ACCENT,
              mb: 2,
              fontSize: "2.5rem",
            }}
          >
            {initial}
          </Avatar>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: LOGO_COLOR }}
          >
            {displayName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.name} {user.lastName}
          </Typography>
        </Box>

        {/* DETALLES */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              borderBottom: `2px solid ${PRIMARY_ACCENT}`,
              pb: 1,
              mb: 3,
              color: LOGO_COLOR,
            }}
          >
            Información Personal
          </Typography>

          <Grid container spacing={2}>
            {profileDetails.map(({ label, value }) => (
              <Grid size={{ xs: 12, sm: 6 }} key={label}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: "bold",
                    color: SECONDARY_TEXT_COLOR,
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* BOTONES DE ACCIÓN */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* 1. Botón Editar */}
          <Button
            component={RouterLink}
            to="/profile/edit"
            variant="outlined"
            fullWidth
            sx={{
              color: LOGO_COLOR,
              borderColor: LOGO_COLOR,
              "&:hover": {
                borderColor: PRIMARY_ACCENT,
                backgroundColor: PRIMARY_ACCENT + "10",
              },
            }}
          >
            Editar Información
          </Button>

          {/* 2. NUEVO BOTÓN: Ver Pedidos */}
          <Button
            component={RouterLink}
            to="/orders" // Enlace a la nueva página
            variant="contained"
            fullWidth
            startIcon={<ShoppingBagIcon />}
            sx={{
              backgroundColor: PRIMARY_ACCENT,
              "&:hover": { backgroundColor: LOGO_COLOR },
              py: 1.5,
            }}
          >
            Ver Mis Pedidos
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
