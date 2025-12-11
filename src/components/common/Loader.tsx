import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = ({ message = "Cargando datos..." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "300px",
        p: 4,
      }}
    >
      <CircularProgress color="primary" sx={{ mb: 2 }} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
