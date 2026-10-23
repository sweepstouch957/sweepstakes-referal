"use client";

import { Box, Container } from "@mui/material";

type Props = { desktop?: string | null; mobile?: string | null; alt?: string };

/**
 * Banner configurable por tienda (panel > Recompensa por referidos). Desktop = el grande y
 * ancho; mobile = vertical/cuadrado para celular (si falta, se usa el desktop). Sin URLs no pinta nada.
 */
export default function ReferralBanner({ desktop, mobile, alt = "" }: Props) {
  const mob = mobile || desktop;
  const desk = desktop || mobile;
  if (!desk) return null;
  return (
    <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 3 }, pt: { xs: 1, sm: 2 } }}>
      <Box
        component="picture"
        sx={{ display: "block", "& img": { display: "block", width: "100%", borderRadius: 3 } }}
      >
        {mob !== desk && <source media="(max-width: 599px)" srcSet={mob || undefined} />}
        <img src={desk} alt={alt} />
      </Box>
    </Container>
  );
}
