"use client";

import { Box, Container } from "@mui/material";

type Props = { desktop?: string | null; mobile?: string | null; alt?: string; attached?: boolean; inline?: boolean };

/**
 * Banner configurable por tienda (panel > Recompensa por referidos). Desktop = el grande y
 * ancho; mobile = vertical/cuadrado para celular (si falta, se usa el desktop). Sin URLs no pinta nada.
 * `attached`: va pegado a la tarjeta de la tienda (mismo ancho, sin esquinas abajo, sin hueco).
 */
export default function ReferralBanner({ desktop, mobile, alt = "", attached = false, inline = false }: Props) {
  const mob = mobile || desktop;
  const desk = desktop || mobile;
  if (!desk) return null;
  // `inline`: primer hijo de una tarjeta (thank-you / mis referidos): sólo la imagen, a su ancho.
  if (inline) {
    return (
      <Box component="picture" sx={{ display: "block", "& img": { display: "block", width: "100%" } }}>
        {mob !== desk && <source media="(max-width: 599px)" srcSet={mob || undefined} />}
        <img src={desk} alt={alt} />
      </Box>
    );
  }
  return (
    <Container maxWidth="sm" sx={{ px: { xs: 1.5, sm: 3 }, pt: { xs: 1, sm: 2 }, pb: attached ? 0 : { xs: 1, sm: 2 } }}>
      <Box
        component="picture"
        sx={{
          display: "block",
          "& img": {
            display: "block",
            width: "100%",
            borderRadius: attached ? "12px 12px 0 0" : 3,
            border: "1px solid rgba(232,18,127,0.14)",
            borderBottom: attached ? "none" : undefined,
          },
        }}
      >
        {mob !== desk && <source media="(max-width: 599px)" srcSet={mob || undefined} />}
        <img src={desk} alt={alt} />
      </Box>
    </Container>
  );
}
