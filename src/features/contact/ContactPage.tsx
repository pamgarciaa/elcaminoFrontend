import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email"; // ⬅️ Nuevo Icono
import {
  LOGO_COLOR,
  PRIMARY_ACCENT,
  SECONDARY_TEXT_COLOR,
} from "../../config/constants";

const ContactPage = () => {
  const phoneNumber = "+34697446609";
  const displayNumber = "+34 697 44 66 09";
  const emailAddress = "elcamino@gmail.com";

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 5,
          textAlign: "center",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", color: LOGO_COLOR, mb: 1 }}
        >
          Contáctanos
        </Typography>

        <Box
          sx={{
            width: 50,
            height: 4,
            backgroundColor: PRIMARY_ACCENT,
            mb: 2,
            borderRadius: 2,
          }}
        />

        <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
          Estamos aquí para ayudarte. Elige tu método preferido:
        </Typography>

        {/* --- SECCIÓN TELÉFONO --- */}
        <Box sx={{ width: "100%", mb: 2 }}>
          <Typography
            variant="overline"
            display="block"
            sx={{ color: SECONDARY_TEXT_COLOR, fontWeight: "bold", mb: 1 }}
          >
            LLÁMANOS O WHATSAPP
          </Typography>

          <Typography
            variant="h4"
            component="a"
            href={`tel:${phoneNumber}`}
            sx={{
              color: PRIMARY_ACCENT,
              textDecoration: "none",
              fontWeight: "900",
              display: "block",
              mb: 2,
              transition: "0.3s",
              "&:hover": { color: LOGO_COLOR },
            }}
          >
            {displayNumber}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              startIcon={<PhoneIcon />}
              href={`tel:${phoneNumber}`}
              sx={{
                backgroundColor: LOGO_COLOR,
                "&:hover": { backgroundColor: PRIMARY_ACCENT },
              }}
            >
              Llamar
            </Button>

            <Button
              variant="outlined"
              startIcon={<WhatsAppIcon />}
              href={`https://wa.me/${phoneNumber.replace("+", "")}`}
              target="_blank"
              sx={{
                color: LOGO_COLOR,
                borderColor: LOGO_COLOR,
                "&:hover": {
                  borderColor: PRIMARY_ACCENT,
                  color: PRIMARY_ACCENT,
                },
              }}
            >
              WhatsApp
            </Button>
          </Box>
        </Box>

        <Divider flexItem sx={{ my: 1 }}>
          O
        </Divider>

        {/* --- SECCIÓN EMAIL --- */}
        <Box sx={{ width: "100%" }}>
          <Typography
            variant="overline"
            display="block"
            sx={{ color: SECONDARY_TEXT_COLOR, fontWeight: "bold", mb: 1 }}
          >
            ESCRÍBENOS UN CORREO
          </Typography>

          <Typography
            variant="h5"
            component="a"
            href={`mailto:${emailAddress}`}
            sx={{
              color: PRIMARY_ACCENT,
              textDecoration: "none",
              fontWeight: "bold",
              display: "block",
              mb: 2,
              transition: "0.3s",
              "&:hover": { color: LOGO_COLOR },
            }}
          >
            {emailAddress}
          </Typography>

          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            href={`mailto:${emailAddress}`}
            sx={{
              color: LOGO_COLOR,
              borderColor: LOGO_COLOR,
              "&:hover": { borderColor: PRIMARY_ACCENT, color: PRIMARY_ACCENT },
            }}
          >
            Enviar Email
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContactPage;
