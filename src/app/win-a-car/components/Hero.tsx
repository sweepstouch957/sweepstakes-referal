"use client";

import { Box, useMediaQuery } from "@mui/material";
import BgMobile from "@public/bg-mobile.webp";
import BgDesktop from "@public/big-image.webp";

export default function Hero() {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <Box
      sx={{
        width: "100%",
        backgroundImage: `
          linear-gradient(to bottom, rgba(255,255,255,0) 80%, rgba(255,255,255,1)),
          url(${isMobile ? BgMobile.src : BgDesktop.src})
        `,
        height: "100vh",
        marginTop: { xs: "48px", sm: "64px" },
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        color: "#fff",
        px: 2,
      }}
    ></Box>
  );
}
