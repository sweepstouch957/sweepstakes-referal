"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import WeeklyTvHero from "@public/win-a-weekly-tv-hero.png";

export default function Hero() {
  return (
    <Box sx={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <Image
        src={WeeklyTvHero}
        alt="Win a Weekly TV"
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
