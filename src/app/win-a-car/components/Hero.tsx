"use client";

import { Box, useMediaQuery } from "@mui/material";
import Image from "next/image";
import BgMobileEn from "@public/bg-mobile.webp"; // Asegúrate de tener estas imágenes
import BgMobileEs from "@public/BgMobileEs.webp";
import BgDesktop from "@public/big-image.webp";
import { useLanguage } from "@/libs/context/LanguageContext";

export default function Hero() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { language } = useLanguage();

  const selectedImage = isMobile
    ? language === "en"
      ? BgMobileEn
      : BgMobileEs
    : BgDesktop;

  return (
    <Box sx={{ width: "100%", position: "relative", mt: { xs: 6, sm: 8 } }}>
      <Image
        key={`${language}-${isMobile}`} // Forzamos a Next.js a recargar la imagen cuando cambia
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
