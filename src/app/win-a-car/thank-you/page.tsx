"use client";

import { Suspense } from "react";
import { Box, CircularProgress, Container } from "@mui/material";

import { ThankYouContainer } from "./components/container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function WinACarPage() {
  return (
    <>
      <Navbar />

      <Suspense
        fallback={
          <Container maxWidth="sm" sx={{ my: 6 }}>
            <CircularProgress />
          </Container>
        }
      >
        <Box
          mt={{xs: 4, sm: 6, md: 8}}
        >
          <ThankYouContainer />
        </Box>
      </Suspense>

      <Footer />
    </>
  );
}
