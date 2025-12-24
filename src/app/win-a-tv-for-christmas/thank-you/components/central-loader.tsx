import {
  Container,
  Box,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";

export function CenteredLoader({ text = "Cargando información..." }) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#fdf6fb",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "40vh",
        }}
      >
        <CircularProgress
          size={56}
          thickness={4}
          sx={{ color: "#c62828", mb: 3 }}
        />
        <Typography
          variant="h6"
          fontWeight={700}
          color="#c62828"
          mb={2}
          sx={{
            letterSpacing: 0.5,
            textShadow: "0 2px 16px #c6282822",
          }}
        >
          {text}
        </Typography>
        {/* Skeleton visual hint */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={50}
          sx={{ borderRadius: 2, mb: 2, maxWidth: 320 }}
        />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>
    </Container>
  );
}
