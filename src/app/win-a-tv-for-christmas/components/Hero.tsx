"use client";

import { Box, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useLanguage } from "@/libs/context/LanguageContext";

export default function Hero() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { language } = useLanguage();

  // Imágenes servidas desde /public
  const selectedImage = isMobile
    ? "/win-a-tv/hero-mobile.jpg"
    : "/win-a-tv/hero-desktop.webp";

  return (
    <Box sx={{ width: "100%", position: "relative", mt: { xs: 6, sm: 8 } }}>
      <Image
        key={`${language}-${isMobile}`} // Forzamos a Next.js a recargar la imagen cuando cambia
        src={selectedImage}
        alt="Hero"
        style={{ width: "100%", height: "auto", display: "block" }}
        width={1920}
        height={1080}
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
