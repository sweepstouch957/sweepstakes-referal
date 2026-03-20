"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import Navbar from "@/app/win-a-car/components/Navbar";

// ─── Redirect logic ─────────────────────────────────────────────────────────
// QR codes were generated pointing to:
//   /cupon?slug=key-food-supermarket-885-gerard-ave-bronx-ny-10452
//
// The new implementation lives at:
//   /cupon/[slug]
//
// This page reads the ?slug= query param and redirects transparently.
// ────────────────────────────────────────────────────────────────────────────

function CouponRedirecter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";

  useEffect(() => {
    if (slug) {
      // Preserve any other query params (e.g. referralcode)
      const rest = new URLSearchParams(searchParams.toString());
      rest.delete("slug");
      const extra = rest.toString() ? `?${rest.toString()}` : "";
      router.replace(`/cupon/${slug}${extra}`);
    }
  }, [slug, router, searchParams]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fff5f9 0%, #fff0f6 50%, #fff 100%)",
        gap: 2,
      }}
    >
      <CircularProgress
        size={48}
        thickness={4}
        sx={{ color: "#ff4b9b" }}
      />
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{
          background: "linear-gradient(90deg, #d7006e, #ff4b9b)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {slug ? "Cargando cupón..." : "Redirigiendo..."}
      </Typography>
    </Box>
  );
}

export default function CouponPage() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Navbar hideActions />
      <Suspense
        fallback={
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff5f9",
            }}
          >
            <CircularProgress sx={{ color: "#ff4b9b" }} />
          </Box>
        }
      >
        <CouponRedirecter />
      </Suspense>
    </Box>
  );
}
