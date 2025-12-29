import WinnerReveal from "@/components/WinnerReveal";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import { Suspense } from "react";
import Footer from "../components/Footer";
import { Container, Skeleton } from "@mui/material";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <Navbar />

      <Suspense
        fallback={
          <Container maxWidth="sm" sx={{ my: 6 }}>
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={60} sx={{ mb: 2 }} />
            <Skeleton height={60} />
          </Container>
        }
      >
        <WinnerReveal  />
      </Suspense>

      <Footer />
    </>
  );
}
