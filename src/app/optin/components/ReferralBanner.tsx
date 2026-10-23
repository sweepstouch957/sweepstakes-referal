"use client";

import { Box, Container } from "@mui/material";

/** Banner configurable por tienda (panel > Recompensa por referidos > Banner). Sin URL no pinta nada. */
export default function ReferralBanner({ src, alt = "" }: { src?: string | null; alt?: string }) {
  if (!src) return null;
  return (
    <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 3 }, pt: { xs: 1, sm: 2 } }}>
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{ display: "block", width: "100%", borderRadius: 3, boxShadow: "0 8px 28px rgba(232,18,127,0.15)" }}
      />
    </Container>
  );
}
