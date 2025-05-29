"use client";

import { Suspense } from "react";
import { Box, CircularProgress, Container } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginWithOTP from "./components/LoginForm";

export default function WinACarLoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#18181B", // Tu color de fondo
      }}
    >
      <Navbar />

      <Box
        sx={{
          flex: 1, // Este hace que el contenido crezca para ocupar todo el espacio entre navbar y footer
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Suspense
          fallback={
            <Container maxWidth="sm" sx={{ my: 6 }}>
              <CircularProgress />
            </Container>
          }
        >
          <Box mt={{ xs: 4, sm: 6, md: 8 }}>
            <LoginWithOTP />
          </Box>
        </Suspense>
      </Box>

      <Footer />
    </Box>
  );
}
