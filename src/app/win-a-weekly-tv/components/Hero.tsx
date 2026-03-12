"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import WeeklyTvHero from "@public/weekly-tv-hero-new.jpg";

export default function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        mt: 0,
        mb: { xs: -0.15, md: -0.2 },
        lineHeight: 0,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          isolation: "isolate",
          backgroundColor: "#ff4cb1",
        }}
      >
        <Image
          src={WeeklyTvHero}
          alt="Win a Weekly TV"
          priority
          width={WeeklyTvHero.width}
          height={WeeklyTvHero.height}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: { xs: "24%", md: "20%" },
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 28%, rgba(255,255,255,0.62) 62%, rgba(255,255,255,0.96) 88%, #ffffff 100%)",
          }}
        />
      </Box>
    </Box>
  );
}
