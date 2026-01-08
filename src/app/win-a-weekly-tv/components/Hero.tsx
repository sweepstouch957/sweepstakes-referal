"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import WeeklyTvHeroDesktop from "@public/win-a-weekly-tv-hero.jpg";
import WeeklyTvHeroMobile from "@public/win-a-weekly-tv-hero-movil.png";

export default function Hero() {
  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
      {/* Desktop image */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Image
          src={WeeklyTvHeroDesktop}
          alt="Win a Weekly TV"
          style={{ width: "100%", height: "auto", display: "block" }}
          priority
        />
      </Box>

      {/* Mobile image */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Image
          src={WeeklyTvHeroMobile}
          alt="Win a Weekly TV"
          style={{ width: "100%", height: "auto", display: "block" }}
          priority
        />
      </Box>

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
