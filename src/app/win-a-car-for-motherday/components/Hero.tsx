"use client";

import { Box } from "@mui/material";
import Image from "next/image";

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
          backgroundColor: "#b40e3b",
          display: { xs: "block", sm: "none" }
        }}
      >
        <Image
          src="/images/BannerDiaMadresMobile.jpg"
          alt="Win a Car for Mother's Day"
          priority
          width={1080}
          height={1920}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover"
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

      <Box
        sx={{
          position: "relative",
          width: "100%",
          isolation: "isolate",
          backgroundColor: "#b40e3b",
          display: { xs: "none", sm: "block" }
        }}
      >
        <Image
          src="/images/BannerDiaMadreDesktop.png"
          alt="Win a Car for Mother's Day"
          priority
          width={1920}
          height={1080}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "cover"
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "20%",
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 28%, rgba(255,255,255,0.62) 62%, rgba(255,255,255,0.96) 88%, #ffffff 100%)",
          }}
        />
      </Box>
    </Box>
  );
}
