"use client";

import React from "react";
import { Box, useMediaQuery, useTheme, Skeleton } from "@mui/material";

interface DynamicHeroBannerProps {
  desktopSrc?: string;
  mobileSrc?: string;
  mainColor?: string;
  secondaryColor?: string;
  /** Opacity del overlay de gradiente (0-1). Default: 0.45 */
  overlayOpacity?: number;
  /** Height del banner en desktop. Default: "70vh" */
  desktopHeight?: string | number;
  /** Height del banner en mobile. Default: "45vh" */
  mobileHeight?: string | number;
  isLoading?: boolean;
  children?: React.ReactNode;
}

/**
 * Banner hero responsive dinámico.
 * Muestra bannerDesktop en md+ y bannerMobile en xs/sm.
 * Aplica un gradiente overlay con los colores del sweepstake.
 */
export default function DynamicHeroBanner({
  desktopSrc,
  mobileSrc,
  mainColor = "#ff4b9b",
  secondaryColor = "#c8104f",
  overlayOpacity = 0.4,
  desktopHeight = "68vh",
  mobileHeight = "42vh",
  isLoading = false,
  children,
}: DynamicHeroBannerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const activeSrc = isMobile ? (mobileSrc || desktopSrc) : (desktopSrc || mobileSrc);

  if (isLoading) {
    return (
      <Skeleton
        variant="rectangular"
        width="100%"
        sx={{
          height: { xs: mobileHeight, md: desktopHeight },
          display: "block",
        }}
      />
    );
  }

  // If no banner at all, render a solid color hero
  if (!activeSrc) {
    return (
      <Box
        sx={{
          width: "100%",
          height: { xs: mobileHeight, md: desktopHeight },
          background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: mobileHeight, md: desktopHeight },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fondo difuminado para rellenar los espacios cuando la imagen es contain */}
      <Box
        component="img"
        src={activeSrc}
        alt=""
        sx={{
          position: "absolute",
          inset: "-40px",
          width: "calc(100% + 80px)",
          height: "calc(100% + 80px)",
          objectFit: "cover",
          objectPosition: "center",
          filter: "blur(20px)",
          opacity: 0.6,
          display: "block",
          zIndex: 0,
        }}
      />

      {/* Background image principal (contain) */}
      <Box
        component="img"
        src={activeSrc}
        alt="Banner del sorteo"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          display: "block",
          zIndex: 1,
        }}
      />

      {/* Gradient overlay using sweepstake brand colors */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, 
            ${mainColor}${Math.round(overlayOpacity * 255).toString(16).padStart(2, "0")} 0%, 
            ${secondaryColor}${Math.round(overlayOpacity * 0.6 * 255).toString(16).padStart(2, "0")} 50%,
            transparent 100%)`,
        }}
      />

      {/* Bottom fade for smooth form transition */}
      <Box
        sx={{
          position: "absolute",
          bottom: -1,
          left: 0,
          right: 0,
          height: { xs: "60px", md: "80px" },
          background: "linear-gradient(to bottom, transparent 0%, #f8f9fc 100%)",
        }}
      />

      {children && (
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}
