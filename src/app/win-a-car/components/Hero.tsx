"use client";

import { Box, useMediaQuery } from "@mui/material";
import Image from "next/image";
import BgMobile from "@public/bg-mobile.webp";
import BgDesktop from "@public/big-image.webp";

export default function Hero() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const selectedImage = isMobile ? BgMobile : BgDesktop;

  return (
    <Box sx={{ width: "100%", position: "relative", mt: { xs: 6, sm: 8 } }}>
      {/* Imagen responsiva */}
      <Image
        src={selectedImage}
        alt="Hero"
        style={{ width: "100%", height: "auto", display: "block" }}
        priority
      />

      {/* Sombra inferior */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "15%",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}
