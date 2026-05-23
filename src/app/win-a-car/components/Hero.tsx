"use client";

import { Box, useMediaQuery } from "@mui/material";
import Image from "next/image";
import BgMobileEn from "@public/bg-mobile.webp";
import BgMobileEs from "@public/BgMobileEs.webp";
import BgDesktop from "@public/big-image.webp";
import { useLanguage } from "@/libs/context/LanguageContext";
import { useEffect, useRef } from "react";
import { heroImageIn } from "@/utils/animations";

export default function Hero() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { language } = useLanguage();
  const imgRef = useRef<HTMLDivElement>(null);

  const selectedImage = isMobile
    ? language === "en"
      ? BgMobileEn
      : BgMobileEs
    : BgDesktop;

  useEffect(() => {
    if (imgRef.current) heroImageIn(imgRef.current);
  }, []);

  return (
    <Box sx={{ width: "100%", position: "relative", mt: { xs: 6, sm: 8 } }}>
      <Box ref={imgRef} sx={{ opacity: 0 }}>
        <Image
          key={`${language}-${isMobile}`}
          src={selectedImage}
          alt="Hero"
          style={{ width: "100%", height: "auto", display: "block" }}
          priority
        />
      </Box>

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
